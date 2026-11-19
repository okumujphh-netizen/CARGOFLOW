
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function ProtectedRoute({ children, allowedRole }) {
  const [status, setStatus] = useState("loading");
  const [role, setRole] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function checkAccess() {
      setStatus("loading");
      setError("");

      const { data: { session }, error: sessionError } =
        await supabase.auth.getSession();

      if (!mounted) return;

      if (sessionError) {
        setError(sessionError.message);
        setStatus("error");
        return;
      }

      if (!session) {
        setStatus("unauthenticated");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (!mounted) return;

      if (profileError || !profile) {
        setError(profileError?.message || "Profile not found.");
        setStatus("error");
        return;
      }

      setRole(profile.role);
      setStatus("authenticated");
    }

    checkAccess();

    return () => {
      mounted = false;
    };
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Checking authentication...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            Unable to verify your account: {error}
          </p>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/login";
            }}
            className="bg-teal-600 text-white px-5 py-2 rounded-lg"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  if (role !== allowedRole) {
    return (
      <Navigate
        to={role === "admin" ? "/admin" : "/dashboard"}
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;

