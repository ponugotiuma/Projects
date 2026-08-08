import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useT } from "@/lib/i18n";

export function SiteHeader() {
  const { t } = useT();
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setSignedIn(!!session?.user);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  return (
    <header className="sticky top-0 z-40 w-full glass">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/"><Logo /></Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">{t("nav.features")}</a>
          <a href="#who" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">{t("nav.who")}</a>
          <a href="#how" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">{t("nav.how")}</a>
        </nav>
        <div className="flex items-center gap-2">
          {signedIn ? (
            <>
              <Button onClick={handleSignOut} variant="ghost" size="sm">{t("nav.signOut")}</Button>
              <Link to="/dashboard">
                <Button size="sm" className="gradient-bg text-primary-foreground shadow-glow hover:opacity-95">
                  {t("nav.openDashboard")}
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/auth"><Button variant="ghost" size="sm">{t("nav.signIn")}</Button></Link>
              <Link to="/auth">
                <Button size="sm" className="gradient-bg text-primary-foreground shadow-glow hover:opacity-95">
                  {t("nav.getStarted")}
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
