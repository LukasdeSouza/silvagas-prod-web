-- Create sorteios table
CREATE TABLE public.sorteios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  product_id UUID REFERENCES public.products(id),
  image_url TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sorteio_participants table for many-to-many relationship
CREATE TABLE public.sorteio_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sorteio_id UUID NOT NULL REFERENCES public.sorteios(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(sorteio_id, user_id)
);

-- Enable RLS on sorteios
ALTER TABLE public.sorteios ENABLE ROW LEVEL SECURITY;

-- RLS policies for sorteios
CREATE POLICY "Users can view all sorteios"
ON public.sorteios
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create sorteios"
ON public.sorteios
FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own sorteios"
ON public.sorteios
FOR UPDATE
USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own sorteios"
ON public.sorteios
FOR DELETE
USING (auth.uid() = created_by);

CREATE POLICY "Admins can manage all sorteios"
ON public.sorteios
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Enable RLS on sorteio_participants
ALTER TABLE public.sorteio_participants ENABLE ROW LEVEL SECURITY;

-- RLS policies for sorteio_participants
CREATE POLICY "Users can view all sorteio participants"
ON public.sorteio_participants
FOR SELECT
USING (true);

CREATE POLICY "Sorteio creators can manage participants"
ON public.sorteio_participants
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.sorteios
    WHERE sorteios.id = sorteio_participants.sorteio_id
    AND sorteios.created_by = auth.uid()
  )
);

CREATE POLICY "Admins can manage all participants"
ON public.sorteio_participants
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for sorteios updated_at
CREATE TRIGGER update_sorteios_updated_at
BEFORE UPDATE ON public.sorteios
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for sorteio images
INSERT INTO storage.buckets (id, name, public)
VALUES ('sorteio-images', 'sorteio-images', true);

-- Storage policies for sorteio images
CREATE POLICY "Anyone can view sorteio images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'sorteio-images');

CREATE POLICY "Authenticated users can upload sorteio images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'sorteio-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own sorteio images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'sorteio-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own sorteio images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'sorteio-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);