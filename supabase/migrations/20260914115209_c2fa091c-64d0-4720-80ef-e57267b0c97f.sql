CREATE POLICY "Acces lecture documents employes"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'documents-employes'
  AND (
    public.has_role(auth.uid(), 'admin')
    OR EXISTS (
      SELECT 1 FROM public.user_module_access uma
      WHERE uma.user_id = auth.uid() AND uma.module_slug = 'employes'
    )
  )
);

CREATE POLICY "Acces ajout documents employes"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'documents-employes'
  AND (
    public.has_role(auth.uid(), 'admin')
    OR EXISTS (
      SELECT 1 FROM public.user_module_access uma
      WHERE uma.user_id = auth.uid() AND uma.module_slug = 'employes'
    )
  )
);

CREATE POLICY "Acces modification documents employes"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'documents-employes'
  AND (
    public.has_role(auth.uid(), 'admin')
    OR EXISTS (
      SELECT 1 FROM public.user_module_access uma
      WHERE uma.user_id = auth.uid() AND uma.module_slug = 'employes'
    )
  )
)
WITH CHECK (
  bucket_id = 'documents-employes'
  AND (
    public.has_role(auth.uid(), 'admin')
    OR EXISTS (
      SELECT 1 FROM public.user_module_access uma
      WHERE uma.user_id = auth.uid() AND uma.module_slug = 'employes'
    )
  )
);

CREATE POLICY "Acces suppression documents employes"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'documents-employes'
  AND (
    public.has_role(auth.uid(), 'admin')
    OR EXISTS (
      SELECT 1 FROM public.user_module_access uma
      WHERE uma.user_id = auth.uid() AND uma.module_slug = 'employes'
    )
  )
);