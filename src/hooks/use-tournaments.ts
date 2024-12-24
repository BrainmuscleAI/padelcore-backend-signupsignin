import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from './use-toast';
import { useAuth } from '@/lib/auth';

interface Tournament {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  prize_pool: number;
  max_participants: number;
  status: 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled';
  rules: any;
  created_at: string;
  updated_at: string;
}

interface TournamentRegistration {
  id: string;
  tournament_id: string;
  player_id: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'waitlist';
  registration_date: string;
}

export function useTournaments() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Could not fetch tournaments',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createTournament = async (tournament: Omit<Tournament, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tournaments')
        .insert([tournament])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Tournament created successfully',
      });

      return data;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Could not create tournament',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerForTournament = async (tournamentId: string) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to register',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      
      // Check if already registered
      const { data: existing } = await supabase
        .from('tournament_registrations')
        .select('*')
        .eq('tournament_id', tournamentId)
        .eq('player_id', user.id)
        .single();

      if (existing) {
        toast({
          title: 'Error',
          description: 'You are already registered for this tournament',
          variant: 'destructive',
        });
        return;
      }

      // Check tournament capacity
      const { data: tournament } = await supabase
        .from('tournaments')
        .select('*, tournament_registrations(count)')
        .eq('id', tournamentId)
        .single();

      if (!tournament) throw new Error('Tournament not found');

      const registrationStatus = 
        tournament.tournament_registrations[0].count >= tournament.max_participants
          ? 'waitlist'
          : 'pending';

      const { data, error } = await supabase
        .from('tournament_registrations')
        .insert([{
          tournament_id: tournamentId,
          player_id: user.id,
          status: registrationStatus,
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: registrationStatus === 'waitlist'
          ? 'Added to waitlist successfully'
          : 'Registered successfully',
      });

      return data;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Could not register for tournament',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const cancelRegistration = async (tournamentId: string) => {
    if (!user) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('tournament_registrations')
        .update({ status: 'cancelled' })
        .eq('tournament_id', tournamentId)
        .eq('player_id', user.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Registration cancelled successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Could not cancel registration',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    fetchTournaments,
    createTournament,
    registerForTournament,
    cancelRegistration,
  };
}