import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { PageHeader, FooterCopy } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getProfile, updateProfile } from "@/lib/data.functions";
import { applyTheme } from "@/lib/theme";

export const Route = createFileRoute("/_authenticated/dashboard/settings")({
  head: () => ({ meta: [{ title: "Settings · Bharat Buddy AI" }] }),
  component: SettingsPage,
});



function SettingsPage() {
  const qc = useQueryClient();
  const fetchProfile = useServerFn(getProfile);
  const updateFn = useServerFn(updateProfile);
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: () => fetchProfile() });

  const [fullName, setFullName] = useState("");
  const [language, setLanguage] = useState("English");
  const [voiceIn, setVoiceIn] = useState(true);
  const [voiceOut, setVoiceOut] = useState(true);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setFullName(profile.full_name ?? "");
    setLanguage(profile.preferred_language ?? "English");
    setVoiceIn(profile.voice_input);
    setVoiceOut(profile.voice_output);
    setDark(profile.dark_mode);
    applyTheme(profile.dark_mode);
  }, [profile]);

  const mutation = useMutation({
    mutationFn: () => updateFn({
      data: {
        full_name: fullName,
        preferred_language: language,
        voice_input: voiceIn,
        voice_output: voiceOut,
        dark_mode: dark,
      },
    }),
    onSuccess: () => {
      toast.success("Settings saved");
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  return (
    <div className="space-y-8">
      <PageHeader icon={SettingsIcon} title="Settings" description="Make Buddy yours." />

      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h3 className="font-display text-lg font-semibold">Profile</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Full name</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={profile?.email ?? ""} disabled />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h3 className="font-display text-lg font-semibold">Voice</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Language preference now lives in the dashboard sidebar — change it any time.
        </p>
        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between">
            <div><p className="font-medium">Voice input</p><p className="text-sm text-muted-foreground">Talk to Buddy instead of typing.</p></div>
            <Switch checked={voiceIn} onCheckedChange={setVoiceIn} />
          </div>
          <div className="flex items-center justify-between">
            <div><p className="font-medium">Voice output</p><p className="text-sm text-muted-foreground">Buddy reads answers out loud.</p></div>
            <Switch checked={voiceOut} onCheckedChange={setVoiceOut} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h3 className="font-display text-lg font-semibold">Appearance</h3>
        <div className="mt-5 flex items-center justify-between">
          <div><p className="font-medium">Dark mode</p><p className="text-sm text-muted-foreground">Easier on the eyes at night.</p></div>
          <Switch checked={dark} onCheckedChange={(v) => { setDark(v); applyTheme(v); }} />
        </div>
      </section>

      <div className="flex justify-end">
        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending} className="gradient-bg text-primary-foreground shadow-glow">
          {mutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</> : "Save changes"}
        </Button>
      </div>

      <FooterCopy />
    </div>
  );
}
