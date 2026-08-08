import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  to: string;
  accent?: string;
}

export function FeatureCard({ icon: Icon, title, description, to, accent = "from-primary to-primary-glow" }: Props) {
  return (
    <Link
      to={to}
      className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elegant"
    >
      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${accent} text-primary-foreground shadow-glow`}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="space-y-1.5">
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
      <div className="mt-auto flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
        Open tool <ArrowUpRight className="h-4 w-4" />
      </div>
    </Link>
  );
}
