
import { Link } from "react-router-dom";
import { ArrowRight, PackageSearch, Ship } from "lucide-react";

function Hero() {
  return (
    <section className="bg-slate-950 text-white px-5 sm:px-8 md:px-12 py-16 md:py-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        {/* Hero Content */}
        <div>
          <span className="inline-block bg-blue-900/50 text-blue-300 px-4 py-2 rounded-full text-sm mb-6">
            Global Shipping Made Simple
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            Moving Your Cargo.
            <span className="text-blue-500">
              {" "}Connecting the World.
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg mt-6 leading-relaxed max-w-xl">
            Manage shipments, track containers and simplify your logistics
            operations with CargoFlow's smart shipping platform.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
            >
              Get Started
              <ArrowRight size={20} />
            </Link>

            <Link
              to="/login"
              className="border border-slate-500 hover:bg-slate-800 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
            >
              <PackageSearch size={20} />
              Track Shipment
            </Link>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-12 border-t border-slate-700 pt-8">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-blue-400">
                120+
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                Countries
              </p>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-blue-400">
                5K+
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                Shipments
              </p>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-blue-400">
                24/7
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                Support
              </p>
            </div>
          </div>
        </div>

        {/* Visual Container */}
        <div className="bg-slate-800 rounded-2xl p-8 md:p-12 min-h-72 md:min-h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-blue-600 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center mx-auto">
              <Ship size={48} />
            </div>

            <h2 className="text-2xl font-bold mt-6">
              Global Logistics
            </h2>

            <p className="text-slate-400 mt-2">
              Your cargo, connected everywhere.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;
