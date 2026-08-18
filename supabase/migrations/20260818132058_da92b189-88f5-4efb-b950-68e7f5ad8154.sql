CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  event_postal_code TEXT NOT NULL,
  distance_miles NUMERIC(6,2) NOT NULL,
  fulfillment_method TEXT NOT NULL,
  delivery_fee_cents INTEGER NOT NULL DEFAULT 0,
  event_date DATE NOT NULL,
  week_start DATE NOT NULL,
  workload_points NUMERIC(4,1) NOT NULL,
  occasion TEXT NOT NULL,
  style TEXT NOT NULL,
  flavor_profile TEXT NOT NULL,
  servings TEXT,
  reference_files TEXT[] NOT NULL DEFAULT '{}',
  design_notes TEXT,
  deposit_amount_cents INTEGER NOT NULL DEFAULT 5000,
  deposit_status TEXT NOT NULL DEFAULT 'pending',
  status TEXT NOT NULL DEFAULT 'reserved',
  notification_email TEXT NOT NULL DEFAULT 'sales@wendysbakehouse.ca',
  notification_status TEXT NOT NULL DEFAULT 'logged',
  notification_logged_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX orders_week_start_idx ON public.orders (week_start);

GRANT ALL ON public.orders TO service_role;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No public access to orders" ON public.orders FOR SELECT TO authenticated USING (false);

CREATE OR REPLACE FUNCTION public.week_capacity(_from DATE, _to DATE)
RETURNS TABLE (week_start DATE, points NUMERIC)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT o.week_start, SUM(o.workload_points)::NUMERIC AS points
  FROM public.orders o
  WHERE o.week_start BETWEEN _from AND _to
    AND o.status <> 'cancelled'
  GROUP BY o.week_start
$$;

GRANT EXECUTE ON FUNCTION public.week_capacity(DATE, DATE) TO anon, authenticated, service_role;