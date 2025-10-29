-- Remove user_id column from products table
ALTER TABLE public.products DROP COLUMN IF EXISTS user_id;

-- Remove user_id column from accessories table
ALTER TABLE public.accessories DROP COLUMN IF EXISTS user_id;