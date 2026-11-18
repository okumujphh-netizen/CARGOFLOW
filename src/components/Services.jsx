import {
    Ship,
    Package,
    Truck,
    Globe,
    ArrowRight,
} from "lucide-react";

const services = [
    {
    icon: Ship,
    title: "Ocean Freight",
    description:
      "Manage international sea shipments and container transportation with ease.",
  },
  {
    icon: Package,
    title: "Container Management",
    description:
      "Monitor container availability, assignments and shipment status.",
  },
  {
    icon: Truck,
    title: "Cargo Transportation",
    description:
      "Coordinate cargo movement from ports to its final destination.",
  },
  {
    icon: Globe,
    title: "Global Tracking",
    description:
      "Track shipments and receive updates throughout the shipping journey.",
  },
];

function Services() {
  return (
    <section id="services" className="bg-white py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Section heading */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-blue-600 font-semibold uppercase tracking-wider text-sm">
            What We Offer
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
            Our Shipping Solutions
          </h2>

          <p className="text-slate-600 mt-4">
            Everything you need to manage your shipping and logistics
            operations in one platform.
          </p>
        </div>

        {/* Service cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <div
                key={index}
                className="p-7 border border-slate-200 rounded-xl hover:shadow-lg hover:border-blue-300 transition"
              >
                <div className="bg-blue-50 text-blue-600 w-14 h-14 rounded-xl flex items-center justify-center">
                  <Icon size={28} />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mt-6">
                  {service.title}
                </h3>

                <p className="text-slate-600 mt-3 leading-relaxed">
                  {service.description}
                </p>

                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-blue-600 font-semibold mt-6 hover:gap-3 transition-all"
                >
                  Learn More
                  <ArrowRight size={18} />
                </a>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default services;