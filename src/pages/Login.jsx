

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Ship, Eye, EyeOff } from "lucide-react";
import { supabase } from "../lib/supabase";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    // Authenticate user with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      setError(error.message);
      return;
    }

    // Retrieve user's role from the profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profileError || !profile) {
      console.error("Profile retrieval error:", profileError);

      await supabase.auth.signOut();

      setLoading(false);

      setError(
        profileError
          ? profileError.message
          : "No profile was found for this account."
      );

      return;
    }

    setLoading(false);

    // Redirect according to account role
    console.log("Login successful");
    console.log("User ID:", data.user.id);
    console.log("User role:", profile.role);

    if (profile.role === "admin") {
      console.log("Redirecting to admin dashboard");
      navigate("/admin", { replace: true });
    } else {
      console.log("Redirecting to customer dashboard");
      navigate("/dashboard", { replace: true });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-10">
          <Ship size={30} className="text-teal-600" />

          <span className="text-2xl font-bold text-slate-900">
            Cargo<span className="text-teal-600">Flow</span>
          </span>
        </Link>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Welcome Back
        </h1>

        <p className="text-slate-500 mb-8">
          Sign in to manage your shipments.
        </p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-teal-500"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

        </form>

        {/* Register Link */}
        <p className="text-center text-sm text-slate-500 mt-8">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-teal-600 font-semibold hover:underline"
          >
            Create Account
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;
