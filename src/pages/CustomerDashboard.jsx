
import { useEffect, useState } from "react";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  Plus,
  Search,
  Bell,
  ArrowUpRight,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import { supabase } from "../lib/supabase";

function CustomerDashboard() {
  const [search, setSearch] = useState("");
  const [shipments, setShipments] = useState([]);
  const [customerName, setCustomerName] = useState("Customer");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function fetchDashboardData() {
      setLoading(true);
      setError("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        if (mounted) {
          setError(userError?.message || "Unable to identify your account.");
          setLoading(false);
        }
        return;
      }

      // Fetch customer profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      if (!mounted) return;

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }

      setCustomerName(profile.full_name || "Customer");

      // Fetch this customer's shipments
      const { data: shipmentData, error: shipmentError } = await supabase
        .from("shipments")
        .select(
          "id, tracking_number, origin, destination, booking_date, status"
        )
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });

      if (!mounted) return;

      if (shipmentError) {
        setError(shipmentError.message);
        setLoading(false);
        return;
      }

      setShipments(shipmentData || []);
      setLoading(false);
    }

    fetchDashboardData();

    return () => {
      mounted = false;
    };
  }, []);

  // Calculate statistics using actual shipment records
  const stats = [
    {
      title: "Total Shipments",
      value: shipments.length,
      icon: Package,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "In Transit",
      value: shipments.filter((s) => s.status === "in_transit").length,
      icon: Truck,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Delivered",
      value: shipments.filter((s) => s.status === "delivered").length,
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Pending",
      value: shipments.filter((s) => s.status === "pending").length,
      icon: Clock,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  const filteredShipments = shipments.filter((shipment) =>
    shipment.tracking_number?.toLowerCase().includes(search.toLowerCase())
  );

  function formatDate(date) {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatStatus(status) {
    const statusLabels = {
      pending: "Pending",
      confirmed: "Confirmed",
      in_transit: "In Transit",
      delivered: "Delivered",
      cancelled: "Cancelled",
    };

    return statusLabels[status] || status;
  }

  function getStatusColor(status) {
    const statusColors = {
      delivered: "bg-green-100 text-green-700",
      in_transit: "bg-orange-100 text-orange-700",
      pending: "bg-purple-100 text-purple-700",
      confirmed: "bg-blue-100 text-blue-700",
      cancelled: "bg-red-100 text-red-700",
    };

    return statusColors[status] || "bg-slate-100 text-slate-700";
  }

  const initials = customerName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role="customer" />

      <main className="flex-1 min-w-0 p-4 pt-20 md:p-8 md:pt-8 overflow-x-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              Customer Dashboard
            </h1>

            <p className="text-slate-500 mt-1">
              Welcome back! Here's an overview of your shipments.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-3 bg-white rounded-lg shadow-sm text-slate-600">
              <Bell size={20} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">
                {initials || "C"}
              </div>

              <div>
                <p className="font-semibold text-slate-800 text-sm">
                  {customerName}
                </p>
                <p className="text-xs text-slate-500">Customer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action */}
        <div className="bg-slate-900 rounded-xl p-6 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-white text-xl font-bold">
              Manage Your Shipments
            </h2>

            <p className="text-slate-300 mt-1">
              Book and track your cargo shipments with ease.
            </p>
          </div>

          <button className="flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-5 py-3 rounded-lg font-semibold transition">
            <Plus size={20} />
            Book Shipment
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
            Unable to load dashboard data: {error}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="bg-white p-5 rounded-xl shadow-sm border border-slate-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm">{stat.title}</p>

                    <h3 className="text-3xl font-bold text-slate-900 mt-2">
                      {loading ? "..." : stat.value}
                    </h3>
                  </div>

                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Shipments */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Recent Shipments
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Monitor your recent cargo deliveries.
              </p>
            </div>

            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search shipment ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-slate-300 rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-teal-500 w-full sm:w-64"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-sm">
                <tr>
                  <th className="px-6 py-4">Shipment ID</th>
                  <th className="px-6 py-4">Origin</th>
                  <th className="px-6 py-4">Destination</th>
                  <th className="px-6 py-4">Booking Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-slate-500">
                      Loading your shipments...
                    </td>
                  </tr>
                ) : filteredShipments.length > 0 ? (
                  filteredShipments.map((shipment) => (
                    <tr
                      key={shipment.id}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {shipment.tracking_number}
                      </td>

                      <td className="px-6 py-4 text-slate-600 text-sm">
                        {shipment.origin}
                      </td>

                      <td className="px-6 py-4 text-slate-600 text-sm">
                        {shipment.destination}
                      </td>

                      <td className="px-6 py-4 text-slate-600 text-sm">
                        {formatDate(shipment.booking_date)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            shipment.status
                          )}`}
                        >
                          {formatStatus(shipment.status)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <button className="text-teal-600 hover:text-teal-800">
                          <ArrowUpRight size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-8 text-slate-500"
                    >
                      {search
                        ? "No matching shipments found."
                        : "You haven't booked any shipments yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CustomerDashboard;







