
-- profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  preferred_language TEXT NOT NULL DEFAULT 'English',
  voice_input BOOLEAN NOT NULL DEFAULT true,
  voice_output BOOLEAN NOT NULL DEFAULT true,
  dark_mode BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile" ON public.profiles FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- updated_at trigger fn
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER profiles_updated BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- auto create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''), NEW.email);
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- documents
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  storage_path TEXT,
  mime_type TEXT,
  summary TEXT,
  action_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  important_dates JSONB NOT NULL DEFAULT '[]'::jsonb,
  language TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents TO authenticated;
GRANT ALL ON public.documents TO service_role;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own documents" ON public.documents FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- scam checks
CREATE TABLE public.scam_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  input_text TEXT NOT NULL,
  risk_score INT NOT NULL DEFAULT 0,
  verdict TEXT,
  indicators JSONB NOT NULL DEFAULT '[]'::jsonb,
  advice TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.scam_checks TO authenticated;
GRANT ALL ON public.scam_checks TO service_role;
ALTER TABLE public.scam_checks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own scams" ON public.scam_checks FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- career analyses
CREATE TABLE public.career_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  resume_name TEXT,
  skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  skill_gaps JSONB NOT NULL DEFAULT '[]'::jsonb,
  roadmap JSONB NOT NULL DEFAULT '[]'::jsonb,
  learning_links JSONB NOT NULL DEFAULT '[]'::jsonb,
  summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.career_analyses TO authenticated;
GRANT ALL ON public.career_analyses TO service_role;
ALTER TABLE public.career_analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own career" ON public.career_analyses FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- form lookups
CREATE TABLE public.form_lookups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  form_name TEXT NOT NULL,
  explanation TEXT,
  fields JSONB NOT NULL DEFAULT '[]'::jsonb,
  checklist JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.form_lookups TO authenticated;
GRANT ALL ON public.form_lookups TO service_role;
ALTER TABLE public.form_lookups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own forms" ON public.form_lookups FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- reminders
CREATE TABLE public.reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  due_date DATE NOT NULL,
  source TEXT,
  notes TEXT,
  done BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reminders TO authenticated;
GRANT ALL ON public.reminders TO service_role;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own reminders" ON public.reminders FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- usage events (for analytics)
CREATE TABLE public.usage_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  kind TEXT NOT NULL,
  language TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.usage_events TO authenticated;
GRANT ALL ON public.usage_events TO service_role;
ALTER TABLE public.usage_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own events" ON public.usage_events FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- storage policies for user-uploads bucket (bucket created via tool)
CREATE POLICY "users read own files" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "users insert own files" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "users delete own files" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
