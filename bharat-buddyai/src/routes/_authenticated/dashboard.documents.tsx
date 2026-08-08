import { createFileRoute } from "@tanstack/react-router";
import { FileText, Upload, Loader2, Calendar, CheckCircle2 } from "lucide-react";
import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { PageHeader, FooterCopy } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { summarizeDocument } from "@/lib/ai.functions";
import { listDocuments, getProfile } from "@/lib/data.functions";
import { fileToBase64, MAX_FILE_MB } from "@/lib/file-utils";

export const Route = createFileRoute("/_authenticated/dashboard/documents")({
  head: () => ({ meta: [{ title: "Document Explainer · Bharat Buddy AI" }] }),
  component: DocumentsPage,
});

function DocumentsPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const qc = useQueryClient();
  const summarize = useServerFn(summarizeDocument);
  const listDocs = useServerFn(listDocuments);
  const fetchProfile = useServerFn(getProfile);
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: () => fetchProfile() });
  const { data: docs = [] } = useQuery({ queryKey: ["documents"], queryFn: () => listDocs() });

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      if (file.size > MAX_FILE_MB * 1024 * 1024) throw new Error(`File too large (max ${MAX_FILE_MB} MB)`);
      const dataBase64 = await fileToBase64(file);
      return summarize({
        data: {
          fileName: file.name,
          mimeType: file.type || "application/octet-stream",
          dataBase64,
          language: profile?.preferred_language ?? "English",
        },
      });
    },
    onSuccess: () => {
      toast.success("Document explained!");
      qc.invalidateQueries({ queryKey: ["documents"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
      qc.invalidateQueries({ queryKey: ["reminders"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to explain"),
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
      <PageHeader icon={FileText} title="Document Explainer" description="Upload any PDF, image or screenshot. Buddy will summarise it, pull out dates and tell you what to do next." />

      <div className="rounded-3xl border-2 border-dashed border-border bg-card p-10 text-center shadow-soft">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
          {busy ? <Loader2 className="h-8 w-8 animate-spin" /> : <Upload className="h-8 w-8" />}
        </div>
        <h3 className="mt-4 font-display text-xl font-semibold">Drop your document here</h3>
        <p className="mt-2 text-sm text-muted-foreground">PDF, JPG, PNG · up to {MAX_FILE_MB} MB · explained in {profile?.preferred_language ?? "English"}</p>
        <input ref={inputRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={onFile} disabled={busy} />
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button onClick={() => inputRef.current?.click()} disabled={busy} className="gradient-bg text-primary-foreground shadow-glow">
            {busy ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analysing…</> : <><Upload className="mr-2 h-4 w-4" />Choose file</>}
          </Button>
        </div>
      </div>

      {docs.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-display text-lg font-semibold">Recent</h2>
          {docs.map((d) => {
            const dates = (d.important_dates as Array<{ date: string; label: string }>) ?? [];
            const items = (d.action_items as string[]) ?? [];
            return (
              <div key={d.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <p className="font-semibold">{d.file_name}</p>
                <p className="mt-2 text-sm text-muted-foreground">{d.summary}</p>
                {items.length > 0 && (
                  <ul className="mt-3 space-y-1.5 text-sm">
                    {items.map((it, i) => (
                      <li key={i} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {it}</li>
                    ))}
                  </ul>
                )}
                {dates.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {dates.map((dt, i) => (
                      <span key={i} className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                        <Calendar className="h-3 w-3" /> {dt.date} — {dt.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <FooterCopy />
    </div>
  );
}
