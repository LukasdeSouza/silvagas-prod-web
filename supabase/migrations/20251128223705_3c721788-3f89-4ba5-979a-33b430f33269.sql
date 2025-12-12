-- Create points redemption levels table
CREATE TABLE public.points_redemption_levels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  points_required INTEGER NOT NULL,
  discount_amount NUMERIC NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.points_redemption_levels ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view active redemption levels"
ON public.points_redemption_levels
FOR SELECT
USING (is_active = true OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can create redemption levels"
ON public.points_redemption_levels
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update redemption levels"
ON public.points_redemption_levels
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete redemption levels"
ON public.points_redemption_levels
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_points_redemption_levels_updated_at
BEFORE UPDATE ON public.points_redemption_levels
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();