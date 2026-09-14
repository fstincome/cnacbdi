CREATE POLICY "Utilisateurs connectes consultent documents projets"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'documents-projets');

CREATE POLICY "Utilisateurs connectes ajoutent documents projets"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'documents-projets');

CREATE POLICY "Utilisateurs connectes modifient documents projets"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'documents-projets')
WITH CHECK (bucket_id = 'documents-projets');

CREATE POLICY "Utilisateurs connectes suppriment documents projets"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'documents-projets');