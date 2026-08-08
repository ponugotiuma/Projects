import { createFileRoute, Link, Outlet, useLocation, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  LayoutDashboard, FileText, ScrollText, ShieldAlert, Briefcase, CalendarClock,
  BarChart3, Settings, LogOut, Home, ShieldCheck,
} from "lucide-react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { getProfile, updateProfile } from "@/lib/data.functions";
import { toast } from "sonner";
import { LANGUAGES, labelToCode, codeToLabel, useT, type LangCode } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t, lang, setLang } = useT();
  const fetchProfile = useServerFn(getProfile);
  const updateFn = useServerFn(updateProfile);
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: () => fetchProfile() });

  // Sync i18n with the user's saved language preference.
  useEffect(() => {
    if (profile?.preferred_language) {
      const code = labelToCode(profile.preferred_language);
      if (code !== lang) setLang(code);
    }
  }, [profile?.preferred_language, lang, setLang]);

  const nav = [
    { to: "/dashboard", label: t("side.overview"), icon: LayoutDashboard, exact: true },
    { to: "/dashboard/documents", label: t("side.documents"), icon: FileText, exact: false },
    { to: "/dashboard/forms", label: t("side.forms"), icon: ScrollText, exact: false },
    { to: "/dashboard/scam-shield", label: t("side.scam"), icon: ShieldAlert, exact: false },
    { to: "/dashboard/women-safety", label: t("side.women"), icon: ShieldCheck, exact: false },
    { to: "/dashboard/career", label: t("side.career"), icon: Briefcase, exact: false },
    { to: "/dashboard/reminders", label: t("side.reminders"), icon: CalendarClock, exact: false },
    { to: "/dashboard/analytics", label: t("side.analytics"), icon: BarChart3, exact: false },
    { to: "/dashboard/settings", label: t("side.settings"), icon: Settings, exact: false },
  ] as const;

  const langMutation = useMutation({
    mutationFn: (label: string) => updateFn({ data: { preferred_language: label } }),
    onSuccess: (_d, label) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setLang(labelToCode(label));
      toast.success(t("toast.langSet", { lang: label }));
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    toast.success(t("toast.signedOut"));
    router.invalidate();
    navigate({ to: "/auth", replace: true });
  }

  const initials = (profile?.full_name || profile?.email || "U").slice(0, 1).toUpperCase();
  const currentLabel = profile?.preferred_language ?? codeToLabel(lang as LangCode);

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex max-w-7xl">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-sidebar p-4 md:flex">
          <div className="px-2 py-2"><Link to="/dashboard"><Logo /></Link></div>

          <Link to="/" className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
            <Home className="h-3.5 w-3.5" /> {t("nav.backHome")}
          </Link>

          <nav className="mt-6 flex-1 space-y-1">
            {nav.map((item) => {
              const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
              return (
                <Link key={item.to} to={item.to}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                  }`}>
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 space-y-1 rounded-xl border border-border bg-card p-3">
            <p className="px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{t("side.language")}</p>
            <select
              value={currentLabel}
              onChange={(e) => langMutation.mutate(e.target.value)}
              disabled={langMutation.isPending}
              className="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
            >
              {LANGUAGES.map((l) => <option key={l.code} value={l.label}>{l.label}</option>)}
            </select>
          </div>

          <div className="mt-3 rounded-xl border border-border bg-card p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-bg text-sm font-semibold text-primary-foreground">{initials}</div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{profile?.full_name || "Buddy user"}</p>
                <p className="truncate text-xs text-muted-foreground">{profile?.email}</p>
              </div>
            </div>
            <Button onClick={handleSignOut} variant="outline" size="sm" className="mt-3 w-full">
              <LogOut className="mr-2 h-3.5 w-3.5" /> {t("nav.signOut")}
            </Button>
          </div>
        </aside>

        <main className="flex-1 min-w-0 p-6 md:p-10"><Outlet /></main>
      </div>
    </div>
  );
}
