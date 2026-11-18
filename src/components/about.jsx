import { Globe, ShieldCheck, Clock, Users } from "lucide-react";

const benefits =[
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
    <section id="about" className="bg-slate-50 py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14 items-center">

        <div>
          <span className="text-blue-600 font-semibold uppercase tracking-wider text-sm">
            About CargoFlow
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
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

        {/* Statistics */}
        <div className="grid sm:grid-cols-2 gap-6">

          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h3 className="text-3xl font-bold text-blue-600">Global</h3>
            <p className="text-slate-600 mt-2">Shipping Network</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h3 className="text-3xl font-bold text-blue-600">24/7</h3>
            <p className="text-slate-600 mt-2">Shipment Visibility</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h3 className="text-3xl font-bold text-blue-600">Smart</h3>
            <p className="text-slate-600 mt-2">Container Management</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h3 className="text-3xl font-bold text-blue-600">Real-time</h3>
            <p className="text-slate-600 mt-2">Tracking Updates</p>
          </div>

        </div>

      </div>
    </section>
  );
}


