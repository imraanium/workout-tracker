export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; email: string | null; created_at: string };
        Insert: { id: string; email?: string | null; created_at?: string };
        Update: { email?: string | null }; Relationships: [];
      };
      templates: {
        Row: { id: string; user_id: string; name: string; description: string | null; type: 'strength' | 'running'; target_day: number | null; created_at: string };
        Insert: { id?: string; user_id: string; name: string; description?: string | null; type: 'strength' | 'running'; target_day?: number | null };
        Update: { name?: string; description?: string | null; type?: 'strength' | 'running'; target_day?: number | null }; Relationships: [];
      };
      template_exercises: {
        Row: { id: string; template_id: string; exercise_name: string; order_index: number; target_sets: number; target_reps: string; target_weight: number | null; rest_seconds: number | null };
        Insert: { id?: string; template_id: string; exercise_name: string; order_index: number; target_sets: number; target_reps: string; target_weight?: number | null; rest_seconds?: number | null };
        Update: Partial<Omit<Database['public']['Tables']['template_exercises']['Row'], 'id' | 'template_id'>>; Relationships: [];
      };
      workouts: {
        Row: { id: string; user_id: string; template_id: string | null; name: string; type: 'strength' | 'running'; logged_at: string };
        Insert: { id?: string; user_id: string; template_id?: string | null; name: string; type: 'strength' | 'running'; logged_at?: string };
        Update: Partial<Omit<Database['public']['Tables']['workouts']['Row'], 'id' | 'user_id'>>; Relationships: [];
      };
      workout_exercises: {
        Row: { id: string; workout_id: string; exercise_name: string; target_reps: string; order_index: number };
        Insert: { id?: string; workout_id: string; exercise_name: string; target_reps: string; order_index: number };
        Update: Partial<Omit<Database['public']['Tables']['workout_exercises']['Row'], 'id' | 'workout_id'>>; Relationships: [];
      };
      sets: {
        Row: { id: string; workout_exercise_id: string; set_number: number; weight: number | null; reps: number | null; is_completed: boolean };
        Insert: { id?: string; workout_exercise_id: string; set_number: number; weight?: number | null; reps?: number | null; is_completed?: boolean };
        Update: Partial<Omit<Database['public']['Tables']['sets']['Row'], 'id' | 'workout_exercise_id'>>; Relationships: [];
      };
      warmup_references: {
        Row: { id: string; title: string; description: string; category: string };
        Insert: { id?: string; title: string; description: string; category: string };
        Update: Partial<Omit<Database['public']['Tables']['warmup_references']['Row'], 'id'>>; Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { workout_type: 'strength' | 'running' };
    CompositeTypes: { [_ in never]: never };
  };
}
