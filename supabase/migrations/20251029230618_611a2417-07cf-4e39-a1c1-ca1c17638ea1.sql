-- Add start_date and end_date columns to sorteios table
ALTER TABLE public.sorteios
ADD COLUMN start_date timestamp with time zone NOT NULL DEFAULT now(),
ADD COLUMN end_date timestamp with time zone NOT NULL DEFAULT (now() + interval '7 days');