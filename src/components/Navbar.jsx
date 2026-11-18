
import { Link } from "react-router-dom";
import { Ship } from "lucide-react";

function Navbar() {
  return (
    <nav className="bg-white shadow-sm px-6 md:px-12 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <Ship size={24} />
          </div>

          <span className="text-2xl font-bold text-slate-900">
            Cargo<span className="text-blue-600">Flow</span>
          </span>
        </Link>

        {/* Navigation links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-slate-600 hover:text-blue-600">
            Home
          </Link>

          <a href="#services" className="text-slate-600 hover:text-blue-600">
            Services
          </a>

          <a href="#about" className="text-slate-600 hover:text-blue-600">
            About
          </a>

          <a href="#contact" className="text-slate-600 hover:text-blue-600">
            Contact
          </a>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-slate-700 font-medium hover:text-blue-600"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition"
          >
            Get Started
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
