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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          access_token: string | null
          access_token_expires_at: string | null
          account_id: string
          created_at: string
          id: string
          id_token: string | null
          password: string | null
          provider_id: string
          refresh_token: string | null
          refresh_token_expires_at: string | null
          scope: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          access_token_expires_at?: string | null
          account_id: string
          created_at: string
          id: string
          id_token?: string | null
          password?: string | null
          provider_id: string
          refresh_token?: string | null
          refresh_token_expires_at?: string | null
          scope?: string | null
          updated_at: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          access_token_expires_at?: string | null
          account_id?: string
          created_at?: string
          id?: string
          id_token?: string | null
          password?: string | null
          provider_id?: string
          refresh_token?: string | null
          refresh_token_expires_at?: string | null
          scope?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_folders: {
        Row: {
          created_at: string
          folder_id: string
          id: string
          user_newsletter_id: string
        }
        Insert: {
          created_at: string
          folder_id: string
          id: string
          user_newsletter_id: string
        }
        Update: {
          created_at?: string
          folder_id?: string
          id?: string
          user_newsletter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "newsletter_folders_folder_id_user_folders_id_fk"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "user_folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "newsletter_folders_user_newsletter_id_user_newsletters_id_fk"
            columns: ["user_newsletter_id"]
            isOneToOne: false
            referencedRelation: "user_newsletters"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_sources: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          domain: string | null
          email: string
          id: string
          is_active: boolean
          is_featured: boolean
          is_verified: boolean
          last_newsletter_at: string | null
          logo_url: string | null
          name: string
          region: string
          subscribe_url: string | null
          subscriber_count: number | null
          total_newsletters: number | null
          update_count: number
          updated_at: string
          website: string | null
        }
        Insert: {
          category?: string | null
          created_at: string
          description?: string | null
          domain?: string | null
          email: string
          id: string
          is_active?: boolean
          is_featured?: boolean
          is_verified?: boolean
          last_newsletter_at?: string | null
          logo_url?: string | null
          name: string
          region?: string
          subscribe_url?: string | null
          subscriber_count?: number | null
          total_newsletters?: number | null
          update_count?: number
          updated_at: string
          website?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          domain?: string | null
          email?: string
          id?: string
          is_active?: boolean
          is_featured?: boolean
          is_verified?: boolean
          last_newsletter_at?: string | null
          logo_url?: string | null
          name?: string
          region?: string
          subscribe_url?: string | null
          subscriber_count?: number | null
          total_newsletters?: number | null
          update_count?: number
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      newsletters: {
        Row: {
          attachments: Json | null
          category: string | null
          created_at: string
          excerpt: string | null
          extracted_content: string | null
          headers: Json | null
          html_content: string | null
          id: string
          is_active: boolean
          message_id: string
          newsletter_hash: string
          original_url: string | null
          read_time_minutes: number | null
          received_at: string
          sender_email: string
          sender_name: string | null
          source_id: string
          subject: string
          summary: string | null
          tags: Json | null
          text_content: string | null
          thumbnail_url: string | null
          updated_at: string
        }
        Insert: {
          attachments?: Json | null
          category?: string | null
          created_at: string
          excerpt?: string | null
          extracted_content?: string | null
          headers?: Json | null
          html_content?: string | null
          id: string
          is_active?: boolean
          message_id: string
          newsletter_hash?: string
          original_url?: string | null
          read_time_minutes?: number | null
          received_at: string
          sender_email: string
          sender_name?: string | null
          source_id: string
          subject: string
          summary?: string | null
          tags?: Json | null
          text_content?: string | null
          thumbnail_url?: string | null
          updated_at: string
        }
        Update: {
          attachments?: Json | null
          category?: string | null
          created_at?: string
          excerpt?: string | null
          extracted_content?: string | null
          headers?: Json | null
          html_content?: string | null
          id?: string
          is_active?: boolean
          message_id?: string
          newsletter_hash?: string
          original_url?: string | null
          read_time_minutes?: number | null
          received_at?: string
          sender_email?: string
          sender_name?: string | null
          source_id?: string
          subject?: string
          summary?: string | null
          tags?: Json | null
          text_content?: string | null
          thumbnail_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "newsletters_source_id_newsletter_sources_id_fk"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "newsletter_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          ip_address: string | null
          token: string
          updated_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at: string
          expires_at: string
          id: string
          ip_address?: string | null
          token: string
          updated_at: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          ip_address?: string | null
          token?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          id: string
          period_end: string | null
          period_start: string | null
          plan: string
          polar_customer_id: string | null
          polar_subscription_id: string | null
          reference_id: string
          seats: number | null
          status: string | null
          trial_end: string | null
          trial_start: string | null
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          id: string
          period_end?: string | null
          period_start?: string | null
          plan: string
          polar_customer_id?: string | null
          polar_subscription_id?: string | null
          reference_id: string
          seats?: number | null
          status?: string | null
          trial_end?: string | null
          trial_start?: string | null
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          id?: string
          period_end?: string | null
          period_start?: string | null
          plan?: string
          polar_customer_id?: string | null
          polar_subscription_id?: string | null
          reference_id?: string
          seats?: number | null
          status?: string | null
          trial_end?: string | null
          trial_start?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_folders: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          sort_order: number | null
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at: string
          description?: string | null
          id: string
          name: string
          sort_order?: number | null
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          sort_order?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_folders_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_newsletter_sources: {
        Row: {
          id: string
          is_active: boolean
          is_paused: boolean
          is_subscribed: boolean
          preferences: Json | null
          source_id: string
          subscribed_at: string
          subscription_email: string | null
          unsubscribed_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          id: string
          is_active?: boolean
          is_paused?: boolean
          is_subscribed?: boolean
          preferences?: Json | null
          source_id: string
          subscribed_at: string
          subscription_email?: string | null
          unsubscribed_at?: string | null
          updated_at: string
          user_id: string
        }
        Update: {
          id?: string
          is_active?: boolean
          is_paused?: boolean
          is_subscribed?: boolean
          preferences?: Json | null
          source_id?: string
          subscribed_at?: string
          subscription_email?: string | null
          unsubscribed_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_newsletter_sources_source_id_newsletter_sources_id_fk"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "newsletter_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_newsletter_sources_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_newsletters: {
        Row: {
          archived_at: string | null
          bookmarked_at: string | null
          created_at: string
          id: string
          is_archived: boolean
          is_bookmarked: boolean
          is_read: boolean
          newsletter_id: string
          read_at: string | null
          user_id: string
        }
        Insert: {
          archived_at?: string | null
          bookmarked_at?: string | null
          created_at: string
          id: string
          is_archived?: boolean
          is_bookmarked?: boolean
          is_read?: boolean
          newsletter_id: string
          read_at?: string | null
          user_id: string
        }
        Update: {
          archived_at?: string | null
          bookmarked_at?: string | null
          created_at?: string
          id?: string
          is_archived?: boolean
          is_bookmarked?: boolean
          is_read?: boolean
          newsletter_id?: string
          read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_newsletters_newsletter_id_newsletters_id_fk"
            columns: ["newsletter_id"]
            isOneToOne: false
            referencedRelation: "newsletters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_newsletters_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string
          email_frequency: string | null
          id: string
          preferred_categories: Json | null
          reading_speed_wpm: number | null
          region: string
          settings: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at: string
          email_frequency?: string | null
          id: string
          preferred_categories?: Json | null
          reading_speed_wpm?: number | null
          region?: string
          settings?: Json | null
          updated_at: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_frequency?: string | null
          id?: string
          preferred_categories?: Json | null
          reading_speed_wpm?: number | null
          region?: string
          settings?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar: string | null
          avatar_url: string | null
          created_at: string
          email: string
          email_verified: boolean
          id: string
          image: string | null
          is_onboarded: boolean
          lettertree_email: string | null
          name: string
          polar_customer_id: string | null
          preferences: Json | null
          region: string | null
          updated_at: string
        }
        Insert: {
          avatar?: string | null
          avatar_url?: string | null
          created_at: string
          email: string
          email_verified: boolean
          id: string
          image?: string | null
          is_onboarded?: boolean
          lettertree_email?: string | null
          name: string
          polar_customer_id?: string | null
          preferences?: Json | null
          region?: string | null
          updated_at: string
        }
        Update: {
          avatar?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string
          email_verified?: boolean
          id?: string
          image?: string | null
          is_onboarded?: boolean
          lettertree_email?: string | null
          name?: string
          polar_customer_id?: string | null
          preferences?: Json | null
          region?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      verifications: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          identifier: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id: string
          identifier: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          identifier?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          converted_at: string | null
          created_at: string
          email: string
          id: string
          invited_at: string | null
          metadata: Json | null
          name: string | null
          source: string
          status: string
        }
        Insert: {
          converted_at?: string | null
          created_at: string
          email: string
          id: string
          invited_at?: string | null
          metadata?: Json | null
          name?: string | null
          source?: string
          status?: string
        }
        Update: {
          converted_at?: string | null
          created_at?: string
          email?: string
          id?: string
          invited_at?: string | null
          metadata?: Json | null
          name?: string | null
          source?: string
          status?: string
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
