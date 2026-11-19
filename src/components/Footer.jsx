
import { Ship, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer id="contact" className="bg-slate-950 text-white px-5 sm:px-8 md:px-12 py-14">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Company */}
        <div>
          <Link to="/" className="flex items-center gap-2 w-fit">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Ship size={24} />
            </div>

            <span className="text-2xl font-bold">
              Cargo<span className="text-blue-500">Flow</span>
            </span>
          </Link>

          <p className="text-slate-400 mt-5 leading-relaxed max-w-xs">
            Smart shipping and container management for a connected world.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold text-lg mb-5">Quick Links</h3>

          <ul className="space-y-3 text-slate-400">
            <li>
              <Link to="/" className="hover:text-blue-400 transition">
                Home
              </Link>
            </li>

            <li>
              <a href="/#services" className="hover:text-blue-400 transition">
                Services
              </a>
            </li>

            <li>
              <a href="/#about" className="hover:text-blue-400 transition">
                About Us
              </a>
            </li>

            <li>
              <Link to="/login" className="hover:text-blue-400 transition">
                Login
              </Link>
            </li>

            <li>
              <Link to="/register" className="hover:text-blue-400 transition">
                Register
              </Link>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="font-bold text-lg mb-5">Our Services</h3>

          <ul className="space-y-3 text-slate-400">
            <li>Ocean Freight</li>
            <li>Container Management</li>
            <li>Cargo Transportation</li>
            <li>Global Tracking</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-bold text-lg mb-5">Contact Us</h3>

          <ul className="space-y-4 text-slate-400">
            <li className="flex items-start gap-3">
              <Mail size={18} className="text-blue-400 shrink-0 mt-1" />
              <a
                href="mailto:info@cargoflow.com"
                className="hover:text-blue-400 transition break-all"
              >
                info@cargoflow.com
              </a>
            </li>

            <li className="flex items-center gap-3">
              <Phone size={18} className="text-blue-400 shrink-0" />
              <a
                href="tel:+254700000000"
                className="hover:text-blue-400 transition"
              >
                +254 700 000 000
              </a>
            </li>

            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-blue-400 shrink-0 mt-1" />
              <span>Nairobi, Kenya</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto border-t border-slate-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} CargoFlow. All rights reserved.
        </p>

        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="text-slate-400 hover:text-blue-400 text-sm flex items-center gap-2 transition"
        >
          Back to top
          <ArrowUpRight size={16} />
        </a>
      </div>
    </footer>
  );
}

export default Footer;

