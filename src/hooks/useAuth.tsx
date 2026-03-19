import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

// Derive types directly from the generated DB schema — always in sync
type UserRoleRow = Database["public"]["Tables"]["user_roles"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

interface Profile {
  first_name: string;
  last_name: string;
  middle_name?: string | null;
  contact_number?: string | null;
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

  const fetchRoleAndProfile = async (userId: string) => {
    try {
      console.log("[useAuth] 🔵 fetchRoleAndProfile called for userId:", userId);

      // Select * so Supabase can infer the full Row type — avoids SelectQueryError
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle<UserRoleRow>();

      if (roleError) {
        console.warn("[useAuth] ⚠️ user_roles query error:", roleError.message, "| code:", roleError.code);
        setRole(null);
      } else {
        console.log("[useAuth] ✅ Role fetched:", roleData?.role ?? "none");
        setRole(roleData?.role ?? null);
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle<ProfileRow>();

      if (profileError) {
        console.warn("[useAuth] Profile fetch warning:", profileError.message);
      } else if (profileData) {
        setProfile({
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          middle_name: profileData.middle_name,
          contact_number: profileData.contact_number,
        });
      }
    } catch (error) {
      console.error("[useAuth] Error fetching role/profile:", error);
      setRole(null);
      setProfile(null);
    }
  };

  useEffect(() => {
    let mounted = true;

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
        if (mounted) setLoading(false);
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