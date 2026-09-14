export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      achats: {
        Row: {
          created_at: string | null
          date_achat: string | null
          designation: string | null
          fournisseur_id: string | null
          id: string
          legacy_id: string | null
          montant: number | null
          quantite: number | null
          reference: string
          statut: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date_achat?: string | null
          designation?: string | null
          fournisseur_id?: string | null
          id?: string
          legacy_id?: string | null
          montant?: number | null
          quantite?: number | null
          reference: string
          statut?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date_achat?: string | null
          designation?: string | null
          fournisseur_id?: string | null
          id?: string
          legacy_id?: string | null
          montant?: number | null
          quantite?: number | null
          reference?: string
          statut?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "achats_fournisseur_id_fkey"
            columns: ["fournisseur_id"]
            isOneToOne: false
            referencedRelation: "fournisseurs"
            referencedColumns: ["id"]
          },
        ]
      }
      archives: {
        Row: {
          auteur_id: string | null
          auteur_nom: string | null
          categorie: string | null
          created_at: string | null
          date_document: string | null
          dossier_id: string | null
          emplacement: string | null
          fichier_path: string | null
          id: string
          legacy_id: string | null
          observation: string | null
          reference: string | null
          service: string | null
          titre: string
          type_document: string | null
          updated_at: string | null
        }
        Insert: {
          auteur_id?: string | null
          auteur_nom?: string | null
          categorie?: string | null
          created_at?: string | null
          date_document?: string | null
          dossier_id?: string | null
          emplacement?: string | null
          fichier_path?: string | null
          id?: string
          legacy_id?: string | null
          observation?: string | null
          reference?: string | null
          service?: string | null
          titre: string
          type_document?: string | null
          updated_at?: string | null
        }
        Update: {
          auteur_id?: string | null
          auteur_nom?: string | null
          categorie?: string | null
          created_at?: string | null
          date_document?: string | null
          dossier_id?: string | null
          emplacement?: string | null
          fichier_path?: string | null
          id?: string
          legacy_id?: string | null
          observation?: string | null
          reference?: string | null
          service?: string | null
          titre?: string
          type_document?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "archives_auteur_id_fkey"
            columns: ["auteur_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "archives_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "dossiers_archives"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          categorie: string | null
          code: string | null
          created_at: string | null
          designation: string
          id: string
          legacy_id: string | null
          magasin: string | null
          prix_unitaire: number | null
          quantite_stock: number | null
          seuil_alerte: number | null
          unite: string | null
          updated_at: string | null
        }
        Insert: {
          categorie?: string | null
          code?: string | null
          created_at?: string | null
          designation: string
          id?: string
          legacy_id?: string | null
          magasin?: string | null
          prix_unitaire?: number | null
          quantite_stock?: number | null
          seuil_alerte?: number | null
          unite?: string | null
          updated_at?: string | null
        }
        Update: {
          categorie?: string | null
          code?: string | null
          created_at?: string | null
          designation?: string
          id?: string
          legacy_id?: string | null
          magasin?: string | null
          prix_unitaire?: number | null
          quantite_stock?: number | null
          seuil_alerte?: number | null
          unite?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      associations: {
        Row: {
          colline_id: string | null
          contact: string | null
          cooperative_id: string | null
          created_at: string
          date_creation: string | null
          email: string | null
          id: string
          legacy_id: number | null
          nbre_membres: number
          nom: string
          responsable_id: string | null
          statut: string
          telephone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          colline_id?: string | null
          contact?: string | null
          cooperative_id?: string | null
          created_at?: string
          date_creation?: string | null
          email?: string | null
          id?: string
          legacy_id?: number | null
          nbre_membres?: number
          nom: string
          responsable_id?: string | null
          statut?: string
          telephone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          colline_id?: string | null
          contact?: string | null
          cooperative_id?: string | null
          created_at?: string
          date_creation?: string | null
          email?: string | null
          id?: string
          legacy_id?: number | null
          nbre_membres?: number
          nom?: string
          responsable_id?: string | null
          statut?: string
          telephone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "associations_colline_id_fkey"
            columns: ["colline_id"]
            isOneToOne: false
            referencedRelation: "collines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "associations_cooperative_id_fkey"
            columns: ["cooperative_id"]
            isOneToOne: false
            referencedRelation: "cooperatives"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "associations_responsable_id_fkey"
            columns: ["responsable_id"]
            isOneToOne: false
            referencedRelation: "employes"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets: {
        Row: {
          categorie: string | null
          created_at: string | null
          exercice: string | null
          id: string
          legacy_id: string | null
          montant_alloue: number | null
          montant_depense: number | null
          updated_at: string | null
        }
        Insert: {
          categorie?: string | null
          created_at?: string | null
          exercice?: string | null
          id?: string
          legacy_id?: string | null
          montant_alloue?: number | null
          montant_depense?: number | null
          updated_at?: string | null
        }
        Update: {
          categorie?: string | null
          created_at?: string | null
          exercice?: string | null
          id?: string
          legacy_id?: string | null
          montant_alloue?: number | null
          montant_depense?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      carburant: {
        Row: {
          created_at: string | null
          date_operation: string | null
          id: string
          legacy_id: string | null
          montant: number | null
          quantite: number | null
          type_operation: string | null
          updated_at: string | null
          vehicule_id: string | null
        }
        Insert: {
          created_at?: string | null
          date_operation?: string | null
          id?: string
          legacy_id?: string | null
          montant?: number | null
          quantite?: number | null
          type_operation?: string | null
          updated_at?: string | null
          vehicule_id?: string | null
        }
        Update: {
          created_at?: string | null
          date_operation?: string | null
          id?: string
          legacy_id?: string | null
          montant?: number | null
          quantite?: number | null
          type_operation?: string | null
          updated_at?: string | null
          vehicule_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "carburant_vehicule_id_fkey"
            columns: ["vehicule_id"]
            isOneToOne: false
            referencedRelation: "vehicules"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          adresse: string | null
          contact: string | null
          created_at: string | null
          email: string | null
          id: string
          legacy_id: string | null
          nom: string
          telephone: string | null
          updated_at: string | null
        }
        Insert: {
          adresse?: string | null
          contact?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          legacy_id?: string | null
          nom: string
          telephone?: string | null
          updated_at?: string | null
        }
        Update: {
          adresse?: string | null
          contact?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          legacy_id?: string | null
          nom?: string
          telephone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      collines: {
        Row: {
          created_at: string
          id: string
          legacy_id: number | null
          nom: string
          updated_at: string
          zone_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          legacy_id?: number | null
          nom: string
          updated_at?: string
          zone_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          legacy_id?: number | null
          nom?: string
          updated_at?: string
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "collines_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
        ]
      }
      communes: {
        Row: {
          created_at: string
          id: string
          legacy_id: number | null
          nom: string
          province_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          legacy_id?: number | null
          nom: string
          province_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          legacy_id?: number | null
          nom?: string
          province_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "communes_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      conges: {
        Row: {
          created_at: string | null
          date_debut: string | null
          date_fin: string | null
          employe_id: string | null
          id: string
          legacy_id: string | null
          motif: string | null
          statut: string | null
          type_conge: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date_debut?: string | null
          date_fin?: string | null
          employe_id?: string | null
          id?: string
          legacy_id?: string | null
          motif?: string | null
          statut?: string | null
          type_conge?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date_debut?: string | null
          date_fin?: string | null
          employe_id?: string | null
          id?: string
          legacy_id?: string | null
          motif?: string | null
          statut?: string | null
          type_conge?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conges_employe_id_fkey"
            columns: ["employe_id"]
            isOneToOne: false
            referencedRelation: "employes"
            referencedColumns: ["id"]
          },
        ]
      }
      cooperatives: {
        Row: {
          contact: string | null
          created_at: string
          date_creation: string | null
          email: string | null
          id: string
          legacy_id: number | null
          nbre_membres: number
          nom: string
          responsable_id: string | null
          statut: string
          telephone: string | null
          union_id: string | null
          updated_at: string
          user_id: string | null
          zone_id: string | null
        }
        Insert: {
          contact?: string | null
          created_at?: string
          date_creation?: string | null
          email?: string | null
          id?: string
          legacy_id?: number | null
          nbre_membres?: number
          nom: string
          responsable_id?: string | null
          statut?: string
          telephone?: string | null
          union_id?: string | null
          updated_at?: string
          user_id?: string | null
          zone_id?: string | null
        }
        Update: {
          contact?: string | null
          created_at?: string
          date_creation?: string | null
          email?: string | null
          id?: string
          legacy_id?: number | null
          nbre_membres?: number
          nom?: string
          responsable_id?: string | null
          statut?: string
          telephone?: string | null
          union_id?: string | null
          updated_at?: string
          user_id?: string | null
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cooperatives_responsable_id_fkey"
            columns: ["responsable_id"]
            isOneToOne: false
            referencedRelation: "employes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cooperatives_union_id_fkey"
            columns: ["union_id"]
            isOneToOne: false
            referencedRelation: "unions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cooperatives_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
        ]
      }
      departements: {
        Row: {
          code: string | null
          created_at: string
          description: string | null
          id: string
          legacy_id: string | null
          nom: string
          statut: string
          updated_at: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          legacy_id?: string | null
          nom: string
          statut?: string
          updated_at?: string
        }
        Update: {
          code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          legacy_id?: string | null
          nom?: string
          statut?: string
          updated_at?: string
        }
        Relationships: []
      }
      details_paie: {
        Row: {
          allocations_familiales: number
          created_at: string
          deductions: number
          employe_id: string
          id: string
          indemnite_deplacement: number
          indemnite_logement: number
          inss_3: number
          inss_4: number
          inss_6: number
          ipr: number
          legacy_id: string | null
          montant_supporte: number
          mutuelle_4: number
          mutuelle_6: number
          revenu_net_imposable: number
          salaire_base: number
          salaire_brut: number
          salaire_id: string
          salaire_net: number
          updated_at: string
        }
        Insert: {
          allocations_familiales?: number
          created_at?: string
          deductions?: number
          employe_id: string
          id?: string
          indemnite_deplacement?: number
          indemnite_logement?: number
          inss_3?: number
          inss_4?: number
          inss_6?: number
          ipr?: number
          legacy_id?: string | null
          montant_supporte?: number
          mutuelle_4?: number
          mutuelle_6?: number
          revenu_net_imposable?: number
          salaire_base?: number
          salaire_brut?: number
          salaire_id: string
          salaire_net?: number
          updated_at?: string
        }
        Update: {
          allocations_familiales?: number
          created_at?: string
          deductions?: number
          employe_id?: string
          id?: string
          indemnite_deplacement?: number
          indemnite_logement?: number
          inss_3?: number
          inss_4?: number
          inss_6?: number
          ipr?: number
          legacy_id?: string | null
          montant_supporte?: number
          mutuelle_4?: number
          mutuelle_6?: number
          revenu_net_imposable?: number
          salaire_base?: number
          salaire_brut?: number
          salaire_id?: string
          salaire_net?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "details_paie_employe_id_fkey"
            columns: ["employe_id"]
            isOneToOne: false
            referencedRelation: "employes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "details_paie_salaire_id_fkey"
            columns: ["salaire_id"]
            isOneToOne: true
            referencedRelation: "salaires"
            referencedColumns: ["id"]
          },
        ]
      }
      dossiers_archives: {
        Row: {
          actif: boolean
          created_at: string
          id: string
          legacy_id: string | null
          nom: string
          updated_at: string
        }
        Insert: {
          actif?: boolean
          created_at?: string
          id?: string
          legacy_id?: string | null
          nom: string
          updated_at?: string
        }
        Update: {
          actif?: boolean
          created_at?: string
          id?: string
          legacy_id?: string | null
          nom?: string
          updated_at?: string
        }
        Relationships: []
      }
      employes: {
        Row: {
          adresse: string | null
          banque: string | null
          categorie_personnel: string
          contrat_path: string | null
          created_at: string | null
          date_embauche: string | null
          date_naissance: string | null
          departement: string | null
          departement_id: string | null
          dossier_path: string | null
          email: string | null
          fonction: string | null
          fonction_id: string | null
          id: string
          legacy_id: string | null
          matricule: string
          niveau_etudes: string | null
          nom: string
          numero_compte: string | null
          prenom: string | null
          profil: string | null
          profil_id: string | null
          responsable: string | null
          salaire_base: number | null
          sexe: string | null
          statut: string | null
          telephone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          adresse?: string | null
          banque?: string | null
          categorie_personnel?: string
          contrat_path?: string | null
          created_at?: string | null
          date_embauche?: string | null
          date_naissance?: string | null
          departement?: string | null
          departement_id?: string | null
          dossier_path?: string | null
          email?: string | null
          fonction?: string | null
          fonction_id?: string | null
          id?: string
          legacy_id?: string | null
          matricule: string
          niveau_etudes?: string | null
          nom: string
          numero_compte?: string | null
          prenom?: string | null
          profil?: string | null
          profil_id?: string | null
          responsable?: string | null
          salaire_base?: number | null
          sexe?: string | null
          statut?: string | null
          telephone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          adresse?: string | null
          banque?: string | null
          categorie_personnel?: string
          contrat_path?: string | null
          created_at?: string | null
          date_embauche?: string | null
          date_naissance?: string | null
          departement?: string | null
          departement_id?: string | null
          dossier_path?: string | null
          email?: string | null
          fonction?: string | null
          fonction_id?: string | null
          id?: string
          legacy_id?: string | null
          matricule?: string
          niveau_etudes?: string | null
          nom?: string
          numero_compte?: string | null
          prenom?: string | null
          profil?: string | null
          profil_id?: string | null
          responsable?: string | null
          salaire_base?: number | null
          sexe?: string | null
          statut?: string | null
          telephone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employes_departement_id_fkey"
            columns: ["departement_id"]
            isOneToOne: false
            referencedRelation: "departements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employes_fonction_id_fkey"
            columns: ["fonction_id"]
            isOneToOne: false
            referencedRelation: "fonctions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employes_profil_id_fkey"
            columns: ["profil_id"]
            isOneToOne: false
            referencedRelation: "profils"
            referencedColumns: ["id"]
          },
        ]
      }
      entretiens: {
        Row: {
          cout: number | null
          created_at: string | null
          date_entretien: string | null
          description: string | null
          id: string
          legacy_id: string | null
          prestataire: string | null
          statut: string | null
          type_entretien: string | null
          updated_at: string | null
          vehicule_id: string | null
        }
        Insert: {
          cout?: number | null
          created_at?: string | null
          date_entretien?: string | null
          description?: string | null
          id?: string
          legacy_id?: string | null
          prestataire?: string | null
          statut?: string | null
          type_entretien?: string | null
          updated_at?: string | null
          vehicule_id?: string | null
        }
        Update: {
          cout?: number | null
          created_at?: string | null
          date_entretien?: string | null
          description?: string | null
          id?: string
          legacy_id?: string | null
          prestataire?: string | null
          statut?: string | null
          type_entretien?: string | null
          updated_at?: string | null
          vehicule_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entretiens_vehicule_id_fkey"
            columns: ["vehicule_id"]
            isOneToOne: false
            referencedRelation: "vehicules"
            referencedColumns: ["id"]
          },
        ]
      }
      federations: {
        Row: {
          contact: string | null
          created_at: string
          date_creation: string | null
          email: string | null
          id: string
          legacy_id: number | null
          nbre_associations: number
          nbre_cooperatives: number
          nbre_unions: number
          nom: string
          province_id: string | null
          responsable_id: string | null
          statut: string
          telephone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          contact?: string | null
          created_at?: string
          date_creation?: string | null
          email?: string | null
          id?: string
          legacy_id?: number | null
          nbre_associations?: number
          nbre_cooperatives?: number
          nbre_unions?: number
          nom: string
          province_id?: string | null
          responsable_id?: string | null
          statut?: string
          telephone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          contact?: string | null
          created_at?: string
          date_creation?: string | null
          email?: string | null
          id?: string
          legacy_id?: number | null
          nbre_associations?: number
          nbre_cooperatives?: number
          nbre_unions?: number
          nom?: string
          province_id?: string | null
          responsable_id?: string | null
          statut?: string
          telephone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "federations_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "federations_responsable_id_fkey"
            columns: ["responsable_id"]
            isOneToOne: false
            referencedRelation: "employes"
            referencedColumns: ["id"]
          },
        ]
      }
      fiches_paie_mensuelles: {
        Row: {
          annee: number
          auteur_id: string | null
          auteur_nom: string | null
          created_at: string
          document_url: string | null
          id: string
          legacy_id: string | null
          modificateur_id: string | null
          modificateur_nom: string | null
          mois: number
          statut: string
          updated_at: string
        }
        Insert: {
          annee: number
          auteur_id?: string | null
          auteur_nom?: string | null
          created_at?: string
          document_url?: string | null
          id?: string
          legacy_id?: string | null
          modificateur_id?: string | null
          modificateur_nom?: string | null
          mois: number
          statut?: string
          updated_at?: string
        }
        Update: {
          annee?: number
          auteur_id?: string | null
          auteur_nom?: string | null
          created_at?: string
          document_url?: string | null
          id?: string
          legacy_id?: string | null
          modificateur_id?: string | null
          modificateur_nom?: string | null
          mois?: number
          statut?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fiches_paie_mensuelles_auteur_id_fkey"
            columns: ["auteur_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fiches_paie_mensuelles_modificateur_id_fkey"
            columns: ["modificateur_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fonctions: {
        Row: {
          created_at: string
          departement_id: string | null
          description: string | null
          id: string
          legacy_id: string | null
          nom: string
          statut: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          departement_id?: string | null
          description?: string | null
          id?: string
          legacy_id?: string | null
          nom: string
          statut?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          departement_id?: string | null
          description?: string | null
          id?: string
          legacy_id?: string | null
          nom?: string
          statut?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fonctions_departement_id_fkey"
            columns: ["departement_id"]
            isOneToOne: false
            referencedRelation: "departements"
            referencedColumns: ["id"]
          },
        ]
      }
      fournisseurs: {
        Row: {
          adresse: string | null
          contact: string | null
          created_at: string | null
          email: string | null
          id: string
          legacy_id: string | null
          nom: string
          telephone: string | null
          updated_at: string | null
        }
        Insert: {
          adresse?: string | null
          contact?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          legacy_id?: string | null
          nom: string
          telephone?: string | null
          updated_at?: string | null
        }
        Update: {
          adresse?: string | null
          contact?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          legacy_id?: string | null
          nom?: string
          telephone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      intervenants: {
        Row: {
          contact: string | null
          created_at: string
          date_creation: string | null
          id: string
          legacy_id: number | null
          nom: string
          province_id: string | null
          responsable_id: string | null
          statut: string
          updated_at: string
        }
        Insert: {
          contact?: string | null
          created_at?: string
          date_creation?: string | null
          id?: string
          legacy_id?: number | null
          nom: string
          province_id?: string | null
          responsable_id?: string | null
          statut?: string
          updated_at?: string
        }
        Update: {
          contact?: string | null
          created_at?: string
          date_creation?: string | null
          id?: string
          legacy_id?: number | null
          nom?: string
          province_id?: string | null
          responsable_id?: string | null
          statut?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "intervenants_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intervenants_responsable_id_fkey"
            columns: ["responsable_id"]
            isOneToOne: false
            referencedRelation: "employes"
            referencedColumns: ["id"]
          },
        ]
      }
      membres: {
        Row: {
          association_id: string | null
          contact: string | null
          created_at: string
          date_adhesion: string | null
          date_naissance: string | null
          id: string
          legacy_id: number | null
          nbre_plants: string | null
          nom: string
          prenom: string | null
          sexe: string | null
          statut: string
          superficie: string | null
          updated_at: string
        }
        Insert: {
          association_id?: string | null
          contact?: string | null
          created_at?: string
          date_adhesion?: string | null
          date_naissance?: string | null
          id?: string
          legacy_id?: number | null
          nbre_plants?: string | null
          nom: string
          prenom?: string | null
          sexe?: string | null
          statut?: string
          superficie?: string | null
          updated_at?: string
        }
        Update: {
          association_id?: string | null
          contact?: string | null
          created_at?: string
          date_adhesion?: string | null
          date_naissance?: string | null
          id?: string
          legacy_id?: number | null
          nbre_plants?: string | null
          nom?: string
          prenom?: string | null
          sexe?: string | null
          statut?: string
          superficie?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "membres_association_id_fkey"
            columns: ["association_id"]
            isOneToOne: false
            referencedRelation: "associations"
            referencedColumns: ["id"]
          },
        ]
      }
      mouvements_stock: {
        Row: {
          article_id: string | null
          created_at: string | null
          date_mouvement: string | null
          id: string
          legacy_id: string | null
          motif: string | null
          quantite: number | null
          type_mouvement: string | null
          updated_at: string | null
        }
        Insert: {
          article_id?: string | null
          created_at?: string | null
          date_mouvement?: string | null
          id?: string
          legacy_id?: string | null
          motif?: string | null
          quantite?: number | null
          type_mouvement?: string | null
          updated_at?: string | null
        }
        Update: {
          article_id?: string | null
          created_at?: string | null
          date_mouvement?: string | null
          id?: string
          legacy_id?: string | null
          motif?: string | null
          quantite?: number | null
          type_mouvement?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mouvements_stock_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      operations: {
        Row: {
          compte: string | null
          created_at: string | null
          date_operation: string | null
          description: string | null
          id: string
          legacy_id: string | null
          montant: number | null
          reference: string | null
          type_operation: string | null
          updated_at: string | null
        }
        Insert: {
          compte?: string | null
          created_at?: string | null
          date_operation?: string | null
          description?: string | null
          id?: string
          legacy_id?: string | null
          montant?: number | null
          reference?: string | null
          type_operation?: string | null
          updated_at?: string | null
        }
        Update: {
          compte?: string | null
          created_at?: string | null
          date_operation?: string | null
          description?: string | null
          id?: string
          legacy_id?: string | null
          montant?: number | null
          reference?: string | null
          type_operation?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      partenaires: {
        Row: {
          adresse: string | null
          contact: string | null
          created_at: string | null
          domaine: string | null
          email: string | null
          id: string
          legacy_id: string | null
          localisation: string | null
          logo_path: string | null
          nom: string
          objet_collaboration: string | null
          statut: string | null
          telephone: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          adresse?: string | null
          contact?: string | null
          created_at?: string | null
          domaine?: string | null
          email?: string | null
          id?: string
          legacy_id?: string | null
          localisation?: string | null
          logo_path?: string | null
          nom: string
          objet_collaboration?: string | null
          statut?: string | null
          telephone?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          adresse?: string | null
          contact?: string | null
          created_at?: string | null
          domaine?: string | null
          email?: string | null
          id?: string
          legacy_id?: string | null
          localisation?: string | null
          logo_path?: string | null
          nom?: string
          objet_collaboration?: string | null
          statut?: string | null
          telephone?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      presences: {
        Row: {
          created_at: string | null
          date_presence: string | null
          employe_id: string | null
          heure_arrivee: string | null
          heure_depart: string | null
          id: string
          legacy_id: string | null
          statut: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date_presence?: string | null
          employe_id?: string | null
          heure_arrivee?: string | null
          heure_depart?: string | null
          id?: string
          legacy_id?: string | null
          statut?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date_presence?: string | null
          employe_id?: string | null
          heure_arrivee?: string | null
          heure_depart?: string | null
          id?: string
          legacy_id?: string | null
          statut?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "presences_employe_id_fkey"
            columns: ["employe_id"]
            isOneToOne: false
            referencedRelation: "employes"
            referencedColumns: ["id"]
          },
        ]
      }
      profil_module_access: {
        Row: {
          created_at: string
          id: string
          module_slug: string
          profil_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          module_slug: string
          profil_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          module_slug?: string
          profil_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profil_module_access_profil_id_fkey"
            columns: ["profil_id"]
            isOneToOne: false
            referencedRelation: "profils"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profils: {
        Row: {
          created_at: string
          description: string | null
          fonction_id: string | null
          id: string
          legacy_id: string | null
          nom: string
          statut: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          fonction_id?: string | null
          id?: string
          legacy_id?: string | null
          nom: string
          statut?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          fonction_id?: string | null
          id?: string
          legacy_id?: string | null
          nom?: string
          statut?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profils_fonction_id_fkey"
            columns: ["fonction_id"]
            isOneToOne: false
            referencedRelation: "fonctions"
            referencedColumns: ["id"]
          },
        ]
      }
      programmes: {
        Row: {
          budget: number | null
          created_at: string | null
          date_debut: string | null
          date_fin: string | null
          description: string | null
          id: string
          legacy_id: string | null
          nom: string
          objectifs: string | null
          statut: string | null
          updated_at: string | null
        }
        Insert: {
          budget?: number | null
          created_at?: string | null
          date_debut?: string | null
          date_fin?: string | null
          description?: string | null
          id?: string
          legacy_id?: string | null
          nom: string
          objectifs?: string | null
          statut?: string | null
          updated_at?: string | null
        }
        Update: {
          budget?: number | null
          created_at?: string | null
          date_debut?: string | null
          date_fin?: string | null
          description?: string | null
          id?: string
          legacy_id?: string | null
          nom?: string
          objectifs?: string | null
          statut?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      projet_activites: {
        Row: {
          activite: string
          budget: number
          created_at: string
          date_debut: string
          date_fin: string
          engagement_path: string | null
          id: string
          projet_id: string
          responsable_id: string
          updated_at: string
        }
        Insert: {
          activite: string
          budget?: number
          created_at?: string
          date_debut: string
          date_fin: string
          engagement_path?: string | null
          id?: string
          projet_id: string
          responsable_id: string
          updated_at?: string
        }
        Update: {
          activite?: string
          budget?: number
          created_at?: string
          date_debut?: string
          date_fin?: string
          engagement_path?: string | null
          id?: string
          projet_id?: string
          responsable_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projet_activites_projet_id_fkey"
            columns: ["projet_id"]
            isOneToOne: false
            referencedRelation: "projets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projet_activites_responsable_id_fkey"
            columns: ["responsable_id"]
            isOneToOne: false
            referencedRelation: "employes"
            referencedColumns: ["id"]
          },
        ]
      }
      projet_participants: {
        Row: {
          created_at: string
          date_attribution: string
          employe_id: string
          id: string
          projet_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_attribution?: string
          employe_id: string
          id?: string
          projet_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_attribution?: string
          employe_id?: string
          id?: string
          projet_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projet_participants_employe_id_fkey"
            columns: ["employe_id"]
            isOneToOne: false
            referencedRelation: "employes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projet_participants_projet_id_fkey"
            columns: ["projet_id"]
            isOneToOne: false
            referencedRelation: "projets"
            referencedColumns: ["id"]
          },
        ]
      }
      projets: {
        Row: {
          budget: number | null
          budget_depense: number
          budget_restant: number
          chef_projet_id: string | null
          created_at: string | null
          date_debut: string | null
          date_fin: string | null
          description: string | null
          fichier_path: string | null
          id: string
          legacy_id: string | null
          nom: string
          objectifs: string | null
          partenaire_id: string | null
          programme_id: string | null
          statut: string | null
          updated_at: string | null
        }
        Insert: {
          budget?: number | null
          budget_depense?: number
          budget_restant?: number
          chef_projet_id?: string | null
          created_at?: string | null
          date_debut?: string | null
          date_fin?: string | null
          description?: string | null
          fichier_path?: string | null
          id?: string
          legacy_id?: string | null
          nom: string
          objectifs?: string | null
          partenaire_id?: string | null
          programme_id?: string | null
          statut?: string | null
          updated_at?: string | null
        }
        Update: {
          budget?: number | null
          budget_depense?: number
          budget_restant?: number
          chef_projet_id?: string | null
          created_at?: string | null
          date_debut?: string | null
          date_fin?: string | null
          description?: string | null
          fichier_path?: string | null
          id?: string
          legacy_id?: string | null
          nom?: string
          objectifs?: string | null
          partenaire_id?: string | null
          programme_id?: string | null
          statut?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projets_chef_projet_id_fkey"
            columns: ["chef_projet_id"]
            isOneToOne: false
            referencedRelation: "employes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projets_partenaire_id_fkey"
            columns: ["partenaire_id"]
            isOneToOne: false
            referencedRelation: "partenaires"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projets_programme_id_fkey"
            columns: ["programme_id"]
            isOneToOne: false
            referencedRelation: "programmes"
            referencedColumns: ["id"]
          },
        ]
      }
      provinces: {
        Row: {
          created_at: string
          id: string
          legacy_id: number | null
          nom: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          legacy_id?: number | null
          nom: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          legacy_id?: number | null
          nom?: string
          updated_at?: string
        }
        Relationships: []
      }
      salaires: {
        Row: {
          auteur_id: string | null
          avance: number | null
          created_at: string | null
          employe_id: string | null
          etat_civil: string
          id: string
          mois: string | null
          montant_brut: number | null
          montant_net: number | null
          nombre_enfants: number
          primes: number | null
          retenues: number | null
          salaire_base: number
          statut: string | null
          updated_at: string | null
        }
        Insert: {
          auteur_id?: string | null
          avance?: number | null
          created_at?: string | null
          employe_id?: string | null
          etat_civil?: string
          id?: string
          mois?: string | null
          montant_brut?: number | null
          montant_net?: number | null
          nombre_enfants?: number
          primes?: number | null
          retenues?: number | null
          salaire_base?: number
          statut?: string | null
          updated_at?: string | null
        }
        Update: {
          auteur_id?: string | null
          avance?: number | null
          created_at?: string | null
          employe_id?: string | null
          etat_civil?: string
          id?: string
          mois?: string | null
          montant_brut?: number | null
          montant_net?: number | null
          nombre_enfants?: number
          primes?: number | null
          retenues?: number | null
          salaire_base?: number
          statut?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "salaires_auteur_id_fkey"
            columns: ["auteur_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salaires_employe_id_fkey"
            columns: ["employe_id"]
            isOneToOne: false
            referencedRelation: "employes"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions_mobile: {
        Row: {
          created_at: string | null
          date_transaction: string | null
          destinataire: string | null
          id: string
          legacy_id: string | null
          montant: number | null
          operateur: string | null
          reference: string | null
          statut: string | null
          type_transaction: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date_transaction?: string | null
          destinataire?: string | null
          id?: string
          legacy_id?: string | null
          montant?: number | null
          operateur?: string | null
          reference?: string | null
          statut?: string | null
          type_transaction?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date_transaction?: string | null
          destinataire?: string | null
          id?: string
          legacy_id?: string | null
          montant?: number | null
          operateur?: string | null
          reference?: string | null
          statut?: string | null
          type_transaction?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      unions: {
        Row: {
          commune_id: string | null
          contact: string | null
          created_at: string
          date_creation: string | null
          email: string | null
          federation_id: string | null
          id: string
          legacy_id: number | null
          nbre_membres: number
          nom: string
          responsable_id: string | null
          statut: string
          telephone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          commune_id?: string | null
          contact?: string | null
          created_at?: string
          date_creation?: string | null
          email?: string | null
          federation_id?: string | null
          id?: string
          legacy_id?: number | null
          nbre_membres?: number
          nom: string
          responsable_id?: string | null
          statut?: string
          telephone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          commune_id?: string | null
          contact?: string | null
          created_at?: string
          date_creation?: string | null
          email?: string | null
          federation_id?: string | null
          id?: string
          legacy_id?: number | null
          nbre_membres?: number
          nom?: string
          responsable_id?: string | null
          statut?: string
          telephone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "unions_commune_id_fkey"
            columns: ["commune_id"]
            isOneToOne: false
            referencedRelation: "communes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unions_federation_id_fkey"
            columns: ["federation_id"]
            isOneToOne: false
            referencedRelation: "federations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unions_responsable_id_fkey"
            columns: ["responsable_id"]
            isOneToOne: false
            referencedRelation: "employes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_module_access: {
        Row: {
          created_at: string
          id: string
          module_slug: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          module_slug: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          module_slug?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          user_id?: string | null
        }
        Relationships: []
      }
      vehicules: {
        Row: {
          annee: number | null
          created_at: string | null
          id: string
          immatriculation: string
          legacy_id: string | null
          marque: string | null
          modele: string | null
          statut: string | null
          updated_at: string | null
        }
        Insert: {
          annee?: number | null
          created_at?: string | null
          id?: string
          immatriculation: string
          legacy_id?: string | null
          marque?: string | null
          modele?: string | null
          statut?: string | null
          updated_at?: string | null
        }
        Update: {
          annee?: number | null
          created_at?: string | null
          id?: string
          immatriculation?: string
          legacy_id?: string | null
          marque?: string | null
          modele?: string | null
          statut?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ventes: {
        Row: {
          client_id: string | null
          created_at: string | null
          date_vente: string | null
          designation: string | null
          id: string
          legacy_id: string | null
          montant: number | null
          quantite: number | null
          reference: string
          statut: string | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          date_vente?: string | null
          designation?: string | null
          id?: string
          legacy_id?: string | null
          montant?: number | null
          quantite?: number | null
          reference: string
          statut?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          date_vente?: string | null
          designation?: string | null
          id?: string
          legacy_id?: string | null
          montant?: number | null
          quantite?: number | null
          reference?: string
          statut?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ventes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      zones: {
        Row: {
          commune_id: string | null
          created_at: string
          id: string
          legacy_id: number | null
          nom: string
          updated_at: string
        }
        Insert: {
          commune_id?: string | null
          created_at?: string
          id?: string
          legacy_id?: number | null
          nom: string
          updated_at?: string
        }
        Update: {
          commune_id?: string | null
          created_at?: string
          id?: string
          legacy_id?: number | null
          nom?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "zones_commune_id_fkey"
            columns: ["commune_id"]
            isOneToOne: false
            referencedRelation: "communes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "gestionnaire" | "agent"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "gestionnaire", "agent"],
    },
  },
} as const
