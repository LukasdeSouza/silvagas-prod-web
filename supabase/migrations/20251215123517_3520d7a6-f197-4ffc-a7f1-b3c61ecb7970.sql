-- Add payment method columns to orders table
ALTER TABLE public.orders
ADD COLUMN payment_method text DEFAULT 'cash',
ADD COLUMN change_for numeric;

-- Add comment to document valid payment methods
COMMENT ON COLUMN public.orders.payment_method IS 'Payment method: cash, pix, credit_card, debit_card';