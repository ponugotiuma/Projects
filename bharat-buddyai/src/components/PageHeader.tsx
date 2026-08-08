import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  accent?: string;
}

export function PageHeader({ icon: Icon, title, description, accent = "from-primary to-primary-glow" }: Props) {
  return (
    <div className="flex items-start gap-4">
      <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-primary-foreground shadow-glow`}>
        <Icon className="h-7 w-7" />
      </div>
      <div className="min-w-0">
        <h1 className="font-display text-3xl font-bold md:text-4xl">{title}</h1>
        <p className="mt-1 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

import { useT } from "@/lib/i18n";

export function FooterCopy() {
  const { t } = useT();
  return (
    <p className="pt-6 text-center text-xs text-muted-foreground">
      {t("footer.copy", { year: new Date().getFullYear() })}
    </p>
  );
}
