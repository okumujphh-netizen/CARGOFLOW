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

  return (

    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="min-w-0 flex-1 p-6 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="mb-2 text-sm font-medium text-blue-600">
                ADMINISTRATION
              </p>

              <h1 className="text-3xl font-bold text-slate-900">
                Customer Management
              </h1>

              <p className="mt-2 text-slate-500">
                View registered customers and their shipment activity.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchCustomers}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
            >
              <RefreshCw
                size={18}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    Total Customers
                  </p>
                  <h2 className="mt-2 text-3xl font-bold text-slate-900">
                    {customers.length}
                  </h2>
                </div>

                <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                  <Users size={25} />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    Total Shipments
                  </p>
                  <h2 className="mt-2 text-3xl font-bold text-slate-900">
                    {totalCustomerShipments}
                  </h2>
                </div>

                <div className="rounded-lg bg-purple-50 p-3 text-purple-600">
                  <Package size={25} />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    Active Shipments
                  </p>
                  <h2 className="mt-2 text-3xl font-bold text-slate-900">
                    {activeShipments}
                  </h2>
                </div>

                <div className="rounded-lg bg-green-50 p-3 text-green-600">
                  <Package size={25} />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
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
                className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle size={20} className="shrink-0" />
              {error}
            </div>
          )}

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <h2 className="text-lg font-bold text-slate-900">
                Registered Customers
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {filteredCustomers.length} customer(s) found
              </p>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-500">
                <RefreshCw
                  size={28}
                  className="mx-auto mb-3 animate-spin text-blue-600"
                />
                Loading customers...
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="p-12 text-center">
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
                  const customerShipments = getCustomerShipments(
                    customer.id
                  );

                  const isExpanded =
                    expandedCustomer === customer.id;

                  return (
                    <div key={customer.id}>
                      <div className="flex flex-col justify-between gap-4 p-5 lg:flex-row lg:items-center">
                        <div className="flex min-w-0 items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                            <Users size={22} />
                          </div>

                          <div className="min-w-0">
                            <h3 className="truncate font-semibold text-slate-900">
                              {customer.full_name || "Unnamed Customer"}
                            </h3>

                            <p className="mt-1 text-xs text-slate-400">
                              ID: {customer.id}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:items-center">
                          <div>
                            <p className="text-xs text-slate-500">
                              Phone
                            </p>

                            <p className="mt-1 flex items-center gap-1 text-sm font-medium text-slate-700">
                              <Phone size={14} />
                              {customer.phone || "Not provided"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-500">
                              Registered
                            </p>

                            <p className="mt-1 flex items-center gap-1 text-sm font-medium text-slate-700">
                              <Calendar size={14} />
                              {formatDate(customer.created_at)}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-500">
                              Shipments
                            </p>

                            <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-slate-900">
                              <Package size={15} />
                              {customerShipments.length}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setExpandedCustomer(
                              isExpanded ? null : customer.id
                            )
                          }
                          className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          {isExpanded ? "Hide Details" : "View Details"}

                          {isExpanded ? (
                            <ChevronUp size={17} />
                          ) : (
                            <ChevronDown size={17} />
                          )}
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="border-t border-slate-100 bg-slate-50 p-5">
                          <h4 className="mb-4 font-semibold text-slate-800">
                            Customer Shipment History
                          </h4>

                          {customerShipments.length === 0 ? (
                            <p className="rounded-lg bg-white p-5 text-sm text-slate-500">
                              This customer has not booked any shipments yet.
                            </p>
                          ) : (
                            <div className="space-y-3">
                              {customerShipments.map((shipment) => (
                                <div
                                  key={shipment.id}
                                  className="rounded-lg border border-slate-200 bg-white p-4"
                                >
                                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                                    <div>
                                      <p className="font-semibold text-slate-900">
                                        {shipment.tracking_number}
                                      </p>

                                      <p className="mt-1 text-sm text-slate-600">
                                        {shipment.origin} → {shipment.destination}
                                      </p>

                                      <p className="mt-1 text-xs text-slate-400">
                                        Booked: {formatDate(shipment.booking_date)}
                                      </p>
                                    </div>

                                    <span
                                      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
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

