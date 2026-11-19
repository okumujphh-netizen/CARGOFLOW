

import {
  Globe,
  ShieldCheck,
  Clock,
  Users,
} from "lucide-react";

const benefits = [
  {
    icon: Globe,
    title: "Global Connectivity",
    description:
      "Connect shipping operations across countries and international trade routes.",
  },
  {
    icon: ShieldCheck,
    title: "Reliable Management",
    description:
      "Keep shipment and container information organised in one secure platform.",
  },
  {
    icon: Clock,
    title: "Real-Time Visibility",
    description:
      "Stay informed about shipment progress and important delivery updates.",
  },
  {
    icon: Users,
    title: "Customer Focused",
    description:
      "Give customers and administrators tools to manage logistics efficiently.",
  },
];

function About() {
  return (
    <section
      id="about"
      className="bg-slate-50 py-16 sm:py-20 px-5 sm:px-8 md:px-12"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">

        {/* About Content */}
        <div>
          <span className="text-blue-600 font-semibold uppercase tracking-wider text-xs sm:text-sm">
            About CargoFlow
          </span>

          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3 leading-tight">
            Making Global Shipping Simpler and Smarter
          </h2>

          <p className="text-slate-600 mt-6 leading-relaxed">
            CargoFlow is a smart shipping and container management platform
            designed to simplify international logistics. It brings shipment
            tracking, container management and customer services together in
            one convenient place.
          </p>

          <p className="text-slate-600 mt-4 leading-relaxed">
            Our goal is to improve visibility, organisation and communication
            throughout the shipping process.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-xl flex items-center justify-center">
                  <Icon size={25} />
                </div>

                <h3 className="font-bold text-slate-900 mt-4">
                  {benefit.title}
                </h3>

                <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default About;
