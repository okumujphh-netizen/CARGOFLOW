

import { useState } from "react";
import { Link } from "react-router-dom";
import { Ship, Menu, X } from "lucide-react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-white shadow-sm px-6 md:px-12 py-4 relative z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <Ship size={24} />
          </div>

          <span className="text-2xl font-bold text-slate-900">
            Cargo<span className="text-blue-600">Flow</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-slate-600 hover:text-blue-600">
            Home
          </Link>

          <a href="#services" className="text-slate-600 hover:text-blue-600">
            Services
          </a>

          <a href="#about" className="text-slate-600 hover:text-blue-600">
            About
          </a>
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
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
            Register
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-slate-700 p-2"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg px-6 py-6 space-y-5">
          <Link
            to="/"
            onClick={closeMenu}
            className="block text-slate-600 hover:text-blue-600"
          >
            Home
          </Link>

          <a
            href="/#services"
            onClick={closeMenu}
            className="block text-slate-600 hover:text-blue-600"
          >
            Services
          </a>

          <a
            href="/#about"
            onClick={closeMenu}
            className="block text-slate-600 hover:text-blue-600"
          >
            About
          </a>

          <hr className="border-slate-200" />

          <Link
            to="/login"
            onClick={closeMenu}
            className="block text-slate-700 font-medium"
          >
            Login
          </Link>

          <Link
            to="/register"
            onClick={closeMenu}
            className="block text-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium"
          >
            Register
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
