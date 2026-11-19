import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Sidebar from "../components/Sidebar";
import {
  Package,
  Search,
  RefreshCw,
  Trash2,
  MapPin,
  Calendar,
  AlertCircle,
} from "lucide-react";

function AdminShipments() {
  const [shipments, setShipments] = useState([]);
  const [customers, setCustomers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const statuses = [
    "pending",
    "confirmed",
    "in_transit",
    "delivered",
    "cancelled",
  ];

  const fetchShipments = async () => {
    setLoading(true);
    setError("");

    const { data, error: shipmentError } = await supabase
      .from("shipments")
      .select("*")
      .order("created_at", { ascending: false });

    if (shipmentError) {
      setError(shipmentError.message);
      setLoading(false);
      return;
    }

    setShipments(data || []);

    const customerIds = [
      ...new Set((data || []).map((shipment) => shipment.customer_id)),
    ];

    if (customerIds.length > 0) {
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", customerIds);

      if (profileError) {
        setError(profileError.message);
      } else {
        const customerMap = {};

        (profiles || []).forEach((profile) => {
          customerMap[profile.id] = profile.full_name;
        });

        setCustomers(customerMap);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const updateStatus = async (shipmentId, newStatus) => {
    setUpdatingId(shipmentId);
    setError("");
    setSuccess("");

    const { error: updateError } = await supabase
      .from("shipments")
      .update({ status: newStatus })
      .eq("id", shipmentId);

    if (updateError) {
      setError(updateError.message);
    } else {
      setShipments((previous) =>
        previous.map((shipment) =>
          shipment.id === shipmentId
            ? { ...shipment, status: newStatus }
            : shipment
        )
      );

      setSuccess("Shipment status updated successfully.");
    }

    setUpdatingId(null);
  };

  const deleteShipment = async (shipment) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete shipment ${shipment.tracking_number}?`
    );

    if (!confirmed) return;

    setDeletingId(shipment.id);
    setError("");
    setSuccess("");

    const { error: deleteError } = await supabase
      .from("shipments")
      .delete()
      .eq("id", shipment.id);

    if (deleteError) {
      setError(deleteError.message);
    } else {
      setShipments((previous) =>
        previous.filter((item) => item.id !== shipment.id)
      );

      setSuccess("Shipment deleted successfully.");
    }

    setDeletingId(null);
  };

  const filteredShipments = shipments.filter((shipment) => {
    const customerName = customers[shipment.customer_id] || "";

    const searchText = [
      shipment.tracking_number,
      shipment.origin,
      shipment.destination,
      customerName,
      shipment.status,
    ]
      .join(" ")
      .toLowerCase();

    return searchText.includes(search.toLowerCase());
  });

  const getStatusStyle = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      confirmed: "bg-blue-100 text-blue-700",
      in_transit: "bg-purple-100 text-purple-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };

    return styles[status] || "bg-gray-100 text-gray-700";
  };

  const formatStatus = (status) =>
    status.replace("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar role="admin" />

      <main className="flex-1 min-w-0 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Shipment Management
              </h1>

              <p className="text-slate-500 mt-2">
                View, manage and update all customer shipments.
              </p>
            </div>

            <button
              onClick={fetchShipments}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-3 rounded-lg font-medium"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: "Total Shipments",
                value: shipments.length,
              },
              {
                label: "Pending",
                value: shipments.filter((s) => s.status === "pending").length,
              },
              {
                label: "In Transit",
                value: shipments.filter((s) => s.status === "in_transit")
                  .length,
              },
              {
                label: "Delivered",
                value: shipments.filter((s) => s.status === "delivered")
                  .length,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-xl p-5 shadow-sm border border-slate-200"
              >
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-5 p-4 rounded-lg bg-red-50 text-red-700 flex gap-2 items-center">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 p-4 rounded-lg bg-green-50 text-green-700">
              {success}
            </div>
          )}

          {/* Search */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 mb-6">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search tracking number, customer or destination..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Shipments Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">
                All Shipments ({filteredShipments.length})
              </h2>
            </div>

            {loading ? (
              <div className="p-10 text-center text-slate-500">
                Loading shipments...
              </div>
            ) : filteredShipments.length === 0 ? (
              <div className="p-10 text-center text-slate-500">
                No shipments found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-600 text-sm">
                    <tr>
                      <th className="p-4">Tracking Number</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Route</th>
                      <th className="p-4">Booking Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredShipments.map((shipment) => (
                      <tr key={shipment.id} className="hover:bg-slate-50">
                        <td className="p-4">
                          <span className="font-semibold text-blue-700">
                            {shipment.tracking_number}
                          </span>

                          <p className="text-xs text-slate-400 mt-1">
                            {shipment.cargo_description || "No description"}
                          </p>
                        </td>

                        <td className="p-4 text-sm text-slate-700">
                          {customers[shipment.customer_id] || "Unknown"}
                        </td>

                        <td className="p-4 text-sm text-slate-700">
                          <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            {shipment.origin}
                          </div>

                          <div className="text-slate-400 mt-1">
                            → {shipment.destination}
                          </div>
                        </td>

                        <td className="p-4 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} />
                            {shipment.booking_date || "N/A"}
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex flex-col gap-2 items-start">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                                shipment.status
                              )}`}
                            >
                              {formatStatus(shipment.status)}
                            </span>

                            <select
                              value={shipment.status}
                              disabled={updatingId === shipment.id}
                              onChange={(e) =>
                                updateStatus(shipment.id, e.target.value)
                              }
                              className="text-xs border border-slate-300 rounded-md p-2 disabled:opacity-50"
                            >
                              {statuses.map((status) => (
                                <option key={status} value={status}>
                                  {formatStatus(status)}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>

                        <td className="p-4">
                          <button
                            onClick={() => deleteShipment(shipment)}
                            disabled={
                              deletingId === shipment.id ||
                              updatingId === shipment.id
                            }
                            className="flex items-center gap-2 text-red-600 hover:text-red-800 disabled:opacity-50 text-sm font-medium"
                          >
                            <Trash2 size={16} />
                            {deletingId === shipment.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <p className="text-sm text-slate-400 mt-5">
            Shipment changes are saved directly to the CargoFlow database.
          </p>
        </div>
      </main>
    </div>
  );
}

export default AdminShipments;