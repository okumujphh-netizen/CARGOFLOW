
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
    <section
      id="services"
      className="bg-white py-16 sm:py-20 px-5 sm:px-8 md:px-12"
    >
      <div className="max-w-7xl mx-auto">

        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-14">
          <span className="text-blue-600 font-semibold uppercase tracking-wider text-xs sm:text-sm">
            What We Offer
          </span>

          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3">
            Our Shipping Solutions
          </h2>

          <p className="text-slate-600 mt-4 leading-relaxed">
            Everything you need to manage your shipping and logistics
            operations in one platform.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className="group p-6 sm:p-7 border border-slate-200 rounded-2xl hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Icon */}
                <div className="bg-blue-50 text-blue-600 w-14 h-14 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <Icon size={28} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 mt-6">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 mt-3 leading-relaxed text-sm sm:text-base">
                  {service.description}
                </p>

                {/* Learn More */}
                <a
                  href="#about"
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

export default Services;
