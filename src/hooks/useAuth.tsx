import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AppRole = "admin" | "cashier" | "vendor";

interface Profile {
  first_name: string;
  last_name: string;
  middle_name?: string;
  contact_number?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: AppRole | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch role and profile safely
  const fetchRoleAndProfile = async (userId: string) => {
    try {
      // Get role from user_roles table
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .single();
      if (roleError) throw roleError;
      setRole((roleData?.role as AppRole) || null);

      // Get profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("first_name, last_name, middle_name, contact_number")
        .eq("user_id", userId)
        .single();
      if (profileError) {
        console.warn("[useAuth] Profile fetch warning:", profileError.message);
        return; // Profile might not exist yet
      }
      if (profileData) setProfile(profileData);
    } catch (error) {
      console.error("[useAuth] Error fetching role/profile:", error);
      setRole(null);
      setProfile(null);
    }
  };

  useEffect(() => {
    let mounted = true; // Fixes race conditions in Strict Mode

    const initAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!mounted) return;

        setSession(currentSession ?? null);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          await fetchRoleAndProfile(currentSession.user.id);
        }
      } catch (error) {
        console.error("[useAuth] Error getting session:", error);
        setSession(null);
        setUser(null);
        setRole(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, sess) => {
      if (!mounted) return;
      setSession(sess ?? null);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        await fetchRoleAndProfile(sess.user.id);
      } else {
        setRole(null);
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log("[useAuth] 🔐 signIn called with email:", email);
      console.log("[useAuth] ⏳ About to call supabase.auth.signInWithPassword...");
      
      const startTime = performance.now();
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      const endTime = performance.now();
      
      console.log(`[useAuth] ✅ signInWithPassword returned after ${(endTime - startTime).toFixed(2)}ms`);
      console.log("[useAuth] Response error:", error);
      console.log("[useAuth] Response data.user:", data.user);
      
      if (error) {
        console.error("[useAuth] ❌ Auth error:", error.message);
        return { error: error.message };
      }
      
      if (data.user) {
        console.log("[useAuth] 📝 Fetching role and profile for user:", data.user.id);
        await fetchRoleAndProfile(data.user.id);
      }
      
      console.log("[useAuth] ✅ signIn completed successfully");
      return { error: null };
    } catch (err) {
      console.error("[useAuth] ❌ signIn caught exception:", err);
      return { error: err instanceof Error ? err.message : "Sign in failed" };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRole(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, role, profile, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
