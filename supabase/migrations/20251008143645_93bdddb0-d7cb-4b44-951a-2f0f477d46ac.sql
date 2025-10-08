-- Create accessories table
CREATE TABLE public.accessories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.accessories ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view all accessories" 
ON public.accessories 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own accessories" 
ON public.accessories 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own accessories" 
ON public.accessories 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own accessories" 
ON public.accessories 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_accessories_updated_at
BEFORE UPDATE ON public.accessories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();