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
          created_at: string
          date_achat: string
          designation: string | null
          fournisseur_id: string | null
          id: string
          legacy_id: string | null
          montant: number
          quantite: number
          reference: string
          statut: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_achat?: string
          designation?: string | null
          fournisseur_id?: string | null
          id?: string
          legacy_id?: string | null
          montant?: number
          quantite?: number
          reference: string
          statut?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_achat?: string
          designation?: string | null
          fournisseur_id?: string | null
          id?: string
          legacy_id?: string | null
          montant?: number
          quantite?: number
          reference?: string
          statut?: string
          updated_at?: string
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
          created_at: string
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
          type_document: string
          updated_at: string
        }
        Insert: {
          auteur_id?: string | null
          auteur_nom?: string | null
          categorie?: string | null
          created_at?: string
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
          type_document?: string
          updated_at?: string
        }
        Update: {
          auteur_id?: string | null
          auteur_nom?: string | null
          categorie?: string | null
          created_at?: string
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
          type_document?: string
          updated_at?: string
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
          created_at: string
          designation: string
          id: string
          legacy_id: string | null
          magasin: string | null
          prix_unitaire: number
          quantite_stock: number
          seuil_alerte: number
          unite: string | null
          updated_at: string
        }
        Insert: {
          categorie?: string | null
          code?: string | null
          created_at?: string
          designation: string
          id?: string
          legacy_id?: string | null
          magasin?: string | null
          prix_unitaire?: number
          quantite_stock?: number
          seuil_alerte?: number
          unite?: string | null
          updated_at?: string
        }
        Update: {
          categorie?: string | null
          code?: string | null
          created_at?: string
          designation?: string
          id?: string
          legacy_id?: string | null
          magasin?: string | null
          prix_unitaire?: number
          quantite_stock?: number
          seuil_alerte?: number
          unite?: string | null
          updated_at?: string
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
          created_at: string
          exercice: string
          id: string
          intitule: string
          legacy_id: string | null
          montant_prevu: number
          montant_realise: number
          service: string | null
          statut: string
          updated_at: string
        }
        Insert: {
          categorie?: string | null
          created_at?: string
          exercice?: string
          id?: string
          intitule: string
          legacy_id?: string | null
          montant_prevu?: number
          montant_realise?: number
          service?: string | null
          statut?: string
          updated_at?: string
        }
        Update: {
          categorie?: string | null
          created_at?: string
          exercice?: string
          id?: string
          intitule?: string
          legacy_id?: string | null
          montant_prevu?: number
          montant_realise?: number
          service?: string | null
          statut?: string
          updated_at?: string
        }
        Relationships: []
      }
      carburant: {
        Row: {
          bon: string | null
          created_at: string
          date_service: string
          id: string
          kilometrage: number
          legacy_id: string | null
          litres: number
          prix_total: number
          station: string | null
          updated_at: string
          vehicule_id: string | null
        }
        Insert: {
          bon?: string | null
          created_at?: string
          date_service?: string
          id?: string
          kilometrage?: number
          legacy_id?: string | null
          litres?: number
          prix_total?: number
          station?: string | null
          updated_at?: string
          vehicule_id?: string | null
        }
        Update: {
          bon?: string | null
          created_at?: string
          date_service?: string
          id?: string
          kilometrage?: number
          legacy_id?: string | null
          litres?: number
          prix_total?: number
          station?: string | null
          updated_at?: string
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
          categorie: string | null
          contact: string | null
          created_at: string
          email: string | null
          id: string
          legacy_id: string | null
          nom: string
          statut: string
          telephone: string | null
          updated_at: string
        }
        Insert: {
          adresse?: string | null
          categorie?: string | null
          contact?: string | null
          created_at?: string
          email?: string | null
          id?: string
          legacy_id?: string | null
          nom: string
          statut?: string
          telephone?: string | null
          updated_at?: string
        }
        Update: {
          adresse?: string | null
          categorie?: string | null
          contact?: string | null
          created_at?: string
          email?: string | null
          id?: string
          legacy_id?: string | null
          nom?: string
          statut?: string
          telephone?: string | null
          updated_at?: string
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
          created_at: string
          date_debut: string | null
          date_fin: string | null
          employe_id: string | null
          id: string
          legacy_id: string | null
          motif: string | null
          nombre_jours: number
          statut: string
          type_conge: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_debut?: string | null
          date_fin?: string | null
          employe_id?: string | null
          id?: string
          legacy_id?: string | null
          motif?: string | null
          nombre_jours?: number
          statut?: string
          type_conge?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_debut?: string | null
          date_fin?: string | null
          employe_id?: string | null
          id?: string
          legacy_id?: string | null
          motif?: string | null
          nombre_jours?: number
          statut?: string
          type_conge?: string
          updated_at?: string
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
          banque: string | null
          categorie_personnel: string
          cni: string | null
          contrat_path: string | null
          created_at: string
          date_entree: string | null
          date_sortie: string | null
          departement_id: string | null
          dossier_path: string | null
          email: string | null
          fonction: string | null
          fonction_id: string | null
          id: string
          legacy_id: string | null
          localite: string | null
          matricule: string | null
          niveau_etudes: string | null
          nom: string
          numero_compte: string | null
          prenom: string | null
          profil: string | null
          profil_id: string | null
          responsable: string | null
          service: string | null
          statut: string
          telephone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          banque?: string | null
          categorie_personnel?: string
          cni?: string | null
          contrat_path?: string | null
          created_at?: string
          date_entree?: string | null
          date_sortie?: string | null
          departement_id?: string | null
          dossier_path?: string | null
          email?: string | null
          fonction?: string | null
          fonction_id?: string | null
          id?: string
          legacy_id?: string | null
          localite?: string | null
          matricule?: string | null
          niveau_etudes?: string | null
          nom: string
          numero_compte?: string | null
          prenom?: string | null
          profil?: string | null
          profil_id?: string | null
          responsable?: string | null
          service?: string | null
          statut?: string
          telephone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          banque?: string | null
          categorie_personnel?: string
          cni?: string | null
          contrat_path?: string | null
          created_at?: string
          date_entree?: string | null
          date_sortie?: string | null
          departement_id?: string | null
          dossier_path?: string | null
          email?: string | null
          fonction?: string | null
          fonction_id?: string | null
          id?: string
          legacy_id?: string | null
          localite?: string | null
          matricule?: string | null
          niveau_etudes?: string | null
          nom?: string
          numero_compte?: string | null
          prenom?: string | null
          profil?: string | null
          profil_id?: string | null
          responsable?: string | null
          service?: string | null
          statut?: string
          telephone?: string | null
          updated_at?: string
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
          cout: number
          created_at: string
          date_entretien: string
          garage: string | null
          id: string
          legacy_id: string | null
          nature: string | null
          statut: string
          updated_at: string
          vehicule_id: string | null
        }
        Insert: {
          cout?: number
          created_at?: string
          date_entretien?: string
          garage?: string | null
          id?: string
          legacy_id?: string | null
          nature?: string | null
          statut?: string
          updated_at?: string
          vehicule_id?: string | null
        }
        Update: {
          cout?: number
          created_at?: string
          date_entretien?: string
          garage?: string | null
          id?: string
          legacy_id?: string | null
          nature?: string | null
          statut?: string
          updated_at?: string
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
      fiches_terrain: {
        Row: {
          association: string | null
          colline: string | null
          commune: string | null
          cooperative: string | null
          created_at: string
          date_adhesion: string | null
          federation: string | null
          id: string
          nom: string
          prenom: string | null
          province: string | null
          telephone: string | null
          union_nom: string | null
          zone: string | null
        }
        Insert: {
          association?: string | null
          colline?: string | null
          commune?: string | null
          cooperative?: string | null
          created_at?: string
          date_adhesion?: string | null
          federation?: string | null
          id?: string
          nom: string
          prenom?: string | null
          province?: string | null
          telephone?: string | null
          union_nom?: string | null
          zone?: string | null
        }
        Update: {
          association?: string | null
          colline?: string | null
          commune?: string | null
          cooperative?: string | null
          created_at?: string
          date_adhesion?: string | null
          federation?: string | null
          id?: string
          nom?: string
          prenom?: string | null
          province?: string | null
          telephone?: string | null
          union_nom?: string | null
          zone?: string | null
        }
        Relationships: []
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
          created_at: string
          domaine: string | null
          email: string | null
          id: string
          legacy_id: string | null
          nom: string
          statut: string
          telephone: string | null
          updated_at: string
        }
        Insert: {
          adresse?: string | null
          contact?: string | null
          created_at?: string
          domaine?: string | null
          email?: string | null
          id?: string
          legacy_id?: string | null
          nom: string
          statut?: string
          telephone?: string | null
          updated_at?: string
        }
        Update: {
          adresse?: string | null
          contact?: string | null
          created_at?: string
          domaine?: string | null
          email?: string | null
          id?: string
          legacy_id?: string | null
          nom?: string
          statut?: string
          telephone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      imputations: {
        Row: {
          code: string
          created_at: string
          description: string
          id: string
          legacy_id: number | null
          statut: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description: string
          id?: string
          legacy_id?: number | null
          statut?: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string
          id?: string
          legacy_id?: number | null
          statut?: string
          updated_at?: string
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
      livre_banque: {
        Row: {
          auteur_id: string | null
          auteur_nom: string | null
          created_at: string
          credit: number
          date_entree: string
          debit: number
          est_entree: boolean
          id: string
          imputation_id: string | null
          legacy_id: number | null
          libelle: string
          nom_operant: string | null
          solde: number
          statut: string
          updated_at: string
        }
        Insert: {
          auteur_id?: string | null
          auteur_nom?: string | null
          created_at?: string
          credit?: number
          date_entree?: string
          debit?: number
          est_entree?: boolean
          id?: string
          imputation_id?: string | null
          legacy_id?: number | null
          libelle: string
          nom_operant?: string | null
          solde?: number
          statut?: string
          updated_at?: string
        }
        Update: {
          auteur_id?: string | null
          auteur_nom?: string | null
          created_at?: string
          credit?: number
          date_entree?: string
          debit?: number
          est_entree?: boolean
          id?: string
          imputation_id?: string | null
          legacy_id?: number | null
          libelle?: string
          nom_operant?: string | null
          solde?: number
          statut?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "livre_banque_auteur_id_fkey"
            columns: ["auteur_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "livre_banque_imputation_id_fkey"
            columns: ["imputation_id"]
            isOneToOne: false
            referencedRelation: "imputations"
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
          created_at: string
          date_mouvement: string
          id: string
          legacy_id: string | null
          motif: string | null
          quantite: number
          reference: string | null
          service: string | null
          type_mouvement: string
          updated_at: string
        }
        Insert: {
          article_id?: string | null
          created_at?: string
          date_mouvement?: string
          id?: string
          legacy_id?: string | null
          motif?: string | null
          quantite?: number
          reference?: string | null
          service?: string | null
          type_mouvement?: string
          updated_at?: string
        }
        Update: {
          article_id?: string | null
          created_at?: string
          date_mouvement?: string
          id?: string
          legacy_id?: string | null
          motif?: string | null
          quantite?: number
          reference?: string | null
          service?: string | null
          type_mouvement?: string
          updated_at?: string
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
          beneficiaire: string | null
          compte: string | null
          created_at: string
          date_operation: string
          id: string
          legacy_id: string | null
          libelle: string
          montant: number
          statut: string
          type_operation: string
          updated_at: string
        }
        Insert: {
          beneficiaire?: string | null
          compte?: string | null
          created_at?: string
          date_operation?: string
          id?: string
          legacy_id?: string | null
          libelle: string
          montant?: number
          statut?: string
          type_operation?: string
          updated_at?: string
        }
        Update: {
          beneficiaire?: string | null
          compte?: string | null
          created_at?: string
          date_operation?: string
          id?: string
          legacy_id?: string | null
          libelle?: string
          montant?: number
          statut?: string
          type_operation?: string
          updated_at?: string
        }
        Relationships: []
      }
      partenaires: {
        Row: {
          contact: string | null
          created_at: string
          domaine: string | null
          id: string
          legacy_id: string | null
          localisation: string | null
          logo_path: string | null
          nom: string
          objet_collaboration: string | null
          pays: string | null
          statut: string
          telephone: string | null
          type_partenaire: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          contact?: string | null
          created_at?: string
          domaine?: string | null
          id?: string
          legacy_id?: string | null
          localisation?: string | null
          logo_path?: string | null
          nom: string
          objet_collaboration?: string | null
          pays?: string | null
          statut?: string
          telephone?: string | null
          type_partenaire?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          contact?: string | null
          created_at?: string
          domaine?: string | null
          id?: string
          legacy_id?: string | null
          localisation?: string | null
          logo_path?: string | null
          nom?: string
          objet_collaboration?: string | null
          pays?: string | null
          statut?: string
          telephone?: string | null
          type_partenaire?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      presences: {
        Row: {
          created_at: string
          date_presence: string
          employe_id: string | null
          heure_arrivee: string | null
          heure_depart: string | null
          id: string
          legacy_id: string | null
          observation: string | null
          statut: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_presence?: string
          employe_id?: string | null
          heure_arrivee?: string | null
          heure_depart?: string | null
          id?: string
          legacy_id?: string | null
          observation?: string | null
          statut?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_presence?: string
          employe_id?: string | null
          heure_arrivee?: string | null
          heure_depart?: string | null
          id?: string
          legacy_id?: string | null
          observation?: string | null
          statut?: string
          updated_at?: string
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
          created_at: string
          email: string | null
          id: string
          nom_complet: string | null
          service: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          nom_complet?: string | null
          service?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          nom_complet?: string | null
          service?: string | null
          updated_at?: string
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
          budget: number
          created_at: string
          date_debut: string | null
          date_fin: string | null
          description: string | null
          id: string
          intitule: string
          legacy_id: string | null
          objectifs: string | null
          responsable: string | null
          statut: string
          updated_at: string
        }
        Insert: {
          budget?: number
          created_at?: string
          date_debut?: string | null
          date_fin?: string | null
          description?: string | null
          id?: string
          intitule: string
          legacy_id?: string | null
          objectifs?: string | null
          responsable?: string | null
          statut?: string
          updated_at?: string
        }
        Update: {
          budget?: number
          created_at?: string
          date_debut?: string | null
          date_fin?: string | null
          description?: string | null
          id?: string
          intitule?: string
          legacy_id?: string | null
          objectifs?: string | null
          responsable?: string | null
          statut?: string
          updated_at?: string
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
          avancement: number
          budget: number
          budget_depense: number
          budget_restant: number
          chef_projet_id: string | null
          created_at: string
          date_debut: string | null
          date_fin: string | null
          description: string | null
          fichier_path: string | null
          id: string
          legacy_id: string | null
          objectifs: string | null
          partenaire_id: string | null
          programme_id: string | null
          responsable: string | null
          statut: string
          titre: string
          updated_at: string
          zone: string | null
        }
        Insert: {
          avancement?: number
          budget?: number
          budget_depense?: number
          budget_restant?: number
          chef_projet_id?: string | null
          created_at?: string
          date_debut?: string | null
          date_fin?: string | null
          description?: string | null
          fichier_path?: string | null
          id?: string
          legacy_id?: string | null
          objectifs?: string | null
          partenaire_id?: string | null
          programme_id?: string | null
          responsable?: string | null
          statut?: string
          titre: string
          updated_at?: string
          zone?: string | null
        }
        Update: {
          avancement?: number
          budget?: number
          budget_depense?: number
          budget_restant?: number
          chef_projet_id?: string | null
          created_at?: string
          date_debut?: string | null
          date_fin?: string | null
          description?: string | null
          fichier_path?: string | null
          id?: string
          legacy_id?: string | null
          objectifs?: string | null
          partenaire_id?: string | null
          programme_id?: string | null
          responsable?: string | null
          statut?: string
          titre?: string
          updated_at?: string
          zone?: string | null
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
          created_at: string
          employe_id: string | null
          etat_civil: string
          id: string
          legacy_id: string | null
          nombre_enfants: number
          salaire_base: number
          updated_at: string
        }
        Insert: {
          auteur_id?: string | null
          created_at?: string
          employe_id?: string | null
          etat_civil?: string
          id?: string
          legacy_id?: string | null
          nombre_enfants?: number
          salaire_base?: number
          updated_at?: string
        }
        Update: {
          auteur_id?: string | null
          created_at?: string
          employe_id?: string | null
          etat_civil?: string
          id?: string
          legacy_id?: string | null
          nombre_enfants?: number
          salaire_base?: number
          updated_at?: string
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
            isOneToOne: true
            referencedRelation: "employes"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions_mobile: {
        Row: {
          agent: string | null
          commission: number
          created_at: string
          date_operation: string
          id: string
          legacy_id: string | null
          montant: number
          operateur: string
          reference: string | null
          statut: string
          telephone: string | null
          type_operation: string
          updated_at: string
        }
        Insert: {
          agent?: string | null
          commission?: number
          created_at?: string
          date_operation?: string
          id?: string
          legacy_id?: string | null
          montant?: number
          operateur?: string
          reference?: string | null
          statut?: string
          telephone?: string | null
          type_operation?: string
          updated_at?: string
        }
        Update: {
          agent?: string | null
          commission?: number
          created_at?: string
          date_operation?: string
          id?: string
          legacy_id?: string | null
          montant?: number
          operateur?: string
          reference?: string | null
          statut?: string
          telephone?: string | null
          type_operation?: string
          updated_at?: string
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
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicules: {
        Row: {
          affectation: string | null
          chauffeur: string | null
          created_at: string
          id: string
          immatriculation: string
          kilometrage: number
          legacy_id: string | null
          marque: string | null
          modele: string | null
          statut: string
          type_vehicule: string | null
          updated_at: string
        }
        Insert: {
          affectation?: string | null
          chauffeur?: string | null
          created_at?: string
          id?: string
          immatriculation: string
          kilometrage?: number
          legacy_id?: string | null
          marque?: string | null
          modele?: string | null
          statut?: string
          type_vehicule?: string | null
          updated_at?: string
        }
        Update: {
          affectation?: string | null
          chauffeur?: string | null
          created_at?: string
          id?: string
          immatriculation?: string
          kilometrage?: number
          legacy_id?: string | null
          marque?: string | null
          modele?: string | null
          statut?: string
          type_vehicule?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      ventes: {
        Row: {
          client_id: string | null
          created_at: string
          date_vente: string
          designation: string | null
          id: string
          legacy_id: string | null
          montant: number
          quantite: number
          reference: string
          statut: string
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          date_vente?: string
          designation?: string | null
          id?: string
          legacy_id?: string | null
          montant?: number
          quantite?: number
          reference: string
          statut?: string
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          date_vente?: string
          designation?: string | null
          id?: string
          legacy_id?: string | null
          montant?: number
          quantite?: number
          reference?: string
          statut?: string
          updated_at?: string
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
      [_ in never]: never
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
