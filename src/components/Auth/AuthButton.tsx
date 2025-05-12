
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export function AuthButton() {
  const { user, signIn, signOut } = useAuth();
  
  return user ? (
    <Button variant="outline" onClick={() => signOut()}>
      Sign Out
    </Button>
  ) : (
    <Button onClick={() => signIn()}>
      Sign In with Google
    </Button>
  );
}
