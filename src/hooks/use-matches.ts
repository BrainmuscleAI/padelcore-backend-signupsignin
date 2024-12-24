import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from './use-toast';

interface Match {
  id: string;
  tournament_id: string;
  round: number;
  court: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  score: any;
  winner_id: string | null;
}

interface MatchPlayer {
  match_id: string;
  player_id: string;
  team: 1 | 2;
  position: 1 | 2;
}

export function useMatches() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchTournamentMatches = async (tournamentId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          match_players (
            player_id,
            team,
            position,
            profiles (
              username,
              full_name,
              rating
            )
          )
        `)
        .eq('tournament_id', tournamentId)
        .order('round', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Could not fetch matches',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateMatchScore = async (
    matchId: string,
    score: any,
    winnerId: string | null
  ) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('matches')
        .update({
          score,
          winner_id: winnerId,
          status: winnerId ? 'completed' : 'in_progress',
        })
        .eq('id', matchId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Match score updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Could not update match score',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMatch = (
    matchId: string,
    callback: (payload: any) => void
  ) => {
    const subscription = supabase
      .channel(`match:${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'matches',
          filter: `id=eq.${matchId}`,
        },
        callback
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  return {
    loading,
    fetchTournamentMatches,
    updateMatchScore,
    subscribeToMatch,
  };
}