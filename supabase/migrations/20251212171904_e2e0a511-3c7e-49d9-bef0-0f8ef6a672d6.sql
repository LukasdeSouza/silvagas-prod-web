-- Create partners table
CREATE TABLE public.partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  logo_url TEXT,
  coupon_code TEXT NOT NULL,
  discount_amount NUMERIC NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Everyone can view active partners
CREATE POLICY "Users can view active partners"
ON public.partners
FOR SELECT
USING (is_active = true OR has_role(auth.uid(), 'admin'::app_role));

-- Only admins can manage partners
CREATE POLICY "Admins can create partners"
ON public.partners
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update partners"
ON public.partners
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete partners"
ON public.partners
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_partners_updated_at
BEFORE UPDATE ON public.partners
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for partner logos
INSERT INTO storage.buckets (id, name, public) VALUES ('partner-logos', 'partner-logos', true);

-- Storage policies for partner logos
CREATE POLICY "Partner logos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'partner-logos');

CREATE POLICY "Admins can upload partner logos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'partner-logos' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update partner logos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'partner-logos' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete partner logos"
ON storage.objects FOR DELETE
USING (bucket_id = 'partner-logos' AND has_role(auth.uid(), 'admin'::app_role));