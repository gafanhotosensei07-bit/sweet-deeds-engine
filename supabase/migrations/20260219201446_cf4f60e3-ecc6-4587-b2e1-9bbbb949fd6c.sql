
-- Create gateway_settings table
CREATE TABLE public.gateway_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gateway_name TEXT NOT NULL,
  api_token TEXT NOT NULL DEFAULT '',
  product_id TEXT NOT NULL DEFAULT '',
  offer_hash TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Only one gateway can be active at a time (constraint via trigger)
CREATE OR REPLACE FUNCTION public.ensure_single_active_gateway()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = true THEN
    UPDATE public.gateway_settings SET is_active = false WHERE id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER single_active_gateway_trigger
BEFORE INSERT OR UPDATE ON public.gateway_settings
FOR EACH ROW
EXECUTE FUNCTION public.ensure_single_active_gateway();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_gateway_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_gateway_settings_updated_at
BEFORE UPDATE ON public.gateway_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_gateway_updated_at();

-- Enable RLS
ALTER TABLE public.gateway_settings ENABLE ROW LEVEL SECURITY;

-- Allow full access (admin-only dashboard — no auth required for MVP)
CREATE POLICY "Allow all access to gateway_settings"
ON public.gateway_settings
FOR ALL
USING (true)
WITH CHECK (true);

-- Seed default gateways
INSERT INTO public.gateway_settings (gateway_name, api_token, product_id, offer_hash, is_active) VALUES
('ZeroOnePay', '6aLIlUuOKq0SnOpNYV2y93vKF9SqNVixsdz3arjQ7GqhhhNrmHUnBrZQh0kK', 'dv4dkj9lcg', 'rxcfh4s38y', true),
('GoatPay', '', '', '', false),
('SigmaPay', '', '', '', false);
