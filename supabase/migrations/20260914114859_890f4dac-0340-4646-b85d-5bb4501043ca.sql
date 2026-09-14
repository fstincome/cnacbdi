CREATE TYPE public.app_role AS ENUM ('admin', 'gestionnaire', 'agent');

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.achats (
  created_at timestamptz DEFAULT now(),
  date_achat date,
  designation text,
  fournisseur_id uuid,
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  legacy_id text,
  montant numeric DEFAULT 0,
  quantite numeric DEFAULT 0,
  reference text NOT NULL,
  statut text,
  updated_at timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.achats TO authenticated;
GRANT ALL ON public.achats TO service_role;
ALTER TABLE public.achats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "achats_auth" ON public.achats FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER set_achats_updated_at BEFORE UPDATE ON public.achats FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.archives (
  auteur_id uuid,
  auteur_nom text,
  categorie text,
  created_at timestamptz DEFAULT now(),
  date_document date,
  dossier_id uuid,
  emplacement text,
  fichier_path text,
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  legacy_id text,
  observation text,
  reference text,
  service text,
  titre text NOT NULL,
  type_document text,
  updated_at timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.archives TO authenticated;
GRANT ALL ON public.archives TO service_role;
ALTER TABLE public.archives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "archives_auth" ON public.archives FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER set_archives_updated_at BEFORE UPDATE ON public.archives FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.articles (
  categorie text,
  code text,
  created_at timestamptz DEFAULT now(),
  designation text NOT NULL,
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  legacy_id text,
  magasin text,
  prix_unitaire numeric DEFAULT 0,
  quantite_stock numeric DEFAULT 0,
  seuil_alerte numeric DEFAULT 0,
  unite text,
  updated_at timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.articles TO authenticated;
GRANT ALL ON public.articles TO service_role;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "articles_auth" ON public.articles FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER set_articles_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.budgets (
  categorie text,
  created_at timestamptz DEFAULT now(),
  exercice text,
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  legacy_id text,
  montant_alloue numeric DEFAULT 0,
  montant_depense numeric DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.budgets TO authenticated;
GRANT ALL ON public.budgets TO service_role;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "budgets_auth" ON public.budgets FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER set_budgets_updated_at BEFORE UPDATE ON public.budgets FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.carburant (
  created_at timestamptz DEFAULT now(),
  date_operation date,
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  legacy_id text,
  montant numeric DEFAULT 0,
  quantite numeric DEFAULT 0,
  type_operation text,
  updated_at timestamptz DEFAULT now(),
  vehicule_id uuid
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.carburant TO authenticated;
GRANT ALL ON public.carburant TO service_role;
ALTER TABLE public.carburant ENABLE ROW LEVEL SECURITY;

CREATE POLICY "carburant_auth" ON public.carburant FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER set_carburant_updated_at BEFORE UPDATE ON public.carburant FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.clients (
  adresse text,
  contact text,
  created_at timestamptz DEFAULT now(),
  email text,
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  legacy_id text,
  nom text NOT NULL,
  telephone text,
  updated_at timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;
GRANT ALL ON public.clients TO service_role;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clients_auth" ON public.clients FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER set_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.conges (
  created_at timestamptz DEFAULT now(),
  date_debut date,
  date_fin date,
  employe_id uuid,
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  legacy_id text,
  motif text,
  statut text,
  type_conge text,
  updated_at timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.conges TO authenticated;
GRANT ALL ON public.conges TO service_role;
ALTER TABLE public.conges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "conges_auth" ON public.conges FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER set_conges_updated_at BEFORE UPDATE ON public.conges FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.employes (
  adresse text,
  created_at timestamptz DEFAULT now(),
  date_embauche date,
  date_naissance date,
  departement text,
  email text,
  fonction text,
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  legacy_id text,
  matricule text NOT NULL,
  nom text NOT NULL,
  prenom text,
  salaire_base numeric DEFAULT 0,
  sexe text,
  statut text,
  telephone text,
  updated_at timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.employes TO authenticated;
GRANT ALL ON public.employes TO service_role;
ALTER TABLE public.employes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "employes_auth" ON public.employes FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER set_employes_updated_at BEFORE UPDATE ON public.employes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.entretiens (
  cout numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  date_entretien date,
  description text,
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  legacy_id text,
  prestataire text,
  statut text,
  type_entretien text,
  updated_at timestamptz DEFAULT now(),
  vehicule_id uuid
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.entretiens TO authenticated;
GRANT ALL ON public.entretiens TO service_role;
ALTER TABLE public.entretiens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "entretiens_auth" ON public.entretiens FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER set_entretiens_updated_at BEFORE UPDATE ON public.entretiens FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.fournisseurs (
  adresse text,
  contact text,
  created_at timestamptz DEFAULT now(),
  email text,
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  legacy_id text,
  nom text NOT NULL,
  telephone text,
  updated_at timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.fournisseurs TO authenticated;
GRANT ALL ON public.fournisseurs TO service_role;
ALTER TABLE public.fournisseurs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "fournisseurs_auth" ON public.fournisseurs FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER set_fournisseurs_updated_at BEFORE UPDATE ON public.fournisseurs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.mouvements_stock (
  article_id uuid,
  created_at timestamptz DEFAULT now(),
  date_mouvement date,
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  legacy_id text,
  motif text,
  quantite numeric DEFAULT 0,
  type_mouvement text,
  updated_at timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.mouvements_stock TO authenticated;
GRANT ALL ON public.mouvements_stock TO service_role;
ALTER TABLE public.mouvements_stock ENABLE ROW LEVEL SECURITY;

CREATE POLICY "mouvements_stock_auth" ON public.mouvements_stock FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER set_mouvements_stock_updated_at BEFORE UPDATE ON public.mouvements_stock FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.operations (
  compte text,
  created_at timestamptz DEFAULT now(),
  date_operation date,
  description text,
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  legacy_id text,
  montant numeric DEFAULT 0,
  reference text,
  type_operation text,
  updated_at timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.operations TO authenticated;
GRANT ALL ON public.operations TO service_role;
ALTER TABLE public.operations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "operations_auth" ON public.operations FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER set_operations_updated_at BEFORE UPDATE ON public.operations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.partenaires (
  adresse text,
  contact text,
  created_at timestamptz DEFAULT now(),
  domaine text,
  email text,
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  legacy_id text,
  nom text NOT NULL,
  statut text,
  telephone text,
  updated_at timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.partenaires TO authenticated;
GRANT ALL ON public.partenaires TO service_role;
ALTER TABLE public.partenaires ENABLE ROW LEVEL SECURITY;

CREATE POLICY "partenaires_auth" ON public.partenaires FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER set_partenaires_updated_at BEFORE UPDATE ON public.partenaires FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.presences (
  created_at timestamptz DEFAULT now(),
  date_presence date,
  employe_id uuid,
  heure_arrivee text,
  heure_depart text,
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  legacy_id text,
  statut text,
  updated_at timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.presences TO authenticated;
GRANT ALL ON public.presences TO service_role;
ALTER TABLE public.presences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "presences_auth" ON public.presences FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER set_presences_updated_at BEFORE UPDATE ON public.presences FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.profiles (
  created_at timestamptz DEFAULT now(),
  email text,
  full_name text,
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  updated_at timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_auth" ON public.profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.programmes (
  budget numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  date_debut date,
  date_fin date,
  description text,
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  legacy_id text,
  nom text NOT NULL,
  statut text,
  updated_at timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.programmes TO authenticated;
GRANT ALL ON public.programmes TO service_role;
ALTER TABLE public.programmes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "programmes_auth" ON public.programmes FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER set_programmes_updated_at BEFORE UPDATE ON public.programmes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.projets (
  budget numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  date_debut date,
  date_fin date,
  description text,
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  legacy_id text,
  nom text NOT NULL,
  partenaire_id uuid,
  programme_id uuid,
  statut text,
  updated_at timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.projets TO authenticated;
GRANT ALL ON public.projets TO service_role;
ALTER TABLE public.projets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "projets_auth" ON public.projets FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER set_projets_updated_at BEFORE UPDATE ON public.projets FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.salaires (
  avance numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  employe_id uuid,
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  mois text,
  montant_brut numeric DEFAULT 0,
  montant_net numeric DEFAULT 0,
  primes numeric DEFAULT 0,
  retenues numeric DEFAULT 0,
  statut text,
  updated_at timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.salaires TO authenticated;
GRANT ALL ON public.salaires TO service_role;
ALTER TABLE public.salaires ENABLE ROW LEVEL SECURITY;

CREATE POLICY "salaires_auth" ON public.salaires FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER set_salaires_updated_at BEFORE UPDATE ON public.salaires FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.transactions_mobile (
  created_at timestamptz DEFAULT now(),
  date_transaction date,
  destinataire text,
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  legacy_id text,
  montant numeric DEFAULT 0,
  operateur text,
  reference text,
  statut text,
  type_transaction text,
  updated_at timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.transactions_mobile TO authenticated;
GRANT ALL ON public.transactions_mobile TO service_role;
ALTER TABLE public.transactions_mobile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "transactions_mobile_auth" ON public.transactions_mobile FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER set_transactions_mobile_updated_at BEFORE UPDATE ON public.transactions_mobile FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.user_roles (
  created_at timestamptz DEFAULT now(),
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  role text,
  user_id uuid
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.user_roles ALTER COLUMN role TYPE public.app_role USING role::public.app_role;
ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_role_key UNIQUE (user_id, role);

CREATE TABLE public.vehicules (
  annee numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  immatriculation text NOT NULL,
  legacy_id text,
  marque text,
  modele text,
  statut text,
  updated_at timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.vehicules TO authenticated;
GRANT ALL ON public.vehicules TO service_role;
ALTER TABLE public.vehicules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "vehicules_auth" ON public.vehicules FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER set_vehicules_updated_at BEFORE UPDATE ON public.vehicules FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.ventes (
  client_id uuid,
  created_at timestamptz DEFAULT now(),
  date_vente date,
  designation text,
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  legacy_id text,
  montant numeric DEFAULT 0,
  quantite numeric DEFAULT 0,
  reference text NOT NULL,
  statut text,
  updated_at timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.ventes TO authenticated;
GRANT ALL ON public.ventes TO service_role;
ALTER TABLE public.ventes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ventes_auth" ON public.ventes FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER set_ventes_updated_at BEFORE UPDATE ON public.ventes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.achats ADD CONSTRAINT achats_fournisseur_id_fkey FOREIGN KEY (fournisseur_id) REFERENCES public.fournisseurs(id) ON DELETE SET NULL;

ALTER TABLE public.archives ADD CONSTRAINT archives_auteur_id_fkey FOREIGN KEY (auteur_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.carburant ADD CONSTRAINT carburant_vehicule_id_fkey FOREIGN KEY (vehicule_id) REFERENCES public.vehicules(id) ON DELETE SET NULL;

ALTER TABLE public.conges ADD CONSTRAINT conges_employe_id_fkey FOREIGN KEY (employe_id) REFERENCES public.employes(id) ON DELETE SET NULL;

ALTER TABLE public.entretiens ADD CONSTRAINT entretiens_vehicule_id_fkey FOREIGN KEY (vehicule_id) REFERENCES public.vehicules(id) ON DELETE SET NULL;

ALTER TABLE public.mouvements_stock ADD CONSTRAINT mouvements_stock_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.articles(id) ON DELETE SET NULL;

ALTER TABLE public.presences ADD CONSTRAINT presences_employe_id_fkey FOREIGN KEY (employe_id) REFERENCES public.employes(id) ON DELETE SET NULL;

ALTER TABLE public.projets ADD CONSTRAINT projets_partenaire_id_fkey FOREIGN KEY (partenaire_id) REFERENCES public.partenaires(id) ON DELETE SET NULL;

ALTER TABLE public.projets ADD CONSTRAINT projets_programme_id_fkey FOREIGN KEY (programme_id) REFERENCES public.programmes(id) ON DELETE SET NULL;

ALTER TABLE public.salaires ADD CONSTRAINT salaires_employe_id_fkey FOREIGN KEY (employe_id) REFERENCES public.employes(id) ON DELETE SET NULL;

ALTER TABLE public.ventes ADD CONSTRAINT ventes_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE SET NULL;

CREATE INDEX user_roles_user_id_idx ON public.user_roles(user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
