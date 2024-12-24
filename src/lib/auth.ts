import { createContext, useContext } from 'react';

export type UserRole = 'player' | 'admin' | 'sponsor';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profile?: {
    username: string;
    full_name: string;
    avatar_url: string | null;
    rating: number;
  };
}

export interface SignUpData {
  email: string;
  password: string;
  username: string;
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<{ error?: Error }>;
  signUp: (data: SignUpData) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper function to determine user role
export async function getUserRole(email: string): Promise<UserRole> {
  // TODO: Implement role lookup from database
  // For now, use email domain for demo
  if (email.includes('admin')) return 'admin';
  if (email.includes('sponsor')) return 'sponsor';
  return 'player';
}