import { Link, Outlet, createRootRouteWithContext, useRouter, useRouterState, HeadContent, Scripts } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import appCss from "../styles.css?url";
import { branches, SALON_PHONE, SALON_PHONE_TEL } from "@/lib/salon-data";
import { store, useSalonStore } from "@/lib/salon-store";
import { Phone, Scissors } from "lucide-react";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl">404</h1>
        <p className="mt-3 text-muted-foreground">This page slipped out for a trim.</p>
        <Link to="/" className="mt-6 inline-flex rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground">Back to dashboard</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  console.error(error);
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button onClick={() => { router.invalidate(); reset(); }} className="mt-6 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground">Try again</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lumière — Salon OS" },
      { name: "description", content: "Omnichannel salon management. Calendar, commissions, multi-branch — one console." },
      { property: "og:title", content: "Lumière — Salon OS" },
      { name: "twitter:title", content: "Lumière — Salon OS" },
      { property: "og:description", content: "Omnichannel salon management. Calendar, commissions, multi-branch — one console." },
      { name: "twitter:description", content: "Omnichannel salon management. Calendar, commissions, multi-branch — one console." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8d5e2f0c-ecde-42d3-9e70-76499e8b5e50/id-preview-27323115--9ef56e1b-682a-4280-bc8c-0b79081d20e0.lovable.app-1779772267589.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8d5e2f0c-ecde-42d3-9e70-76499e8b5e50/id-preview-27323115--9ef56e1b-682a-4280-bc8c-0b79081d20e0.lovable.app-1779772267589.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen">
        <TopBar />
        <Outlet />
        <footer className="border-t border-border/60 mt-20 py-6 text-center text-xs text-muted-foreground">
          Lumière Salon OS · Built for the omnichannel age
        </footer>
      </div>
    </QueryClientProvider>
  );
}

function TopBar() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const activeBranchId = useSalonStore((s) => s.activeBranchId);
  const nav = [
    { to: "/", label: "Overview" },
    { to: "/calendar", label: "Calendar" },
    { to: "/commissions", label: "Commissions" },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 backdrop-blur-xl bg-background/70">
      <div className="mx-auto max-w-[1400px] px-6 py-4 flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="size-9 rounded-full bg-gradient-to-br from-gold to-gold-soft flex items-center justify-center">
            <Scissors className="size-4 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg">Lumière</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Salon OS</div>
          </div>
        </Link>
        <nav className="flex items-center gap-1">
          {nav.map((n) => {
            const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to}
                className={`px-4 py-1.5 rounded-full text-sm transition-colors ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <a href={`tel:${SALON_PHONE_TEL}`}
            className="hidden md:inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/5 px-3.5 py-1.5 text-xs text-gold hover:bg-gold/10">
            <Phone className="size-3.5" /> {SALON_PHONE}
          </a>
          <span className="text-xs uppercase tracking-widest text-muted-foreground hidden sm:inline">Branch</span>
          <select
            value={activeBranchId}
            onChange={(e) => store.setBranch(e.target.value)}
            className="rounded-full bg-secondary border border-border px-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All branches</option>
            {branches.map((b) => <option key={b.id} value={b.id}>{b.name} · {b.city}</option>)}
          </select>
        </div>

      </div>
    </header>
  );
}
