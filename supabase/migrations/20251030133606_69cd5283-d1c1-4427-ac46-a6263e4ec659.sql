-- Remove customer information columns from orders table
-- This data can be retrieved from profiles table using user_id when needed
ALTER TABLE orders 
DROP COLUMN customer_name,
DROP COLUMN customer_email,
DROP COLUMN customer_phone;