
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  saveIndicatorData: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function signIn() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        }
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in:', error);
      toast({
        title: "Authentication Failed",
        description: "Could not sign in with Google. Please try again.",
        variant: "destructive",
      });
    }
  }

  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Sign Out Failed",
        description: "Could not sign out. Please try again.",
        variant: "destructive",
      });
    }
  }

  async function saveIndicatorData(indicatorData: any) {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save your progress.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('user_indicators')
        .upsert({
          user_id: user.id,
          indicator_data: indicatorData,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your progress has been saved.",
      });
    } catch (error) {
      console.error('Error saving data:', error);
      toast({
        title: "Save Failed",
        description: "Could not save your progress. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <AuthContext.Provider value={{ session, user, signIn, signOut, saveIndicatorData }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
