CREATE POLICY "users_read_own_role" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;