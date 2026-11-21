

import { useEffect, useMemo, useState } from "react";
import {
  Package,
  Truck,
  Users,
  Search,
  Bell,
  ArrowUpRight,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import { supabase } from "../lib/supabase";

function AdminDashboard() {
  const [search, setSearch] = useState("");
  const [shipments, setShipments] = useState([]);
  const [customerCount, setCustomerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAdminData() {
      setLoading(true);
      setError("");

      const { data: shipmentData, error: shipmentError } =
        await supabase
          .from("shipments")
          .select(
            "id, tracking_number, customer_id, origin, destination, status, booking_date"
          )
          .order("created_at", { ascending: false });

      if (shipmentError) {
        setError(shipmentError.message);
        setLoading(false);
        return;
      }

      const customerIds = [
        ...new Set(
          (shipmentData || [])
            .map((shipment) => shipment.customer_id)
            .filter(Boolean)
        ),
      ];

      let customerMap = {};

      if (customerIds.length > 0) {
        const { data: customers, error: customerError } =
          await supabase
            .from("profiles")
            .select("id, full_name")
            .in("id", customerIds);

        if (customerError) {
          setError(customerError.message);
          setLoading(false);
          return;
        }

        customerMap = Object.fromEntries(
          (customers || []).map((customer) => [
            customer.id,
            customer.full_name || "Unnamed Customer",
          ])
        );
      }

      const formattedShipments = (shipmentData || []).map(
        (shipment) => ({
          ...shipment,
          customer:
            customerMap[shipment.customer_id] || "Customer",
        })
      );

      const { count, error: countError } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "customer");

      if (countError) {
        setError(countError.message);
        setLoading(false);
        return;
      }

      setShipments(formattedShipments);
      setCustomerCount(count || 0);
      setLoading(false);
    }

    fetchAdminData();
  }, []);

  const filteredShipments = useMemo(() => {
    return shipments.filter(
      (shipment) =>
        shipment.tracking_number
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        shipment.customer
          ?.toLowerCase()
          .includes(search.toLowerCase())
    );
  }, [shipments, search]);

  const totalShipments = shipments.length;

  const activeShipments = shipments.filter(
    (shipment) =>
      shipment.status === "confirmed" ||
      shipment.status === "in_transit"
  ).length;

  const pendingShipments = shipments.filter(
    (shipment) => shipment.status === "pending"
  ).length;

  const deliveredShipments = shipments.filter(
    (shipment) => shipment.status === "delivered"
  ).length;

  const cancelledShipments = shipments.filter(
    (shipment) => shipment.status === "cancelled"
  ).length;

  const stats = [
    {
      title: "Total Shipments",
      value: totalShipments,
      change: "All registered shipments",
      icon: Package,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Active Shipments",
      value: activeShipments,
      change: "Confirmed and in transit",
      icon: Truck,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Total Customers",
      value: customerCount,
      change: "Registered customer accounts",
      icon: Users,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Delivered Shipments",
      value: deliveredShipments,
      change: "Successfully delivered",
      icon: CheckCircle,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  function getStatusStyle(status) {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      confirmed: "bg-blue-100 text-blue-700",
      in_transit: "bg-purple-100 text-purple-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };

    return styles[status] || "bg-slate-100 text-slate-600";
  }

  function formatStatus(status) {
    return (status || "unknown").replaceAll("_", " ");
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role="admin" />

      <main className="flex-1 min-w-0 p-4 pt-20 sm:p-6 sm:pt-20 lg:p-8 lg:pt-8 overflow-x-hidden">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
              Admin Dashboard
            </h1>

            <p className="text-sm sm:text-base text-slate-500 mt-1">
              Monitor and manage your CargoFlow operations.
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
            <button
              type="button"
              className="relative p-3 bg-white rounded-xl shadow-sm text-slate-600 shrink-0"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 shrink-0 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                A
              </div>

              <div className="min-w-0">
                <p className="font-semibold text-slate-800 text-sm sm:text-base">
                  Administrator
                </p>

                <p className="text-xs text-slate-500">
                  System Manager
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm min-w-0"
              >
                <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
                  <div className={`p-2 sm:p-3 rounded-xl shrink-0 ${stat.color}`}>
                    <Icon size={20} className="sm:hidden" />
                    <Icon size={22} className="hidden sm:block" />
                  </div>

                  <ArrowUpRight
                    className="text-slate-400 hidden sm:block"
                    size={20}
                  />
                </div>

                <p className="text-xs sm:text-sm text-slate-500">
                  {stat.title}
                </p>

                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">
                  {loading ? "..." : stat.value}
                </h2>

                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {stat.change}
                </p>
              </div>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 sm:gap-6">

          {/* Shipments Table */}
          <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm p-4 sm:p-6 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5 sm:mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Recent Shipments
                </h2>

                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Live shipment records from CargoFlow
                </p>
              </div>

              <div className="relative w-full sm:w-56">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search shipments..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search shipments by tracking number or customer"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm sm:text-base outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {loading && (
              <div className="py-12 text-center">
                <RefreshCw
                  className="animate-spin mx-auto text-blue-600 mb-3"
                  size={30}
                />

                <p className="text-slate-500 text-sm">
                  Loading shipment records...
                </p>
              </div>
            )}

            {!loading && error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                <div className="flex items-center gap-2 font-semibold mb-1">
                  <AlertCircle size={20} />
                  Unable to load dashboard data
                </div>

                <p className="text-sm break-words">{error}</p>
              </div>
            )}

            {!loading && !error && (
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[650px]">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 text-sm">
                      <th className="py-3 px-2">Shipment ID</th>
                      <th className="py-3 px-2">Customer</th>
                      <th className="py-3 px-2">Route</th>
                      <th className="py-3 px-2">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredShipments.map((shipment) => (
                      <tr
                        key={shipment.id}
                        className="border-b border-slate-100 text-sm hover:bg-slate-50 transition"
                      >
                        <td className="py-4 px-2 font-semibold text-blue-600 whitespace-nowrap">
                          {shipment.tracking_number}
                        </td>

                        <td className="py-4 px-2 text-slate-700">
                          {shipment.customer}
                        </td>

                        <td className="py-4 px-2 text-slate-600">
                          {shipment.origin} → {shipment.destination}
                        </td>

                        <td className="py-4 px-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium capitalize whitespace-nowrap ${getStatusStyle(
                              shipment.status
                            )}`}
                          >
                            {formatStatus(shipment.status)}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {filteredShipments.length === 0 && (
                      <tr>
                        <td
                          colSpan="4"
                          className="py-8 px-4 text-center text-slate-500"
                        >
                          No matching shipments found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Shipment Overview */}
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 min-w-0">
            <h2 className="text-lg font-bold text-slate-800">
              Shipment Overview
            </h2>

            <p className="text-sm text-slate-500 mb-6 mt-1">
              Current shipment status breakdown
            </p>

            <div className="space-y-5 sm:space-y-6">

              {/* Pending */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="bg-yellow-100 text-yellow-600 p-2 rounded-lg shrink-0">
                    <Clock size={18} />
                  </div>

                  <span className="text-sm text-slate-700">
                    Pending
                  </span>
                </div>

                <span className="font-bold text-slate-800">
                  {loading ? "..." : pendingShipments}
                </span>
              </div>

              {/* In Transit */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="bg-purple-100 text-purple-600 p-2 rounded-lg shrink-0">
                    <Truck size={18} />
                  </div>

                  <span className="text-sm text-slate-700">
                    In Transit
                  </span>
                </div>

                <span className="font-bold text-slate-800">
                  {loading
                    ? "..."
                    : shipments.filter(
                        (shipment) => shipment.status === "in_transit"
                      ).length}
                </span>
              </div>

              {/* Delivered */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="bg-green-100 text-green-600 p-2 rounded-lg shrink-0">
                    <CheckCircle size={18} />
                  </div>

                  <span className="text-sm text-slate-700">
                    Delivered
                  </span>
                </div>

                <span className="font-bold text-slate-800">
                  {loading ? "..." : deliveredShipments}
                </span>
              </div>

              {/* Cancelled */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="bg-red-100 text-red-600 p-2 rounded-lg shrink-0">
                    <AlertCircle size={18} />
                  </div>

                  <span className="text-sm text-slate-700">
                    Cancelled
                  </span>
                </div>

                <span className="font-bold text-slate-800">
                  {loading ? "..." : cancelledShipments}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-slate-400 mt-6 text-center sm:text-left">
          CargoFlow Admin Portal · Dashboard connected to Supabase.
        </p>
      </main>
    </div>
  );
}

export default AdminDashboard;
