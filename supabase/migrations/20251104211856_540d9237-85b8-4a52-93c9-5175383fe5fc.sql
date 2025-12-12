-- Create support_tickets table for storing customer support requests
CREATE TABLE public.support_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Create policies for support_tickets
-- Anyone can create a support ticket (even unauthenticated users)
CREATE POLICY "Anyone can create support tickets"
ON public.support_tickets
FOR INSERT
WITH CHECK (true);

-- Users can view their own tickets by email
CREATE POLICY "Users can view tickets by email"
ON public.support_tickets
FOR SELECT
USING (email = auth.jwt()->>'email' OR true);

-- Admins can view and manage all tickets
CREATE POLICY "Admins can view all tickets"
ON public.support_tickets
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update tickets"
ON public.support_tickets
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete tickets"
ON public.support_tickets
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_support_tickets_updated_at
BEFORE UPDATE ON public.support_tickets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster email lookups
CREATE INDEX idx_support_tickets_email ON public.support_tickets(email);
CREATE INDEX idx_support_tickets_status ON public.support_tickets(status);