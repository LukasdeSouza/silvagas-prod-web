-- Add points column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN points integer NOT NULL DEFAULT 0;

-- Add check constraint to prevent negative points
ALTER TABLE public.profiles
ADD CONSTRAINT points_non_negative CHECK (points >= 0);

-- Create function to update user points based on order status changes
CREATE OR REPLACE FUNCTION public.update_user_points()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if status changed
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    
    -- Add 30 points when order is completed
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
      UPDATE public.profiles
      SET points = points + 30
      WHERE id = NEW.user_id;
    END IF;
    
    -- Remove 30 points when order is cancelled
    IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
      UPDATE public.profiles
      SET points = GREATEST(points - 30, 0)
      WHERE id = NEW.user_id;
    END IF;
    
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on orders table
CREATE TRIGGER on_order_status_change
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_points();