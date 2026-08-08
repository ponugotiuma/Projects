import { createFileRoute } from "@tanstack/react-router";
import { Briefcase, Upload, Loader2, ExternalLink } from "lucide-react";
import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { PageHeader, FooterCopy } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { analyzeResume } from "@/lib/ai.functions";
import { listCareer, getProfile } from "@/lib/data.functions";
import { fileToBase64, MAX_FILE_MB } from "@/lib/file-utils";

export const Route = createFileRoute("/_authenticated/dashboard/career")({
  head: () => ({ meta: [{ title: "Career Navigator · Bharat Buddy AI" }] }),
  component: CareerPage,
});

function CareerPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const qc = useQueryClient();
  const analyze = useServerFn(analyzeResume);
  const listFn = useServerFn(listCareer);
  const fetchProfile = useServerFn(getProfile);
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: () => fetchProfile() });
  const { data: items = [] } = useQuery({ queryKey: ["career"], queryFn: () => listFn() });

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      if (file.size > MAX_FILE_MB * 1024 * 1024) throw new Error(`File too large (max ${MAX_FILE_MB} MB)`);
      const dataBase64 = await fileToBase64(file);
      return analyze({
        data: {
          fileName: file.name,
          mimeType: file.type || "application/octet-stream",
          dataBase64,
          language: profile?.preferred_language ?? "English",
        },
      });
    },
    onSuccess: () => {
      toast.success("Career roadmap ready!");
      qc.invalidateQueries({ queryKey: ["career"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      await mutation.mutateAsync(file);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        icon={Briefcase}
        title="Career Navigator"
        description="Upload your resume for a skill-gap analysis, a custom roadmap and free learning links."
        accent="from-[oklch(0.55_0.18_280)] to-[oklch(0.7_0.16_300)]"
      />

      <div className="rounded-3xl border-2 border-dashed border-border bg-card p-10 text-center shadow-soft">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
          {busy ? <Loader2 className="h-8 w-8 animate-spin" /> : <Upload className="h-8 w-8" />}
        </div>
        <h3 className="mt-4 font-display text-xl font-semibold">Upload your resume</h3>
        <p className="mt-2 text-sm text-muted-foreground">PDF, JPG or PNG · up to {MAX_FILE_MB} MB</p>
        <input ref={inputRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={onFile} disabled={busy} />
        <Button onClick={() => inputRef.current?.click()} disabled={busy} className="mt-6 gradient-bg text-primary-foreground shadow-glow">
          {busy ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analysing…</> : <><Upload className="mr-2 h-4 w-4" /> Choose file</>}
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((c) => {
          const skills = (c.skills as string[]) ?? [];
          const gaps = (c.skill_gaps as string[]) ?? [];
          const roadmap = (c.roadmap as Array<{ step: string; months: string }>) ?? [];
          const links = (c.learning_links as Array<{ title: string; url: string }>) ?? [];
          return (
            <div key={c.id} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <p className="font-display text-lg font-semibold">{c.resume_name}</p>
              <p className="mt-2 text-sm text-muted-foreground">{c.summary}</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Your skills</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {skills.map((s, i) => <span key={i} className="rounded-full bg-secondary px-2.5 py-1 text-xs">{s}</span>)}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Skill gaps</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {gaps.map((s, i) => <span key={i} className="rounded-full bg-warning/20 px-2.5 py-1 text-xs text-warning-foreground">{s}</span>)}
                  </div>
                </div>
              </div>
              {roadmap.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Roadmap</p>
                  <ol className="mt-2 space-y-2 text-sm">
                    {roadmap.map((r, i) => (
                      <li key={i} className="flex gap-3"><span className="font-semibold text-primary">{r.months}</span><span>{r.step}</span></li>
                    ))}
                  </ol>
                </div>
              )}
              {links.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Free learning</p>
                  <ul className="mt-2 space-y-1.5 text-sm">
                    {links.map((l, i) => (
                      <li key={i}>
                        <a href={l.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                          {l.title} <ExternalLink className="h-3 w-3" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <FooterCopy />
    </div>
  );
}
