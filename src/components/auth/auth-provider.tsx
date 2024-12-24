import { useEffect, useState } from 'react';
import { AuthContext, type User, type SignUpData, getUserRole } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/lib/routes';

const DASHBOARD_ROUTES = {
  admin: ROUTES.ADMIN_DASHBOARD,
  sponsor: ROUTES.SPONSOR_DASHBOARD,
  player: ROUTES.PLAYER_DASHBOARD,
} as const;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        updateUserState(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        updateUserState(session.user);
      } else {
        setUser(null);
        localStorage.removeItem('user');
        navigate(ROUTES.HOME);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const updateUserState = async (authUser: any, redirectToDashboard = true) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, full_name, avatar_url, rating')
        .eq('id', authUser.id)
        .single();

      if (!profile) {
        throw new Error('Profile not found');
      }

      const role = await getUserRole(authUser.email);
      const userData: User = {
        id: authUser.id,
        email: authUser.email,
        name: profile.full_name || profile.username,
        role,
        profile,
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión exitosamente.",
      });
      
      if (redirectToDashboard) {
        navigate(DASHBOARD_ROUTES[role]);
      }
    } catch (error) {
      console.error('Error updating user state:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar el perfil del usuario",
        variant: "destructive",
      });
      await logout();
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await updateUserState(data.user);
      }

      return {};
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: "Error",
        description: "Credenciales inválidas. Por favor intenta de nuevo.",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signUp = async (data: SignUpData) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
            full_name: data.fullName,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Cuenta Creada",
        description: "Tu cuenta ha sido creada exitosamente.",
      });

      // Sign in automatically after successful sign up
      await signIn(data.email, data.password);
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: "Sesión Cerrada",
      description: "Has cerrado sesión exitosamente.",
    });
    navigate(ROUTES.HOME);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}