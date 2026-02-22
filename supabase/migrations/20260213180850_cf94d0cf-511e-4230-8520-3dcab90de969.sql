
-- Drop duplicate trigger (correct name) and function with CASCADE
DROP TRIGGER IF EXISTS on_order_complete_give_points ON public.orders;
DROP FUNCTION IF EXISTS public.give_points_on_order_complete() CASCADE;

-- Ensure the update_user_points trigger exists
DROP TRIGGER IF EXISTS update_user_points ON public.orders;
CREATE TRIGGER update_user_points
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_points();
