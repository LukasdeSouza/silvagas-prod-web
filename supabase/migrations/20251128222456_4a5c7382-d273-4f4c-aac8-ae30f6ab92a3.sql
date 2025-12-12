-- Add optional points configuration to products table
ALTER TABLE public.products 
ADD COLUMN points_value integer DEFAULT 0 NOT NULL;

-- Add optional fields to orders for points redemption (NULLABLE to not break existing app)
ALTER TABLE public.orders 
ADD COLUMN points_used integer DEFAULT 0,
ADD COLUMN discount_amount numeric DEFAULT 0;

-- Update the existing trigger to handle points earned from completed orders
DROP TRIGGER IF EXISTS on_order_status_change ON public.orders;
DROP FUNCTION IF EXISTS public.update_user_points();

CREATE OR REPLACE FUNCTION public.update_user_points()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  earned_points integer := 0;
  item RECORD;
BEGIN
  -- Check if status changed
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    
    -- Add points when order is completed (based on products purchased)
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
      -- Calculate total points from all order items
      FOR item IN 
        SELECT oi.quantity, p.points_value
        FROM public.order_items oi
        JOIN public.products p ON p.id = oi.product_id
        WHERE oi.order_id = NEW.id
      LOOP
        earned_points := earned_points + (item.quantity * COALESCE(item.points_value, 0));
      END LOOP;
      
      -- Add earned points to user profile
      UPDATE public.profiles
      SET points = points + earned_points
      WHERE id = NEW.user_id;
    END IF;
    
    -- Return points when order is cancelled (if points were used)
    IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
      IF NEW.points_used IS NOT NULL AND NEW.points_used > 0 THEN
        UPDATE public.profiles
        SET points = points + NEW.points_used
        WHERE id = NEW.user_id;
      END IF;
    END IF;
    
  END IF;
  
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER on_order_status_change
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_points();

-- Create function to validate and calculate discount for mobile app
CREATE OR REPLACE FUNCTION public.calculate_points_discount(
  _user_id uuid,
  _points_to_use integer
)
RETURNS TABLE(
  available_points integer,
  points_to_use integer,
  discount_amount numeric,
  success boolean,
  message text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_points integer;
BEGIN
  -- Get user's current points
  SELECT points INTO user_points
  FROM public.profiles
  WHERE id = _user_id;
  
  -- Check if user has enough points
  IF user_points IS NULL THEN
    RETURN QUERY SELECT 0, 0, 0::numeric, false, 'Usuário não encontrado';
    RETURN;
  END IF;
  
  IF _points_to_use > user_points THEN
    RETURN QUERY SELECT user_points, 0, 0::numeric, false, 'Pontos insuficientes';
    RETURN;
  END IF;
  
  IF _points_to_use < 0 THEN
    RETURN QUERY SELECT user_points, 0, 0::numeric, false, 'Valor inválido';
    RETURN;
  END IF;
  
  -- Calculate discount (1 point = R$ 0.10)
  RETURN QUERY SELECT 
    user_points,
    _points_to_use,
    (_points_to_use * 0.10)::numeric as discount,
    true,
    'Desconto calculado com sucesso'::text;
END;
$$;

-- Create function to apply points discount (to be called when creating order)
CREATE OR REPLACE FUNCTION public.apply_points_discount(
  _order_id uuid,
  _user_id uuid,
  _points_to_use integer
)
RETURNS TABLE(
  success boolean,
  message text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_points integer;
  calculated_discount numeric;
BEGIN
  -- Get user's current points
  SELECT points INTO user_points
  FROM public.profiles
  WHERE id = _user_id;
  
  -- Validate
  IF _points_to_use > user_points THEN
    RETURN QUERY SELECT false, 'Pontos insuficientes';
    RETURN;
  END IF;
  
  -- Calculate discount
  calculated_discount := (_points_to_use * 0.10)::numeric;
  
  -- Deduct points from user
  UPDATE public.profiles
  SET points = points - _points_to_use
  WHERE id = _user_id;
  
  -- Update order with points used and discount
  UPDATE public.orders
  SET 
    points_used = _points_to_use,
    discount_amount = calculated_discount
  WHERE id = _order_id;
  
  RETURN QUERY SELECT true, 'Desconto aplicado com sucesso';
END;
$$;