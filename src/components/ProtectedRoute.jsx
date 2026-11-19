
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function ProtectedRoute({ children, allowedRole }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check whether the user has an active session
  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setSession(data.session);
    }

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Retrieve the authenticated user's role
  useEffect(() => {
    let mounted = true;

    async function getProfile() {
      if (!session) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (!mounted) return;

      if (error) {
        setError(error.message);
        setProfile(null);
      } else {
        setProfile(data);
      }

      setLoading(false);
    }

    getProfile();

    return () => {
      mounted = false;
    };
  }, [session]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Checking authentication...</p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            Unable to verify your account: {error}
          </p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="bg-teal-600 text-white px-5 py-2 rounded-lg"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  if (profile.role !== allowedRole) {
    return (
      <Navigate
        to={profile.role === "admin" ? "/admin" : "/dashboard"}
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;
