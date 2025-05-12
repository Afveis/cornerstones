
import React from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';

export const LoginButton = () => {
  const { user, signInWithGoogle, signOut } = useAuth();

  return (
    user ? (
      <Button onClick={signOut} variant="outline">Sign Out</Button>
    ) : (
      <Button onClick={signInWithGoogle}>
        Sign in with Google
      </Button>
    )
  );
};
