export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      workouts: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          exercise: string;
          sets: number;
          reps: number;
          weight: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          exercise: string;
          sets: number;
          reps: number;
          weight: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          exercise?: string;
          sets?: number;
          reps?: number;
          weight?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      metrics: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          weight: number | null;
          body_fat: number | null;
          photo_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          weight?: number | null;
          body_fat?: number | null;
          photo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          weight?: number | null;
          body_fat?: number | null;
          photo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      workout_templates: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          exercises: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          exercises: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          exercises?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      exercises: {
        Row: {
          id: string;
          name: string;
          category: string;
          description: string | null;
          target_muscle_groups: string[] | null;
          is_preset: boolean;
          user_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          description?: string | null;
          target_muscle_groups?: string[] | null;
          is_preset?: boolean;
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          description?: string | null;
          target_muscle_groups?: string[] | null;
          is_preset?: boolean;
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type Workout = Database['public']['Tables']['workouts']['Row'];
export type WorkoutInsert = Database['public']['Tables']['workouts']['Insert'];
export type WorkoutUpdate = Database['public']['Tables']['workouts']['Update'];

export type Metric = Database['public']['Tables']['metrics']['Row'];
export type MetricInsert = Database['public']['Tables']['metrics']['Insert'];
export type MetricUpdate = Database['public']['Tables']['metrics']['Update'];

export type WorkoutTemplate =
  Database['public']['Tables']['workout_templates']['Row'];
export type WorkoutTemplateInsert =
  Database['public']['Tables']['workout_templates']['Insert'];
export type WorkoutTemplateUpdate =
  Database['public']['Tables']['workout_templates']['Update'];

export type Exercise = Database['public']['Tables']['exercises']['Row'];
export type ExerciseInsert =
  Database['public']['Tables']['exercises']['Insert'];
export type ExerciseUpdate =
  Database['public']['Tables']['exercises']['Update'];

export interface TemplateExercise {
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
  notes?: string | null;
}
