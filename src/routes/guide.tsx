import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ORG_NAME } from "@/lib/modules";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/guide")({
  head: () => ({
    meta: [
      { title: "Guide d'utilisation — CNAC MURIMA W'ISANGI" },
      {
        name: "description",
        content:
          "Guide pas à pas du système de gestion CNAC MURIMA W'ISANGI : connexion, navigation, tableau de bord, saisie des listes, communauté, stock, charroi et rapports.",
      },
      { property: "og:title", content: "Guide d'utilisation — CNAC MURIMA W'ISANGI" },
      {
        property: "og:description",
        content: "Mode d'emploi complet du système de gestion CNAC MURIMA W'ISANGI.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: GuidePage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        {children}
      </CardContent>
    </Card>
  );
}

const GROUPES: Array<[string, string]> = [
  ["Administration / RH", "Employés, Congés, Présences, Salaires"],
  ["Communauté", "Fédérations, Unions, Coopératives, Associations, Membres, Intervenants"],
  ["Localisation", "Provinces, Communes, Zones, Collines"],
  ["Données commerciales", "Clients, Fournisseurs, Achats, Ventes, Budgets"],
  ["Stock", "Articles, Mouvements de stock"],
  ["Charroi", "Véhicules, Carburant, Entretiens"],
  ["Finances & suivi", "Caisse & opérations, Mobile money, Archives"],
  ["Projets & partenariats", "Programmes, Partenaires, Projets"],
];

function GuidePage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <header>
          <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
            {ORG_NAME}
          </p>
          <h1 className="mt-1 text-2xl font-semibold">Guide d'utilisation</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Mode d'emploi du système de gestion, destiné aux équipes opérationnelles.
          </p>
        </header>

        <div className="grid gap-4 lg:grid-cols-2">
          <Section title="1. Se connecter">
            <ol className="list-decimal space-y-1 pl-5">
              <li>Ouvrez l'adresse de l'application.</li>
              <li>Saisissez votre e-mail et votre mot de passe, puis cliquez sur « Se connecter ».</li>
              <li>Vous arrivez directement sur le Tableau de bord.</li>
            </ol>
            <p>
              Il n'y a pas de création de compte publique : c'est l'administrateur qui crée les
              comptes et réinitialise les mots de passe.
            </p>
          </Section>

          <Section title="2. Se repérer dans l'écran">
            <ul className="list-disc space-y-1 pl-5">
              <li>Menu latéral à gauche : accès à toutes les rubriques (icône ☰ sur téléphone).</li>
              <li>Tableau de bord : chiffres clés et alertes.</li>
              <li>Rapports : synthèses par domaine.</li>
              <li>Déconnexion : bouton en bas du menu.</li>
            </ul>
            <div className="overflow-hidden rounded-md border border-border">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/60 text-foreground">
                  <tr>
                    <th className="px-3 py-2 font-medium">Groupe</th>
                    <th className="px-3 py-2 font-medium">Contenu</th>
                  </tr>
                </thead>
                <tbody>
                  {GROUPES.map(([g, c]) => (
                    <tr key={g} className="border-t border-border">
                      <td className="px-3 py-2 font-medium text-foreground">{g}</td>
                      <td className="px-3 py-2">{c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="3. Le tableau de bord">
            <ul className="list-disc space-y-1 pl-5">
              <li>Valeur et nombre d'articles en stock.</li>
              <li>Articles sous le seuil ou en rupture.</li>
              <li>Carburant disponible et dépenses de la période.</li>
              <li>Véhicules à entretenir.</li>
              <li>Alertes prioritaires et raccourcis vers Stock, Carburant, Véhicules, Rapports.</li>
            </ul>
            <p>Si une rubrique est vide, un message l'indique : les données restent à saisir.</p>
          </Section>

          <Section title="4. Travailler avec une rubrique">
            <ol className="list-decimal space-y-1 pl-5">
              <li>Rechercher : tapez dans le champ de recherche en haut de la liste.</li>
              <li>Ajouter : bouton « Nouveau », remplissez le formulaire, enregistrez.</li>
              <li>Modifier : cliquez sur la ligne, ajustez, enregistrez.</li>
              <li>Supprimer : action de suppression sur la ligne (confirmation demandée).</li>
            </ol>
            <p>
              Les champs de type liste (Province, Colline, Employé…) proposent les fiches déjà
              créées : créez d'abord l'élément parent si vous ne le trouvez pas.
            </p>
          </Section>

          <Section title="5. Hiérarchie communautaire">
            <pre className="rounded-md bg-muted/60 p-3 text-xs text-foreground">{`Fédération      (Province)
   └── Union        (Commune de la province)
        └── Coopérative   (Zone de la commune)
             └── Association   (Colline de la zone)
                  └── Membres`}</pre>
            <p>
              L'ordre de saisie est obligatoire : l'administration crée la fédération, la fédération
              crée ses unions, une union crée ses coopératives, une coopérative crée ses
              associations, et l'association enregistre ses membres.
            </p>
            <p>
              Chaque niveau hérite de la localisation du niveau supérieur : les communes proposées
              sont celles de la province de la fédération, les zones celles de la commune de
              l'union, les collines celles de la zone de la coopérative. Les Intervenants sont
              rattachés à une province.
            </p>
          </Section>

          <Section title="6. Localisation">
            <p>
              Les lieux suivent la hiérarchie Province → Commune → Zone → Colline. Créez toujours le
              niveau supérieur avant le niveau inférieur.
            </p>
          </Section>

          <Section title="7. Stock">
            <ol className="list-decimal space-y-1 pl-5">
              <li>Créez l'article (désignation, unité, seuil d'alerte, prix).</li>
              <li>Enregistrez chaque mouvement (entrée ou sortie, quantité, date).</li>
              <li>Le stock et les alertes de seuil se mettent à jour automatiquement.</li>
            </ol>
          </Section>

          <Section title="8. Charroi (véhicules et carburant)">
            <ol className="list-decimal space-y-1 pl-5">
              <li>Enregistrez le véhicule (plaque, marque, type, statut).</li>
              <li>Saisissez chaque plein (véhicule, quantité, date, station/dépôt).</li>
              <li>Notez les entretiens réalisés ou prévus pour suivre les échéances.</li>
            </ol>
          </Section>

          <Section title="9. Rapports">
            <p>
              La page Rapports rassemble les synthèses : ressources humaines, carburant, communauté,
              projets et budgets. Elle se met à jour à partir des données saisies.
            </p>
          </Section>

          <Section title="10. Bonnes pratiques">
            <ul className="list-disc space-y-1 pl-5">
              <li>Saisissez les données au fil de l'eau, pas en fin de mois.</li>
              <li>Respectez l'ordre des niveaux pour éviter les fiches orphelines.</li>
              <li>Vérifiez les alertes du tableau de bord chaque matin.</li>
              <li>Ne partagez jamais votre mot de passe ; un compte par agent.</li>
              <li>Déconnectez-vous sur un poste partagé.</li>
            </ul>
          </Section>

          <Section title="11. Données reprises de l'ancienne base">
            <ul className="list-disc space-y-1 pl-5">
              <li>
                La colonne « prix » du carburant contenait le type de produit (ex. « Mazout ») :
                placée dans Station/Dépôt, le montant reste à 0 tant qu'il n'est pas saisi.
              </li>
              <li>
                Achats, Ventes, Clients, Projets, Programmes et Partenaires étaient vides : rien n'a
                été inventé, ces rubriques sont à remplir.
              </li>
            </ul>
          </Section>

          <Section title="12. Assistance">
            <p>
              Pour un nouveau compte, un droit d'accès ou une anomalie, contactez l'administrateur du
              système.
            </p>
          </Section>
        </div>
      </div>
    </AppShell>
  );
}
