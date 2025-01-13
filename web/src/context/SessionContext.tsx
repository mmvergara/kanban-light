import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../supabase";
import LoadingPage from "../components/LoadingFallback";
import { Session } from "@supabase/supabase-js";

const SessionContext = createContext<{
  session: Session | null;
  user: Session["user"] | undefined;
}>({
  session: null,
  user: undefined,
});

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

type Props = { children: React.ReactNode };
export const SessionProvider = ({ children }: Props) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authStateListener = supabase.auth.onAuthStateChange(
      async (_, session) => {
        setSession(session);
        setIsLoading(false);
      }
    );

    return () => {
      authStateListener.data.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <SessionContext.Provider value={{ session, user: session?.user }}>
      <LoadingPage hidden={isLoading}>{!isLoading && children}</LoadingPage>
    </SessionContext.Provider>
  );
};
