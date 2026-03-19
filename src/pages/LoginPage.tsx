import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const LoginPage = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!email || !password) { 
    toast.error("Please enter your email and password"); 
    return; 
  }
  
  setIsLoading(true);
  
  try {
    const { error } = await signIn(email, password);
    
    if (error) {
      toast.error(error);
      setIsLoading(false);
      return;
    }
    
    // Wait for session to be established
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let attempts = 0;
    const maxAttempts = 10;
    
    const tryNavigate = async () => {
      attempts++;
      console.log(`[Login] Fetching user role... (attempt ${attempts}/${maxAttempts})`);
      
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("[Login] Error getting user:", userError);
          if (attempts < maxAttempts) {
            setTimeout(tryNavigate, 300);
          } else {
            toast.error("Session error. Please try again.");
            setIsLoading(false);
          }
          return;
        }
        
        if (!user) {
          console.error("[Login] No user found after login");
          if (attempts < maxAttempts) {
            setTimeout(tryNavigate, 300);
          } else {
            toast.error("User session not found. Please try again.");
            setIsLoading(false);
          }
          return;
        }
        
        console.log("[Login] User found:", user.email);
        
        const { data: roleData, error: roleError } = await supabase.rpc("get_user_role", { _user_id: user.id });
        
        if (roleError) {
          console.error("[Login] Error fetching role:", roleError);
          if (attempts < maxAttempts) {
            setTimeout(tryNavigate, 300);
          } else {
            toast.error("Could not fetch user role. Contact support.");
            setIsLoading(false);
          }
          return;
        }
        
        console.log("[Login] Role fetched:", roleData);
        
        if (roleData === "admin") { 
          console.log("[Login] Navigating to admin");
          navigate("/admin"); 
          return; 
        }
        else if (roleData === "vendor") { 
          console.log("[Login] Navigating to vendor");
          navigate("/vendor"); 
          return; 
        }
        else if (roleData === "cashier") { 
          console.log("[Login] Navigating to cashier");
          navigate("/cashier"); 
          return; 
        }
        
        // If we get here, role was not found
        console.warn("[Login] Unknown role:", roleData);
        if (attempts < maxAttempts) {
          setTimeout(tryNavigate, 300);
        } else {
          toast.error("Your account does not have a valid role assigned. Contact support.");
          setIsLoading(false);
        }
      } catch (err) {
        console.error("[Login] Unexpected error:", err);
        if (attempts < maxAttempts) {
          setTimeout(tryNavigate, 300);
        } else {
          toast.error("Unexpected error during login. Please try again.");
          setIsLoading(false);
        }
      }
    };
    
    tryNavigate();
  } catch (err) {
    console.error("[Login] Failed to sign in:", err);
    toast.error("Login failed. Please try again.");
    setIsLoading(false);
  }
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
        <div className="rounded-2xl border bg-card p-8 shadow-civic">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">PC</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">PALENG-CLICK</h1>
              <p className="text-sm text-muted-foreground">San Juan Public Market</p>
            </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 rounded-xl pr-12" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">Having trouble logging in? Contact the Municipal Treasurer's Office.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
