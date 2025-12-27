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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_roles: {
        Row: {
          created_at: string
          created_by: string | null
          role: Database["public"]["Enums"]["admin_role_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          role: Database["public"]["Enums"]["admin_role_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          role?: Database["public"]["Enums"]["admin_role_type"]
          user_id?: string
        }
        Relationships: []
      }
      contact_methods: {
        Row: {
          contact_identifier: string
          created_at: string
          for_scheduled: boolean
          for_spontaneous: boolean
          id: string
          label: string | null
          scheduled_priority: number | null
          service_type: string
          spontaneous_priority: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          contact_identifier: string
          created_at?: string
          for_scheduled?: boolean
          for_spontaneous?: boolean
          id?: string
          label?: string | null
          scheduled_priority?: number | null
          service_type: string
          spontaneous_priority?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          contact_identifier?: string
          created_at?: string
          for_scheduled?: boolean
          for_spontaneous?: boolean
          id?: string
          label?: string | null
          scheduled_priority?: number | null
          service_type?: string
          spontaneous_priority?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_methods_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      dispatch_access_requests: {
        Row: {
          accessed_at: string | null
          case_number: string | null
          created_at: string
          data_returned_at: string | null
          denial_reason: string | null
          dispatch_account_id: string
          door_key_tree_data: Json | null
          emergency_description: string | null
          emergency_scenario: string
          expires_at: string | null
          id: string
          ip_address: unknown
          is_life_threatening: boolean
          key_holders_returned: number | null
          legal_basis: Database["public"]["Enums"]["dispatch_legal_basis"]
          naybor_notification_method: string | null
          naybor_notification_sent_at: string | null
          naybors_notified: string[] | null
          probable_cause_description: string | null
          request_id: string
          requesting_officer_badge: string | null
          requesting_officer_name: string
          resident_user_id: string
          response_at: string | null
          response_method: string | null
          status: Database["public"]["Enums"]["dispatch_access_status"]
          target_address: string
          target_unit_number: string | null
          user_agent: string | null
          warrant_expires_at: string | null
          warrant_issued_at: string | null
          warrant_issuing_judge: string | null
          warrant_number: string | null
        }
        Insert: {
          accessed_at?: string | null
          case_number?: string | null
          created_at?: string
          data_returned_at?: string | null
          denial_reason?: string | null
          dispatch_account_id: string
          door_key_tree_data?: Json | null
          emergency_description?: string | null
          emergency_scenario: string
          expires_at?: string | null
          id?: string
          ip_address?: unknown
          is_life_threatening?: boolean
          key_holders_returned?: number | null
          legal_basis: Database["public"]["Enums"]["dispatch_legal_basis"]
          naybor_notification_method?: string | null
          naybor_notification_sent_at?: string | null
          naybors_notified?: string[] | null
          probable_cause_description?: string | null
          request_id?: string
          requesting_officer_badge?: string | null
          requesting_officer_name: string
          resident_user_id: string
          response_at?: string | null
          response_method?: string | null
          status?: Database["public"]["Enums"]["dispatch_access_status"]
          target_address: string
          target_unit_number?: string | null
          user_agent?: string | null
          warrant_expires_at?: string | null
          warrant_issued_at?: string | null
          warrant_issuing_judge?: string | null
          warrant_number?: string | null
        }
        Update: {
          accessed_at?: string | null
          case_number?: string | null
          created_at?: string
          data_returned_at?: string | null
          denial_reason?: string | null
          dispatch_account_id?: string
          door_key_tree_data?: Json | null
          emergency_description?: string | null
          emergency_scenario?: string
          expires_at?: string | null
          id?: string
          ip_address?: unknown
          is_life_threatening?: boolean
          key_holders_returned?: number | null
          legal_basis?: Database["public"]["Enums"]["dispatch_legal_basis"]
          naybor_notification_method?: string | null
          naybor_notification_sent_at?: string | null
          naybors_notified?: string[] | null
          probable_cause_description?: string | null
          request_id?: string
          requesting_officer_badge?: string | null
          requesting_officer_name?: string
          resident_user_id?: string
          response_at?: string | null
          response_method?: string | null
          status?: Database["public"]["Enums"]["dispatch_access_status"]
          target_address?: string
          target_unit_number?: string | null
          user_agent?: string | null
          warrant_expires_at?: string | null
          warrant_issued_at?: string | null
          warrant_issuing_judge?: string | null
          warrant_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dispatch_access_requests_dispatch_account_id_fkey"
            columns: ["dispatch_account_id"]
            isOneToOne: false
            referencedRelation: "emergency_dispatch_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      emergency_dispatch_accounts: {
        Row: {
          api_key_created_at: string | null
          api_key_hash: string | null
          api_key_last_four: string | null
          api_key_last_used_at: string | null
          api_rate_limit: number | null
          created_at: string
          dispatch_center_address: string | null
          dispatch_center_phone: string | null
          id: string
          insurance_carrier: string
          insurance_policy_number: string
          is_active: boolean
          jurisdictions: string[]
          organization_code: string | null
          organization_name: string
          organization_type: Database["public"]["Enums"]["dispatch_organization_type"]
          password_hash: string
          primary_contact_email: string
          primary_contact_name: string
          primary_contact_phone: string
          registered_agent_contact: string
          registered_agent_name: string
          rejection_reason: string | null
          suspended_at: string | null
          suspended_by: string | null
          suspended_reason: string | null
          tax_id: string
          updated_at: string
          verification_notes: string | null
          verification_status: Database["public"]["Enums"]["dispatch_verification_status"]
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          api_key_created_at?: string | null
          api_key_hash?: string | null
          api_key_last_four?: string | null
          api_key_last_used_at?: string | null
          api_rate_limit?: number | null
          created_at?: string
          dispatch_center_address?: string | null
          dispatch_center_phone?: string | null
          id?: string
          insurance_carrier: string
          insurance_policy_number: string
          is_active?: boolean
          jurisdictions?: string[]
          organization_code?: string | null
          organization_name: string
          organization_type: Database["public"]["Enums"]["dispatch_organization_type"]
          password_hash: string
          primary_contact_email: string
          primary_contact_name: string
          primary_contact_phone: string
          registered_agent_contact: string
          registered_agent_name: string
          rejection_reason?: string | null
          suspended_at?: string | null
          suspended_by?: string | null
          suspended_reason?: string | null
          tax_id: string
          updated_at?: string
          verification_notes?: string | null
          verification_status?: Database["public"]["Enums"]["dispatch_verification_status"]
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          api_key_created_at?: string | null
          api_key_hash?: string | null
          api_key_last_four?: string | null
          api_key_last_used_at?: string | null
          api_rate_limit?: number | null
          created_at?: string
          dispatch_center_address?: string | null
          dispatch_center_phone?: string | null
          id?: string
          insurance_carrier?: string
          insurance_policy_number?: string
          is_active?: boolean
          jurisdictions?: string[]
          organization_code?: string | null
          organization_name?: string
          organization_type?: Database["public"]["Enums"]["dispatch_organization_type"]
          password_hash?: string
          primary_contact_email?: string
          primary_contact_name?: string
          primary_contact_phone?: string
          registered_agent_contact?: string
          registered_agent_name?: string
          rejection_reason?: string | null
          suspended_at?: string | null
          suspended_by?: string | null
          suspended_reason?: string | null
          tax_id?: string
          updated_at?: string
          verification_notes?: string | null
          verification_status?: Database["public"]["Enums"]["dispatch_verification_status"]
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      friend_connections: {
        Row: {
          circle_tier: Database["public"]["Enums"]["circle_tier"]
          confirmed_at: string | null
          created_at: string
          disclose_circle: boolean
          id: string
          matched_contact_method_id: string | null
          requester_id: string
          status: Database["public"]["Enums"]["connection_status"]
          target_circle_tier: Database["public"]["Enums"]["circle_tier"] | null
          target_user_id: string
          updated_at: string
        }
        Insert: {
          circle_tier: Database["public"]["Enums"]["circle_tier"]
          confirmed_at?: string | null
          created_at?: string
          disclose_circle?: boolean
          id?: string
          matched_contact_method_id?: string | null
          requester_id: string
          status?: Database["public"]["Enums"]["connection_status"]
          target_circle_tier?: Database["public"]["Enums"]["circle_tier"] | null
          target_user_id: string
          updated_at?: string
        }
        Update: {
          circle_tier?: Database["public"]["Enums"]["circle_tier"]
          confirmed_at?: string | null
          created_at?: string
          disclose_circle?: boolean
          id?: string
          matched_contact_method_id?: string | null
          requester_id?: string
          status?: Database["public"]["Enums"]["connection_status"]
          target_circle_tier?: Database["public"]["Enums"]["circle_tier"] | null
          target_user_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "friend_connections_matched_contact_method_id_fkey"
            columns: ["matched_contact_method_id"]
            isOneToOne: false
            referencedRelation: "contact_methods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friend_connections_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "friend_connections_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      friend_lists: {
        Row: {
          created_at: string
          friends: Json
          id: string
          last_tended_at: string | null
          reserved_spots: Json
          role_models: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          friends?: Json
          id?: string
          last_tended_at?: string | null
          reserved_spots?: Json
          role_models?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          friends?: Json
          id?: string
          last_tended_at?: string | null
          reserved_spots?: Json
          role_models?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      parasocial_engagements: {
        Row: {
          clicked_at: string
          id: string
          share_id: string
          user_id: string
        }
        Insert: {
          clicked_at?: string
          id?: string
          share_id: string
          user_id: string
        }
        Update: {
          clicked_at?: string
          id?: string
          share_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "parasocial_engagements_share_id_fkey"
            columns: ["share_id"]
            isOneToOne: false
            referencedRelation: "parasocial_shares"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parasocial_engagements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      parasocial_follows: {
        Row: {
          created_at: string
          follower_id: string
          id: string
          parasocial_id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          id?: string
          parasocial_id: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          id?: string
          parasocial_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "parasocial_follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "parasocial_follows_parasocial_id_fkey"
            columns: ["parasocial_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      parasocial_shares: {
        Row: {
          created_at: string
          creator_id: string
          description: string | null
          expires_at: string | null
          id: string
          is_active: boolean
          title: string
          url: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          title: string
          url: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          title?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "parasocial_shares_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      post_interactions: {
        Row: {
          content: string | null
          created_at: string
          id: string
          interaction_type: Database["public"]["Enums"]["interaction_type"]
          post_id: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          interaction_type: Database["public"]["Enums"]["interaction_type"]
          post_id: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          interaction_type?: Database["public"]["Enums"]["interaction_type"]
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_interactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string
          content: string
          content_type: Database["public"]["Enums"]["post_content_type"]
          created_at: string
          id: string
          is_sponsored: boolean
          is_suggested: boolean
          location_lat: number | null
          location_lng: number | null
          location_name: string | null
          media_url: string | null
          scheduled_at: string | null
          updated_at: string
          visibility: Database["public"]["Enums"]["circle_tier"][]
        }
        Insert: {
          author_id: string
          content: string
          content_type: Database["public"]["Enums"]["post_content_type"]
          created_at?: string
          id?: string
          is_sponsored?: boolean
          is_suggested?: boolean
          location_lat?: number | null
          location_lng?: number | null
          location_name?: string | null
          media_url?: string | null
          scheduled_at?: string | null
          updated_at?: string
          visibility?: Database["public"]["Enums"]["circle_tier"][]
        }
        Update: {
          author_id?: string
          content?: string
          content_type?: Database["public"]["Enums"]["post_content_type"]
          created_at?: string
          id?: string
          is_sponsored?: boolean
          is_suggested?: boolean
          location_lat?: number | null
          location_lng?: number | null
          location_name?: string | null
          media_url?: string | null
          scheduled_at?: string | null
          updated_at?: string
          visibility?: Database["public"]["Enums"]["circle_tier"][]
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          contact_setup_complete: boolean
          created_at: string
          display_name: string | null
          id: string
          is_parasocial_personality: boolean
          is_public: boolean
          updated_at: string
          user_handle: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          contact_setup_complete?: boolean
          created_at?: string
          display_name?: string | null
          id?: string
          is_parasocial_personality?: boolean
          is_public?: boolean
          updated_at?: string
          user_handle?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          contact_setup_complete?: boolean
          created_at?: string
          display_name?: string | null
          id?: string
          is_parasocial_personality?: boolean
          is_public?: boolean
          updated_at?: string
          user_handle?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_visible_posts_for_user: {
        Args: { target_user_id: string }
        Returns: {
          author_avatar_url: string
          author_display_name: string
          author_id: string
          author_user_handle: string
          content: string
          content_type: Database["public"]["Enums"]["post_content_type"]
          created_at: string
          id: string
          is_sponsored: boolean
          is_suggested: boolean
          location_lat: number
          location_lng: number
          location_name: string
          media_url: string
          scheduled_at: string
          updated_at: string
          visibility: Database["public"]["Enums"]["circle_tier"][]
        }[]
      }
      has_confirmed_connection: {
        Args: { user1_id: string; user2_id: string }
        Returns: boolean
      }
      is_admin: { Args: { check_user_id?: string }; Returns: boolean }
      is_dispatch_verifier: {
        Args: { check_user_id?: string }
        Returns: boolean
      }
      is_handle_appropriate: { Args: { handle: string }; Returns: boolean }
    }
    Enums: {
      admin_role_type: "super_admin" | "dispatch_verifier"
      circle_tier: "core" | "inner" | "outer"
      connection_status: "pending" | "confirmed" | "declined"
      dispatch_access_status: "pending" | "approved" | "denied" | "expired"
      dispatch_legal_basis:
        | "consent"
        | "exigent_circumstances"
        | "court_order"
        | "welfare_check"
      dispatch_organization_type:
        | "police"
        | "fire"
        | "ems"
        | "combined"
        | "private_ems"
        | "hospital"
        | "crisis_center"
      dispatch_verification_status:
        | "pending"
        | "verified"
        | "rejected"
        | "suspended"
      interaction_type:
        | "like"
        | "comment"
        | "voice_reply"
        | "call_accepted"
        | "meetup_rsvp"
        | "share"
      post_content_type:
        | "text"
        | "photo"
        | "voice_note"
        | "video"
        | "call_invite"
        | "meetup_invite"
        | "proximity_ping"
        | "life_update"
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
    Enums: {
      admin_role_type: ["super_admin", "dispatch_verifier"],
      circle_tier: ["core", "inner", "outer"],
      connection_status: ["pending", "confirmed", "declined"],
      dispatch_access_status: ["pending", "approved", "denied", "expired"],
      dispatch_legal_basis: [
        "consent",
        "exigent_circumstances",
        "court_order",
        "welfare_check",
      ],
      dispatch_organization_type: [
        "police",
        "fire",
        "ems",
        "combined",
        "private_ems",
        "hospital",
        "crisis_center",
      ],
      dispatch_verification_status: [
        "pending",
        "verified",
        "rejected",
        "suspended",
      ],
      interaction_type: [
        "like",
        "comment",
        "voice_reply",
        "call_accepted",
        "meetup_rsvp",
        "share",
      ],
      post_content_type: [
        "text",
        "photo",
        "voice_note",
        "video",
        "call_invite",
        "meetup_invite",
        "proximity_ping",
        "life_update",
      ],
    },
  },
} as const
