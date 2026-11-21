


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

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      setError(error.message);
      return;
    }

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

    if (profile.role === "admin") {
      navigate("/admin", { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-6 sm:py-10">
      <div className="w-full max-w-md min-w-0 bg-white p-5 sm:p-8 rounded-2xl shadow-lg">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-8 sm:mb-10 w-fit">
          <Ship size={28} className="text-teal-600 shrink-0" />

          <span className="text-xl sm:text-2xl font-bold text-slate-900">
            Cargo<span className="text-teal-600">Flow</span>
          </span>
        </Link>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          Welcome Back
        </h1>

        <p className="text-sm sm:text-base text-slate-500 mb-7 sm:mb-8">
          Sign in to manage your shipments.
        </p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full min-w-0 border border-slate-300 rounded-lg px-4 py-3 text-base outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full min-w-0 border border-slate-300 rounded-lg px-4 py-3 pr-12 text-base outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-800 transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p role="alert" className="text-sm text-red-600 break-words">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-sm text-slate-500 mt-7 sm:mt-8">
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

