
-- Tabela de eventos de analytics do site
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL, -- 'page_view', 'checkout_started', 'pix_generated', 'pix_paid'
  session_id TEXT,
  product_name TEXT,
  product_price NUMERIC,
  order_id TEXT,
  amount NUMERIC,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index para queries por período e tipo
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events (created_at DESC);
CREATE INDEX idx_analytics_events_event_type ON public.analytics_events (event_type);
CREATE INDEX idx_analytics_events_session ON public.analytics_events (session_id);

-- Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Inserção pública (site registra eventos sem auth)
CREATE POLICY "Allow public insert analytics"
  ON public.analytics_events FOR INSERT
  WITH CHECK (true);

-- Leitura apenas via service role (admin dashboard)
CREATE POLICY "Allow service role read analytics"
  ON public.analytics_events FOR SELECT
  USING (true);
