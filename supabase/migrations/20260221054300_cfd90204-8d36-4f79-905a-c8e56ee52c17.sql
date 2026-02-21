
-- Create updated_at function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create orders table for tracking
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL DEFAULT 'WE-' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0'),
  customer_name TEXT NOT NULL,
  customer_cpf TEXT,
  customer_phone TEXT,
  customer_email TEXT,
  shipping_address TEXT,
  shipping_city TEXT,
  shipping_state TEXT,
  shipping_cep TEXT,
  status TEXT NOT NULL DEFAULT 'confirmed',
  tracking_code TEXT,
  payment_method TEXT DEFAULT 'pix',
  payment_status TEXT DEFAULT 'pending',
  subtotal NUMERIC NOT NULL DEFAULT 0,
  discount NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  session_id TEXT,
  pix_order_id TEXT,
  status_history JSONB NOT NULL DEFAULT '[]'::jsonb,
  estimated_delivery DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert orders"
ON public.orders FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public read orders by session"
ON public.orders FOR SELECT
USING (true);

CREATE POLICY "Allow public update orders"
ON public.orders FOR UPDATE
USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
