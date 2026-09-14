ALTER TABLE public.federations ADD COLUMN IF NOT EXISTS email text, ADD COLUMN IF NOT EXISTS telephone text, ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.unions ADD COLUMN IF NOT EXISTS email text, ADD COLUMN IF NOT EXISTS telephone text, ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.cooperatives ADD COLUMN IF NOT EXISTS email text, ADD COLUMN IF NOT EXISTS telephone text, ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.associations ADD COLUMN IF NOT EXISTS email text, ADD COLUMN IF NOT EXISTS telephone text, ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE UNIQUE INDEX IF NOT EXISTS federations_email_key ON public.federations (lower(email)) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS unions_email_key ON public.unions (lower(email)) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS cooperatives_email_key ON public.cooperatives (lower(email)) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS associations_email_key ON public.associations (lower(email)) WHERE email IS NOT NULL;