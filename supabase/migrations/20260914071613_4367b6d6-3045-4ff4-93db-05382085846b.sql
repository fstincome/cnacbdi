CREATE POLICY "Acces lecture documents archives"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'documents-archives'
  AND (
    public.has_role(auth.uid(), 'admin')
    OR EXISTS (
      SELECT 1 FROM public.user_module_access uma
      WHERE uma.user_id = auth.uid()
        AND uma.module_slug IN ('archives', 'planifications')
    )
  )
);

CREATE POLICY "Acces ajout documents archives"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'documents-archives'
  AND (
    public.has_role(auth.uid(), 'admin')
    OR EXISTS (
      SELECT 1 FROM public.user_module_access uma
      WHERE uma.user_id = auth.uid()
        AND uma.module_slug IN ('archives', 'planifications')
    )
  )
);

CREATE POLICY "Acces modification documents archives"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'documents-archives'
  AND (
    public.has_role(auth.uid(), 'admin')
    OR EXISTS (
      SELECT 1 FROM public.user_module_access uma
      WHERE uma.user_id = auth.uid()
        AND uma.module_slug IN ('archives', 'planifications')
    )
  )
)
WITH CHECK (
  bucket_id = 'documents-archives'
  AND (
    public.has_role(auth.uid(), 'admin')
    OR EXISTS (
      SELECT 1 FROM public.user_module_access uma
      WHERE uma.user_id = auth.uid()
        AND uma.module_slug IN ('archives', 'planifications')
    )
  )
);

CREATE POLICY "Acces suppression documents archives"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'documents-archives'
  AND (
    public.has_role(auth.uid(), 'admin')
    OR EXISTS (
      SELECT 1 FROM public.user_module_access uma
      WHERE uma.user_id = auth.uid()
        AND uma.module_slug IN ('archives', 'planifications')
    )
  )
);