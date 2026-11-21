
import { useEffect, useState } from "react";
import {
  Users,
  Search,
  RefreshCw,
  Package,
  Phone,
  Calendar,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import { supabase } from "../lib/supabase";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [expandedCustomer, setExpandedCustomer] = useState(null);

  const fetchCustomers = async () => {
    setLoading(true);
    setError("");

    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name, phone, role, created_at")
      .eq("role", "customer")
      .order("created_at", { ascending: false });

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    const { data: shipmentData, error: shipmentError } = await supabase
      .from("shipments")
      .select(
        "id, customer_id, tracking_number, origin, destination, status, booking_date, estimated_delivery"
      )
      .order("created_at", { ascending: false });

    if (shipmentError) {
      setError(shipmentError.message);
      setLoading(false);
      return;
    }

    setCustomers(profiles || []);
    setShipments(shipmentData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const getCustomerShipments = (customerId) => {
    return shipments.filter(
      (shipment) => shipment.customer_id === customerId
    );
  };

  const filteredCustomers = customers.filter((customer) => {
    const query = search.toLowerCase();

    return (
      (customer.full_name || "").toLowerCase().includes(query) ||
      (customer.phone || "").toLowerCase().includes(query) ||
      customer.id.toLowerCase().includes(query)
    );
  });

  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusStyle = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      confirmed: "bg-blue-100 text-blue-700",
      in_transit: "bg-purple-100 text-purple-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };

    return styles[status] || "bg-slate-100 text-slate-600";
  };

  const formatStatus = (status) => {
    return status
      ? status.replaceAll("_", " ").replace(/\b\w/g, (char) =>
          char.toUpperCase()
        )
      : "Unknown";
  };

  const totalCustomerShipments = shipments.length;

  const activeShipments = shipments.filter(
    (shipment) =>
      shipment.status === "confirmed" ||
      shipment.status === "in_transit"
  ).length;

  const stats = [
    {
      label: "Total Customers",
      value: customers.length,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Total Shipments",
      value: totalCustomerShipments,
      icon: Package,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Active Shipments",
      value: activeShipments,
      icon: Package,
      color: "bg-green-50 text-green-600",
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="min-w-0 flex-1 p-4 sm:p-5 md:p-8">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="mb-2 text-xs font-semibold tracking-wide text-blue-600 sm:text-sm">
                ADMINISTRATION
              </p>

              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Customer Management
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
                View registered customers and their shipment activity.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchCustomers}
              disabled={loading}
              className="flex w-full flex-shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-60 sm:w-auto sm:text-base"
            >
              <RefreshCw
                size={18}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {/* Statistics */}
          <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-4 lg:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className={`min-w-0 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5 ${
                    stat.label === "Active Shipments"
                      ? "col-span-2 sm:col-span-1"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500 sm:text-sm">
                        {stat.label}
                      </p>

                      <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                        {stat.value}
                      </h2>
                    </div>

                    <div className={`flex-shrink-0 rounded-lg p-2 sm:p-3 ${stat.color}`}>
                      <Icon size={21} className="sm:h-6 sm:w-6" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Search */}
          <div className="mb-5 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:mb-6 sm:p-4">
            <div className="relative">
              <Search
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customers by name, phone or customer ID..."
                aria-label="Search customers"
                className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:text-base"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 sm:mb-6 sm:p-4"
            >
              <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
              <span className="break-words">{error}</span>
            </div>
          )}

          {/* Customer List */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-4 sm:p-5">
              <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                Registered Customers
              </h2>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                {filteredCustomers.length} customer(s) found
              </p>
            </div>

            {loading ? (
              <div className="p-8 text-center text-slate-500 sm:p-12">
                <RefreshCw
                  size={28}
                  className="mx-auto mb-3 animate-spin text-blue-600"
                />
                Loading customers...
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="p-8 text-center sm:p-12">
                <Users
                  size={40}
                  className="mx-auto mb-3 text-slate-300"
                />

                <p className="font-semibold text-slate-700">
                  No customers found
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Try another search or check whether customers have registered.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredCustomers.map((customer) => {
                  const customerShipments = getCustomerShipments(customer.id);
                  const isExpanded = expandedCustomer === customer.id;

                  return (
                    <div key={customer.id} className="min-w-0">

                      {/* Customer Information */}
                      <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 sm:h-12 sm:w-12">
                            <Users size={22} />
                          </div>

                          <div className="min-w-0">
                            <h3 className="break-words font-semibold text-slate-900">
                              {customer.full_name || "Unnamed Customer"}
                            </h3>

                            <p className="mt-1 break-all text-xs text-slate-400">
                              ID: {customer.id}
                            </p>
                          </div>
                        </div>

                        {/* Customer Details */}
                        <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 sm:gap-5 lg:flex-1 lg:justify-center">
                          <div className="min-w-0">
                            <p className="text-xs text-slate-500">
                              Phone
                            </p>

                            <p className="mt-1 flex items-start gap-1 break-words text-xs font-medium text-slate-700 sm:text-sm">
                              <Phone size={14} className="mt-0.5 flex-shrink-0" />
                              {customer.phone || "Not provided"}
                            </p>
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs text-slate-500">
                              Registered
                            </p>

                            <p className="mt-1 flex items-start gap-1 text-xs font-medium text-slate-700 sm:text-sm">
                              <Calendar size={14} className="mt-0.5 flex-shrink-0" />
                              {formatDate(customer.created_at)}
                            </p>
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs text-slate-500">
                              Shipments
                            </p>

                            <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-900 sm:text-sm">
                              <Package size={15} />
                              {customerShipments.length}
                            </p>
                          </div>
                        </div>

                        {/* Expand Button */}
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedCustomer(
                              isExpanded ? null : customer.id
                            )
                          }
                          aria-expanded={isExpanded}
                          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 lg:w-auto lg:flex-shrink-0"
                        >
                          {isExpanded ? "Hide Details" : "View Details"}

                          {isExpanded ? (
                            <ChevronUp size={17} />
                          ) : (
                            <ChevronDown size={17} />
                          )}
                        </button>
                      </div>

                      {/* Shipment History */}
                      {isExpanded && (
                        <div className="border-t border-slate-100 bg-slate-50 p-4 sm:p-5">
                          <h4 className="mb-4 text-sm font-semibold text-slate-800 sm:text-base">
                            Customer Shipment History
                          </h4>

                          {customerShipments.length === 0 ? (
                            <p className="rounded-lg bg-white p-4 text-sm text-slate-500 sm:p-5">
                              This customer has not booked any shipments yet.
                            </p>
                          ) : (
                            <div className="space-y-3">
                              {customerShipments.map((shipment) => (
                                <div
                                  key={shipment.id}
                                  className="min-w-0 rounded-lg border border-slate-200 bg-white p-3 sm:p-4"
                                >
                                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="min-w-0">
                                      <p className="break-all text-sm font-semibold text-slate-900 sm:text-base">
                                        {shipment.tracking_number}
                                      </p>

                                      <p className="mt-1 break-words text-sm text-slate-600">
                                        {shipment.origin} → {shipment.destination}
                                      </p>

                                      <p className="mt-1 text-xs text-slate-400">
                                        Booked: {formatDate(shipment.booking_date)}
                                      </p>
                                    </div>

                                    <span
                                      className={`w-fit flex-shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                        shipment.status
                                      )}`}
                                    >
                                      {formatStatus(shipment.status)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Customers;
