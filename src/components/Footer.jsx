
import { Ship, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer id="contact" className="bg-slate-950 text-white px-6 md:px-12 py-14">
      <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Company */}
        <div>
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Ship size={24} />
            </div>
            <span className="text-2xl font-bold">
              Cargo<span className="text-blue-500">Flow</span>
            </span>
          </Link>

          <p className="text-slate-400 mt-5 leading-relaxed">
            Smart shipping and container management for a connected world.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold text-lg mb-5">Quick Links</h3>
          <ul className="space-y-3 text-slate-400">
            <li><Link to="/">Home</Link></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#about">About Us</a></li>
            <li><Link to="/login">Login</Link></li>
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
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-blue-400" />
              info@cargoflow.com
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-blue-400" />
              +254 700 000 000
            </li>
            <li className="flex items-center gap-3">
              <MapPin size={18} className="text-blue-400" />
              Nairobi, Kenya
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto border-t border-slate-800 mt-12 pt-6 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} CargoFlow. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
