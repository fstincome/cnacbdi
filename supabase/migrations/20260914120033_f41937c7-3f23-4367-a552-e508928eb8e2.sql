CREATE TABLE public.profil_module_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profil_id uuid NOT NULL REFERENCES public.profils(id) ON DELETE CASCADE,
  module_slug text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (profil_id, module_slug)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profil_module_access TO authenticated;
GRANT ALL ON public.profil_module_access TO service_role;
ALTER TABLE public.profil_module_access ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Utilisateurs connectes consultent les acces par profil" ON public.profil_module_access FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins ajoutent les acces par profil" ON public.profil_module_access FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins modifient les acces par profil" ON public.profil_module_access FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins retirent les acces par profil" ON public.profil_module_access FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER set_profil_module_access_updated_at BEFORE UPDATE ON public.profil_module_access FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_profil_module_access_profil ON public.profil_module_access(profil_id);