import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ORG_NAME } from "@/lib/modules";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logoUrl from "@/assets/cnac-logo.png";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Connexion — CNAC MURIMA W'ISANGI" },
      {
        name: "description",
        content:
          "Accès réservé au personnel autorisé du système intégré de gestion de CNAC MURIMA W'ISANGI.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Connexion — CNAC MURIMA W'ISANGI" },
      { property: "og:description", content: "Espace de gestion réservé au personnel autorisé." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/tableau-de-bord", replace: true });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error("Identifiants incorrects ou compte non autorisé.");
      return;
    }
    toast.success("Connexion réussie.");
    navigate({ to: "/tableau-de-bord", replace: true });
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-sidebar p-12 text-sidebar-foreground lg:flex">
        <div>
          <img
            src={logoUrl}
            alt="Logo de CNAC MURIMA W'ISANGI"
            className="mb-8 size-32 rounded-md bg-background object-contain p-2"
          />
          <p className="text-xs font-semibold tracking-[0.25em] uppercase opacity-60">
            Système intégré de gestion
          </p>
          <h1 className="mt-3 text-4xl leading-tight font-semibold">{ORG_NAME}</h1>
        </div>
        <ul className="space-y-3 text-sm opacity-80">
          <li>Administration et ressources humaines</li>
          <li>Membres, associations et coopératives</li>
          <li>Clients, fournisseurs, caisse et stock</li>
          <li>Charroi, carburant et entretiens</li>
          <li>Projets, partenariats, suivi et rapports</li>
        </ul>
        <div>
          <p className="text-xs opacity-60">Accès strictement réservé au personnel autorisé.</p>
          <p className="mt-3 text-[11px] opacity-50">
            Copy rights© CNAC BURUNDI 2026, Tous droits reserves — Développé par{" "}
            <a
              href="https://www.sightnetwork.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-sidebar-foreground"
            >
              SIGHT AFRICA
            </a>{" "}
            (www.sightnetwork.org) en interne
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <div className="lg:hidden">
            <img
              src={logoUrl}
              alt="Logo de CNAC MURIMA W'ISANGI"
              className="mb-6 size-28 rounded-md border border-border bg-background object-contain p-2"
            />
            <p className="text-xs font-semibold tracking-[0.25em] text-muted-foreground uppercase">
              Système de gestion
            </p>
            <h1 className="mt-2 text-2xl font-semibold">{ORG_NAME}</h1>
          </div>
          <h2 className="mt-8 text-xl font-semibold lg:mt-0">Connexion</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Saisissez vos identifiants professionnels pour accéder aux écrans de gestion.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Adresse e-mail</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@organisation.bi"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Connexion…" : "Se connecter"}
            </Button>
          </form>

          <p className="mt-6 text-[11px] text-muted-foreground/70">
            Copy rights© CNAC BURUNDI 2026, Tous droits reserves — Développé par{" "}
            <a
              href="https://www.sightnetwork.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              SIGHT AFRICA
            </a>{" "}
            (www.sightnetwork.org) en interne
          </p>
        </div>
      </div>
    </div>
  );
}
