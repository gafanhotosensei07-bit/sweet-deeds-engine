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
      analytics_events: {
        Row: {
          amount: number | null
          created_at: string
          event_type: string
          id: string
          metadata: Json | null
          order_id: string | null
          product_name: string | null
          product_price: number | null
          session_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json | null
          order_id?: string | null
          product_name?: string | null
          product_price?: number | null
          session_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          order_id?: string | null
          product_name?: string | null
          product_price?: number | null
          session_id?: string | null
        }
        Relationships: []
      }
      gateway_settings: {
        Row: {
          api_token: string
          created_at: string
          gateway_name: string
          id: string
          is_active: boolean
          offer_hash: string
          product_id: string
          updated_at: string
        }
        Insert: {
          api_token?: string
          created_at?: string
          gateway_name: string
          id?: string
          is_active?: boolean
          offer_hash?: string
          product_id?: string
          updated_at?: string
        }
        Update: {
          api_token?: string
          created_at?: string
          gateway_name?: string
          id?: string
          is_active?: boolean
          offer_hash?: string
          product_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          customer_cpf: string | null
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          discount: number
          estimated_delivery: string | null
          id: string
          items: Json
          order_number: string
          payment_method: string | null
          payment_status: string | null
          pix_order_id: string | null
          session_id: string | null
          shipping_address: string | null
          shipping_cep: string | null
          shipping_city: string | null
          shipping_state: string | null
          status: string
          status_history: Json
          subtotal: number
          total: number
          tracking_code: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_cpf?: string | null
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          discount?: number
          estimated_delivery?: string | null
          id?: string
          items?: Json
          order_number?: string
          payment_method?: string | null
          payment_status?: string | null
          pix_order_id?: string | null
          session_id?: string | null
          shipping_address?: string | null
          shipping_cep?: string | null
          shipping_city?: string | null
          shipping_state?: string | null
          status?: string
          status_history?: Json
          subtotal?: number
          total?: number
          tracking_code?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_cpf?: string | null
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          discount?: number
          estimated_delivery?: string | null
          id?: string
          items?: Json
          order_number?: string
          payment_method?: string | null
          payment_status?: string | null
          pix_order_id?: string | null
          session_id?: string | null
          shipping_address?: string | null
          shipping_cep?: string | null
          shipping_city?: string | null
          shipping_state?: string | null
          status?: string
          status_history?: Json
          subtotal?: number
          total?: number
          tracking_code?: string | null
          updated_at?: string
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
