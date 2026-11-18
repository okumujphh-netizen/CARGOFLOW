import { useState } from "react";
import { Link } from "lucide-react"
import { Ship, Eye, EyeOff } from "lucide-react";

function login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">


        {/*logo*/}
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

        {/*Login form*/}
        <form className="space-y-5">

          <div>
            <label className="block text-sm font-medium mb-2">
              Email Address
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-teal-500"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">

            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-teal-600" />
              Remember me
            </label>

            <a href="#" className="text-teal-600 hover:underline">
              Forgot password?
            </a>

          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
          >
            Sign In
          </button>

        </form>
        {/* Registration Link */}
        <p className="text-center text-sm text-slate-500 mt-8">
          Don't have an account?{" "}
          <Link to="/register" className="text-teal-600 font-semibold">
            Create Account
          </Link>
        </p>

      </div>
    </div>
  );
}



export default login;