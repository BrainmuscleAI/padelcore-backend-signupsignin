import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from './use-toast';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/lib/routes';

export function useSignUp() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const signUp = async ({
    email,
    password,
    username,
    fullName,
  }: {
    email: string;
    password: string;
    username: string;
    fullName: string;
  }) => {
    try {
      setLoading(true);
      
      // First check if username is available
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('username')
        .ilike('username', username)
        .maybeSingle();

      if (checkError) throw checkError;
      if (existingUser) {
        throw new Error('username already exists');
      }

      // Sign up with shorter timeout
      const { data, error } = await supabase.auth.signUp(
        {
          email,
          password,
          options: {
            data: {
              username: username.toLowerCase(),
              full_name: fullName,
            },
          },
        }
      );

      if (error) throw error;

      // Wait for profile creation with retries
      let retries = 0;
      const maxRetries = 3;
      let profile = null;
      
      while (retries < maxRetries && !profile) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user?.id)
          .maybeSingle();
        
        if (!profileError && profileData) {
          profile = profileData;
          break;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        retries++;
      }

      if (!profile) {
        throw new Error('Error al crear el perfil. Por favor intenta de nuevo.');
      }

      toast({
        title: "Cuenta Creada",
        description: "Tu cuenta ha sido creada exitosamente.",
      });

      navigate(ROUTES.DASHBOARD);
      return data;
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    signUp,
    loading,
  };
}