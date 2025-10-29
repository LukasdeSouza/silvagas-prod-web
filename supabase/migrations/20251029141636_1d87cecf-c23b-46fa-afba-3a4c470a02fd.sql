-- Create addresses table
CREATE TABLE public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  rua TEXT NOT NULL,
  numero TEXT NOT NULL,
  bairro TEXT NOT NULL,
  complemento TEXT,
  cep TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on addresses
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- RLS policies for addresses
CREATE POLICY "Users can view their own addresses"
ON public.addresses
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own addresses"
ON public.addresses
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses"
ON public.addresses
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses"
ON public.addresses
FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all addresses"
ON public.addresses
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add address_id to orders table
ALTER TABLE public.orders ADD COLUMN address_id UUID REFERENCES public.addresses(id);

-- Create trigger for addresses updated_at
CREATE TRIGGER update_addresses_updated_at
BEFORE UPDATE ON public.addresses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();