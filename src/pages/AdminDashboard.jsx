
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

      <main className="flex-1 min-w-0 p-4 pt-20 md:p-8 md:pt-8 overflow-x-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Admin Dashboard
            </h1>
            <p className="text-slate-500 mt-1">
              Monitor and manage your CargoFlow operations.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="relative p-3 bg-white rounded-xl shadow-sm text-slate-600"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                A
              </div>
              <div>
                <p className="font-semibold text-slate-800">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="bg-white p-5 rounded-2xl shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <Icon size={22} />
                  </div>
                  <ArrowUpRight
                    className="text-slate-400"
                    size={20}
                  />
                </div>

                <p className="text-sm text-slate-500">
                  {stat.title}
                </p>

                <h2 className="text-2xl font-bold text-slate-800 mt-1">
                  {loading ? "..." : stat.value}
                </h2>

                <p className="text-xs text-slate-500 mt-2">
                  {stat.change}
                </p>
              </div>
            );
          })}
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Shipments table */}
          <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Recent Shipments
                </h2>
                <p className="text-sm text-slate-500">
                  Live shipment records from CargoFlow
                </p>
              </div>

              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-3 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search shipments..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full sm:w-56 pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {loading && (
              <div className="py-12 text-center">
                <RefreshCw
                  className="animate-spin mx-auto text-blue-600 mb-3"
                  size={30}
                />
                <p className="text-slate-500">
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
                <p className="text-sm">{error}</p>
              </div>
            )}

            {!loading && !error && (
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[650px]">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 text-sm">
                      <th className="py-3">Shipment ID</th>
                      <th className="py-3">Customer</th>
                      <th className="py-3">Route</th>
                      <th className="py-3">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredShipments.map((shipment) => (
                      <tr
                        key={shipment.id}
                        className="border-b border-slate-100 text-sm"
                      >
                        <td className="py-4 font-semibold text-blue-600">
                          {shipment.tracking_number}
                        </td>

                        <td className="py-4 text-slate-700">
                          {shipment.customer}
                        </td>

                        <td className="py-4 text-slate-600">
                          {shipment.origin} → {shipment.destination}
                        </td>

                        <td className="py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyle(
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
                          className="py-8 text-center text-slate-500"
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

          {/* Shipment overview */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-800">
              Shipment Overview
            </h2>

            <p className="text-sm text-slate-500 mb-6">
              Current shipment status breakdown
            </p>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-100 text-yellow-600 p-2 rounded-lg">
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

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
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
                        (shipment) =>
                          shipment.status === "in_transit"
                      ).length}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 text-green-600 p-2 rounded-lg">
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

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 text-red-600 p-2 rounded-lg">
                    <AlertCircle size={18} />
                  </div>
                  <span className="text-sm text-slate-700">
                    Cancelled
                  </span>
                </div>
                <span className="font-bold text-slate-800">
                  {loading
                    ? "..."
                    : shipments.filter(
                        (shipment) =>
                          shipment.status === "cancelled"
                      ).length}
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-6">
          CargoFlow Admin Portal · Dashboard connected to Supabase.
        </p>
      </main>
    </div>
  );
}

export default AdminDashboard;
