import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';
import { useAuth } from '@/lib/auth';
import { useToast } from './use-toast';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export function useProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id]);

  async function fetchProfile() {
    try {
      setLoading(true);
      if (!user?.id) return;

      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select()
        .eq('id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (!existingProfile) {
        // Create profile if it doesn't exist
        const newProfile = {
          id: user.id,
          username: user.email?.split('@')[0] || null,
          full_name: user.name || null,
          rating: 1000,
          matches_played: 0,
          wins: 0,
          losses: 0,
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .upsert([newProfile])
          .select()
          .single();

        if (createError) throw createError;
        setProfile(createdProfile);
      } else {
        setProfile(existingProfile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error',
        description: 'Could not load profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(updates: ProfileUpdate) {
    try {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from('profiles')
        .upsert([{ id: user.id, ...updates }])
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Could not update profile',
        variant: 'destructive',
      });
    }
  }

  return {
    profile,
    loading,
    updateProfile,
    refreshProfile: fetchProfile,
  };
}