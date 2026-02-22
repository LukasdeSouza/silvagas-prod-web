
-- Update calculate_points_discount to use redemption levels
CREATE OR REPLACE FUNCTION public.calculate_points_discount(_user_id uuid, _points_to_use integer)
 RETURNS TABLE(available_points integer, points_to_use integer, discount_amount numeric, success boolean, message text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  user_points integer;
  level_discount numeric;
  level_points integer;
BEGIN
  -- Get user's current points
  SELECT points INTO user_points
  FROM public.profiles
  WHERE id = _user_id;

  IF user_points IS NULL THEN
    RETURN QUERY SELECT 0, 0, 0::numeric, false, 'Usuário não encontrado'::text;
    RETURN;
  END IF;

  IF _points_to_use <= 0 THEN
    RETURN QUERY SELECT user_points, 0, 0::numeric, false, 'Valor inválido'::text;
    RETURN;
  END IF;

  IF _points_to_use > user_points THEN
    RETURN QUERY SELECT user_points, 0, 0::numeric, false, 'Pontos insuficientes'::text;
    RETURN;
  END IF;

  -- Find matching redemption level
  SELECT prl.points_required, prl.discount_amount
  INTO level_points, level_discount
  FROM public.points_redemption_levels prl
  WHERE prl.is_active = true
    AND prl.points_required = _points_to_use
  LIMIT 1;

  IF level_discount IS NULL THEN
    RETURN QUERY SELECT user_points, _points_to_use, 0::numeric, false, 
      'Nenhum nível de resgate encontrado para essa quantidade de pontos. Escolha um dos pacotes disponíveis.'::text;
    RETURN;
  END IF;

  RETURN QUERY SELECT 
    user_points,
    level_points,
    level_discount,
    true,
    'Desconto calculado com sucesso'::text;
END;
$function$;

-- Update apply_points_discount to use redemption levels
CREATE OR REPLACE FUNCTION public.apply_points_discount(_order_id uuid, _user_id uuid, _points_to_use integer)
 RETURNS TABLE(success boolean, message text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  user_points integer;
  level_discount numeric;
BEGIN
  -- Get user's current points
  SELECT points INTO user_points
  FROM public.profiles
  WHERE id = _user_id;

  -- Validate points
  IF _points_to_use > user_points THEN
    RETURN QUERY SELECT false, 'Pontos insuficientes'::text;
    RETURN;
  END IF;

  -- Find matching redemption level
  SELECT prl.discount_amount INTO level_discount
  FROM public.points_redemption_levels prl
  WHERE prl.is_active = true
    AND prl.points_required = _points_to_use
  LIMIT 1;

  IF level_discount IS NULL THEN
    RETURN QUERY SELECT false, 'Nível de resgate não encontrado para essa quantidade de pontos'::text;
    RETURN;
  END IF;

  -- Deduct points from user
  UPDATE public.profiles
  SET points = points - _points_to_use
  WHERE id = _user_id;

  -- Update order with points used and discount
  UPDATE public.orders
  SET 
    points_used = _points_to_use,
    discount_amount = level_discount
  WHERE id = _order_id;

  RETURN QUERY SELECT true, 'Desconto de R$ ' || level_discount::text || ' aplicado com sucesso'::text;
END;
$function$;
