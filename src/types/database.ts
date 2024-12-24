export interface Database {
  public: {
    Tables: {
      tournaments: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          start_date: string;
          end_date: string;
          location: string;
          prize_pool: number;
          max_participants: number;
          status: string;
          rules: Json | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          start_date: string;
          end_date: string;
          location: string;
          prize_pool?: number;
          max_participants: number;
          status?: string;
          rules?: Json | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          start_date?: string;
          end_date?: string;
          location?: string;
          prize_pool?: number;
          max_participants?: number;
          status?: string;
          rules?: Json | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
      };
      tournament_registrations: {
        Row: {
          id: string;
          tournament_id: string;
          player_id: string;
          status: string;
          registration_date: string;
        };
        Insert: {
          id?: string;
          tournament_id: string;
          player_id: string;
          status?: string;
          registration_date?: string;
        };
        Update: {
          id?: string;
          tournament_id?: string;
          player_id?: string;
          status?: string;
          registration_date?: string;
        };
      };
      matches: {
        Row: {
          id: string;
          tournament_id: string;
          round: number;
          court: string | null;
          start_time: string | null;
          end_time: string | null;
          status: string;
          score: Json | null;
          winner_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tournament_id: string;
          round: number;
          court?: string | null;
          start_time?: string | null;
          end_time?: string | null;
          status?: string;
          score?: Json | null;
          winner_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tournament_id?: string;
          round?: number;
          court?: string | null;
          start_time?: string | null;
          end_time?: string | null;
          status?: string;
          score?: Json | null;
          winner_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      match_players: {
        Row: {
          match_id: string;
          player_id: string;
          team: number;
          position: number;
        };
        Insert: {
          match_id: string;
          player_id: string;
          team: number;
          position: number;
        };
        Update: {
          match_id?: string;
          player_id?: string;
          team?: number;
          position?: number;
        };
      };
      profiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          rating: number;
          matches_played: number;
          wins: number;
          losses: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          rating?: number;
          matches_played?: number;
          wins?: number;
          losses?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          rating?: number;
          matches_played?: number;
          wins?: number;
          losses?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}