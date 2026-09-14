CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

ALTER POLICY details_paie_acces_module ON public.details_paie
  USING (private.has_role(auth.uid(), 'admin') OR EXISTS (SELECT 1 FROM public.user_module_access WHERE user_id = auth.uid() AND module_slug = 'salaires'))
  WITH CHECK (private.has_role(auth.uid(), 'admin') OR EXISTS (SELECT 1 FROM public.user_module_access WHERE user_id = auth.uid() AND module_slug = 'salaires'));
ALTER POLICY fiches_paie_acces_module ON public.fiches_paie_mensuelles
  USING (private.has_role(auth.uid(), 'admin') OR EXISTS (SELECT 1 FROM public.user_module_access WHERE user_id = auth.uid() AND module_slug = 'salaires'))
  WITH CHECK (private.has_role(auth.uid(), 'admin') OR EXISTS (SELECT 1 FROM public.user_module_access WHERE user_id = auth.uid() AND module_slug = 'salaires'));
ALTER POLICY salaires_acces_module ON public.salaires
  USING (private.has_role(auth.uid(), 'admin') OR EXISTS (SELECT 1 FROM public.user_module_access WHERE user_id = auth.uid() AND module_slug = 'salaires'))
  WITH CHECK (private.has_role(auth.uid(), 'admin') OR EXISTS (SELECT 1 FROM public.user_module_access WHERE user_id = auth.uid() AND module_slug = 'salaires'));
ALTER POLICY admin_access_delete ON public.user_module_access USING (private.has_role(auth.uid(), 'admin'));
ALTER POLICY admin_access_insert ON public.user_module_access WITH CHECK (private.has_role(auth.uid(), 'admin'));
ALTER POLICY admin_access_update ON public.user_module_access USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
ALTER POLICY own_access_select ON public.user_module_access USING (user_id = auth.uid() OR private.has_role(auth.uid(), 'admin'));
ALTER POLICY roles_delete_admin ON public.user_roles USING (private.has_role(auth.uid(), 'admin'));
ALTER POLICY roles_insert_admin ON public.user_roles WITH CHECK (private.has_role(auth.uid(), 'admin'));
ALTER POLICY roles_select_admin ON public.user_roles USING (private.has_role(auth.uid(), 'admin'));

ALTER POLICY "Acces lecture documents employes" ON storage.objects
  USING (bucket_id = 'documents-employes' AND (private.has_role(auth.uid(), 'admin') OR EXISTS (SELECT 1 FROM public.user_module_access uma WHERE uma.user_id = auth.uid() AND uma.module_slug = 'employes')));
ALTER POLICY "Acces ajout documents employes" ON storage.objects
  WITH CHECK (bucket_id = 'documents-employes' AND (private.has_role(auth.uid(), 'admin') OR EXISTS (SELECT 1 FROM public.user_module_access uma WHERE uma.user_id = auth.uid() AND uma.module_slug = 'employes')));
ALTER POLICY "Acces modification documents employes" ON storage.objects
  USING (bucket_id = 'documents-employes' AND (private.has_role(auth.uid(), 'admin') OR EXISTS (SELECT 1 FROM public.user_module_access uma WHERE uma.user_id = auth.uid() AND uma.module_slug = 'employes')))
  WITH CHECK (bucket_id = 'documents-employes' AND (private.has_role(auth.uid(), 'admin') OR EXISTS (SELECT 1 FROM public.user_module_access uma WHERE uma.user_id = auth.uid() AND uma.module_slug = 'employes')));
ALTER POLICY "Acces suppression documents employes" ON storage.objects
  USING (bucket_id = 'documents-employes' AND (private.has_role(auth.uid(), 'admin') OR EXISTS (SELECT 1 FROM public.user_module_access uma WHERE uma.user_id = auth.uid() AND uma.module_slug = 'employes')));

ALTER POLICY "Acces lecture documents archives" ON storage.objects
  USING (bucket_id = 'documents-archives' AND (private.has_role(auth.uid(), 'admin') OR EXISTS (SELECT 1 FROM public.user_module_access uma WHERE uma.user_id = auth.uid() AND uma.module_slug = ANY (ARRAY['archives', 'planifications']))));
ALTER POLICY "Acces ajout documents archives" ON storage.objects
  WITH CHECK (bucket_id = 'documents-archives' AND (private.has_role(auth.uid(), 'admin') OR EXISTS (SELECT 1 FROM public.user_module_access uma WHERE uma.user_id = auth.uid() AND uma.module_slug = ANY (ARRAY['archives', 'planifications']))));
ALTER POLICY "Acces modification documents archives" ON storage.objects
  USING (bucket_id = 'documents-archives' AND (private.has_role(auth.uid(), 'admin') OR EXISTS (SELECT 1 FROM public.user_module_access uma WHERE uma.user_id = auth.uid() AND uma.module_slug = ANY (ARRAY['archives', 'planifications']))))
  WITH CHECK (bucket_id = 'documents-archives' AND (private.has_role(auth.uid(), 'admin') OR EXISTS (SELECT 1 FROM public.user_module_access uma WHERE uma.user_id = auth.uid() AND uma.module_slug = ANY (ARRAY['archives', 'planifications']))));
ALTER POLICY "Acces suppression documents archives" ON storage.objects
  USING (bucket_id = 'documents-archives' AND (private.has_role(auth.uid(), 'admin') OR EXISTS (SELECT 1 FROM public.user_module_access uma WHERE uma.user_id = auth.uid() AND uma.module_slug = ANY (ARRAY['archives', 'planifications']))));

DROP FUNCTION public.has_role(uuid, public.app_role);