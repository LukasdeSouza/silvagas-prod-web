-- Make user_id nullable in products table
ALTER TABLE public.products ALTER COLUMN user_id DROP NOT NULL;

-- Make user_id nullable in accessories table
ALTER TABLE public.accessories ALTER COLUMN user_id DROP NOT NULL;

-- Drop old RLS policies for products
DROP POLICY IF EXISTS "Users can create their own products" ON public.products;
DROP POLICY IF EXISTS "Users can update their own products" ON public.products;
DROP POLICY IF EXISTS "Users can delete their own products" ON public.products;

-- Drop old RLS policies for accessories
DROP POLICY IF EXISTS "Users can create their own accessories" ON public.accessories;
DROP POLICY IF EXISTS "Users can update their own accessories" ON public.accessories;
DROP POLICY IF EXISTS "Users can delete their own accessories" ON public.accessories;

-- Create new admin-only policies for products
CREATE POLICY "Admins can create products" ON public.products
FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update products" ON public.products
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete products" ON public.products
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create new admin-only policies for accessories
CREATE POLICY "Admins can create accessories" ON public.accessories
FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update accessories" ON public.accessories
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete accessories" ON public.accessories
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));