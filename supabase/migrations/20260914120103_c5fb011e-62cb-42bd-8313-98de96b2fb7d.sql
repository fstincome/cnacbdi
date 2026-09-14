ALTER FUNCTION public.recalculer_budget_projet() SECURITY INVOKER;
REVOKE EXECUTE ON FUNCTION public.recalculer_budget_projet() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.recalculer_budget_projet() TO authenticated, service_role;