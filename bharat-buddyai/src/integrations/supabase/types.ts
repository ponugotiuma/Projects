export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      career_analyses: {
        Row: {
          created_at: string
          id: string
          learning_links: Json
          resume_name: string | null
          roadmap: Json
          skill_gaps: Json
          skills: Json
          summary: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          learning_links?: Json
          resume_name?: string | null
          roadmap?: Json
          skill_gaps?: Json
          skills?: Json
          summary?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          learning_links?: Json
          resume_name?: string | null
          roadmap?: Json
          skill_gaps?: Json
          skills?: Json
          summary?: string | null
          user_id?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          action_items: Json
          created_at: string
          file_name: string
          id: string
          important_dates: Json
          language: string | null
          mime_type: string | null
          storage_path: string | null
          summary: string | null
          user_id: string
        }
        Insert: {
          action_items?: Json
          created_at?: string
          file_name: string
          id?: string
          important_dates?: Json
          language?: string | null
          mime_type?: string | null
          storage_path?: string | null
          summary?: string | null
          user_id: string
        }
        Update: {
          action_items?: Json
          created_at?: string
          file_name?: string
          id?: string
          important_dates?: Json
          language?: string | null
          mime_type?: string | null
          storage_path?: string | null
          summary?: string | null
          user_id?: string
        }
        Relationships: []
      }
      form_lookups: {
        Row: {
          checklist: Json
          created_at: string
          explanation: string | null
          fields: Json
          form_name: string
          id: string
          user_id: string
        }
        Insert: {
          checklist?: Json
          created_at?: string
          explanation?: string | null
          fields?: Json
          form_name: string
          id?: string
          user_id: string
        }
        Update: {
          checklist?: Json
          created_at?: string
          explanation?: string | null
          fields?: Json
          form_name?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          dark_mode: boolean
          email: string | null
          full_name: string | null
          id: string
          preferred_language: string
          updated_at: string
          voice_input: boolean
          voice_output: boolean
        }
        Insert: {
          created_at?: string
          dark_mode?: boolean
          email?: string | null
          full_name?: string | null
          id: string
          preferred_language?: string
          updated_at?: string
          voice_input?: boolean
          voice_output?: boolean
        }
        Update: {
          created_at?: string
          dark_mode?: boolean
          email?: string | null
          full_name?: string | null
          id?: string
          preferred_language?: string
          updated_at?: string
          voice_input?: boolean
          voice_output?: boolean
        }
        Relationships: []
      }
      reminders: {
        Row: {
          created_at: string
          done: boolean
          due_date: string
          id: string
          notes: string | null
          source: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          done?: boolean
          due_date: string
          id?: string
          notes?: string | null
          source?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          done?: boolean
          due_date?: string
          id?: string
          notes?: string | null
          source?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      scam_checks: {
        Row: {
          advice: string | null
          created_at: string
          id: string
          indicators: Json
          input_text: string
          risk_score: number
          user_id: string
          verdict: string | null
        }
        Insert: {
          advice?: string | null
          created_at?: string
          id?: string
          indicators?: Json
          input_text: string
          risk_score?: number
          user_id: string
          verdict?: string | null
        }
        Update: {
          advice?: string | null
          created_at?: string
          id?: string
          indicators?: Json
          input_text?: string
          risk_score?: number
          user_id?: string
          verdict?: string | null
        }
        Relationships: []
      }
      usage_events: {
        Row: {
          created_at: string
          id: string
          kind: string
          language: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind: string
          language?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          language?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
