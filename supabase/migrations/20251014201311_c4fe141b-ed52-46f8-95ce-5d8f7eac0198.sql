-- Adicionar coluna product_id na tabela notifications
ALTER TABLE public.notifications
ADD COLUMN product_id uuid REFERENCES public.products(id) ON DELETE SET NULL;

-- Criar índice para melhor performance
CREATE INDEX idx_notifications_product_id ON public.notifications(product_id);