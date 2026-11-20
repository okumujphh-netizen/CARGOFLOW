
import { useEffect, useState } from "react";
import {
  Truck,
  Search,
  RefreshCw,
  Plus,
  Pencil,
  Trash2,
  MapPin,
  Calendar,
  Package,
  X,
  AlertCircle,
  Clock,
  CheckCircle,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import { supabase } from "../lib/supabase";

function Transportation() {
  const [transportation, setTransportation] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  const initialForm = {
    shipment_id: "",
    transport_type: "Road",
    vehicle_reference: "",
    departure_location: "",
    arrival_location: "",
    departure_date: "",
    arrival_date: "",
    status: "scheduled",
  };

  const [form, setForm] = useState(initialForm);

  const statuses = [
    "scheduled",
    "in_transit",
    "completed",
    "delayed",
    "cancelled",
  ];

  const transportTypes = ["Road", "Rail", "Sea", "Air"];

  const fetchData = async () => {
    setLoading(true);
    setError("");

    const { data: shipmentData, error: shipmentError } =
      await supabase
        .from("shipments")
        .select("id, tracking_number, origin, destination, status")
        .order("created_at", { ascending: false });

    if (shipmentError) {
      setError(shipmentError.message);
      setLoading(false);
      return;
    }

    const { data: transportData, error: transportError } =
      await supabase
        .from("transportation")
        .select(`
          *,
          shipments (
            id,
            tracking_number,
            origin,
            destination,
            status
          )
        `)
        .order("created_at", { ascending: false });

    if (transportError) {
      setError(transportError.message);
      setLoading(false);
      return;
    }

    setShipments(shipmentData || []);
    setTransportation(transportData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddForm = () => {
    setEditingId(null);
    setForm(initialForm);
    setError("");
    setSuccess("");
    setFormOpen(true);
  };

  const openEditForm = (record) => {
    setEditingId(record.id);

    setForm({
      shipment_id: record.shipment_id || "",
      transport_type: record.transport_type || "Road",
      vehicle_reference: record.vehicle_reference || "",
      departure_location: record.departure_location || "",
      arrival_location: record.arrival_location || "",
      departure_date: record.departure_date
        ? record.departure_date.slice(0, 16)
        : "",
      arrival_date: record.arrival_date
        ? record.arrival_date.slice(0, 16)
        : "",
      status: record.status || "scheduled",
    });

    setError("");
    setSuccess("");
    setFormOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.shipment_id ||
      !form.vehicle_reference.trim() ||
      !form.departure_location.trim() ||
      !form.arrival_location.trim() ||
      !form.departure_date ||
      !form.arrival_date
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (
      new Date(form.arrival_date) < new Date(form.departure_date)
    ) {
      setError("Arrival date cannot be earlier than departure date.");
      return;
    }

    const payload = {
      shipment_id: form.shipment_id,
      transport_type: form.transport_type,
      vehicle_reference: form.vehicle_reference.trim(),
      departure_location: form.departure_location.trim(),
      arrival_location: form.arrival_location.trim(),
      departure_date: new Date(form.departure_date).toISOString(),
      arrival_date: new Date(form.arrival_date).toISOString(),
      status: form.status,
    };

    setSaving(true);

    let result;

    if (editingId) {
      result = await supabase
        .from("transportation")
        .update(payload)
        .eq("id", editingId);
    } else {
      result = await supabase
        .from("transportation")
        .insert([payload]);
    }

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
      return;
    }

    setSuccess(
      editingId
        ? "Transportation record updated successfully."
        : "Transportation record added successfully."
    );

    setFormOpen(false);
    setForm(initialForm);
    setEditingId(null);

    await fetchData();
    setSaving(false);
  };

  const updateStatus = async (id, newStatus) => {
    setError("");
    setSuccess("");

    const { error: updateError } = await supabase
      .from("transportation")
      .update({ status: newStatus })
      .eq("id", id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setTransportation((previous) =>
      previous.map((record) =>
        record.id === id
          ? { ...record, status: newStatus }
          : record
      )
    );

    setSuccess("Transportation status updated successfully.");
  };

  const deleteRecord = async (record) => {
    const confirmed = window.confirm(
      `Delete transportation record for ${
        record.shipments?.tracking_number || "this shipment"
      }?`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    const { error: deleteError } = await supabase
      .from("transportation")
      .delete()
      .eq("id", record.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setTransportation((previous) =>
      previous.filter((item) => item.id !== record.id)
    );

    setSuccess("Transportation record deleted successfully.");
  };

  const filteredRecords = transportation.filter((record) => {
    const shipment = record.shipments || {};

    const searchText = [
      shipment.tracking_number,
      shipment.origin,
      shipment.destination,
      record.transport_type,
      record.vehicle_reference,
      record.departure_location,
      record.arrival_location,
      record.status,
    ]
      .join(" ")
      .toLowerCase();

    return searchText.includes(search.toLowerCase());
  });

  const formatStatus = (status) =>
    status
      ? status.replaceAll("_", " ").replace(/\b\w/g, (letter) =>
          letter.toUpperCase()
        )
      : "Unknown";

  const getStatusStyle = (status) => {
    const styles = {
      scheduled: "bg-blue-100 text-blue-700",
      in_transit: "bg-purple-100 text-purple-700",
      completed: "bg-green-100 text-green-700",
      delayed: "bg-yellow-100 text-yellow-700",
      cancelled: "bg-red-100 text-red-700",
    };

    return styles[status] || "bg-slate-100 text-slate-600";
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role="admin" />

      <main className="min-w-0 flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="mb-2 text-sm font-medium text-blue-600">
                ADMINISTRATION
              </p>

              <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
                Transportation Management
              </h1>

              <p className="mt-2 text-slate-500">
                Manage shipment transportation, vehicles, routes and schedules.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={fetchData}
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw
                  size={18}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>

              <button
                type="button"
                onClick={openAddForm}
                className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
              >
                <Plus size={19} />
                Add Transportation
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              {
                label: "Total Records",
                value: transportation.length,
                icon: Truck,
                color: "text-blue-600 bg-blue-50",
              },
              {
                label: "Scheduled",
                value: transportation.filter(
                  (r) => r.status === "scheduled"
                ).length,
                icon: Calendar,
                color: "text-yellow-600 bg-yellow-50",
              },
              {
                label: "In Transit",
                value: transportation.filter(
                  (r) => r.status === "in_transit"
                ).length,
                icon: Clock,
                color: "text-purple-600 bg-purple-50",
              },
              {
                label: "Completed",
                value: transportation.filter(
                  (r) => r.status === "completed"
                ).length,
                icon: CheckCircle,
                color: "text-green-600 bg-green-50",
              },
            ].map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">
                        {stat.label}
                      </p>

                      <h2 className="mt-2 text-3xl font-bold text-slate-900">
                        {stat.value}
                      </h2>
                    </div>

                    <div className={`rounded-lg p-3 ${stat.color}`}>
                      <Icon size={24} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-700">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-5 rounded-lg bg-green-50 p-4 text-green-700">
              {success}
            </div>
          )}

          {/* Add / Edit Form */}
          {formOpen && (
            <div className="mb-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {editingId
                      ? "Edit Transportation"
                      : "Add Transportation"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Enter the transportation details below.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                >
                  <X size={22} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid gap-5 md:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Select Shipment *
                    </label>

                    <select
                      name="shipment_id"
                      value={form.shipment_id}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Choose a shipment</option>

                      {shipments.map((shipment) => (
                        <option
                          key={shipment.id}
                          value={shipment.id}
                        >
                          {shipment.tracking_number} — {shipment.origin} to {shipment.destination}
                        </option>
                      ))}
                    </select>

                    {shipments.length === 0 && (
                      <p className="mt-2 text-xs text-amber-600">
                        No shipments are currently available.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Transport Type *
                    </label>

                    <select
                      name="transport_type"
                      value={form.transport_type}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      {transportTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Vehicle Reference *
                    </label>

                    <input
                      name="vehicle_reference"
                      value={form.vehicle_reference}
                      onChange={handleChange}
                      placeholder="e.g. KDA 123A / Vessel name"
                      required
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Status *
                    </label>

                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {formatStatus(status)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Departure Location *
                    </label>

                    <input
                      name="departure_location"
                      value={form.departure_location}
                      onChange={handleChange}
                      placeholder="Enter departure location"
                      required
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Arrival Location *
                    </label>

                    <input
                      name="arrival_location"
                      value={form.arrival_location}
                      onChange={handleChange}
                      placeholder="Enter arrival location"
                      required
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Departure Date *
                    </label>

                    <input
                      type="datetime-local"
                      name="departure_date"
                      value={form.departure_date}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Arrival Date *
                    </label>

                    <input
                      type="datetime-local"
                      name="arrival_date"
                      value={form.arrival_date}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={saving || shipments.length === 0}
                    className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving
                      ? "Saving..."
                      : editingId
                      ? "Save Changes"
                      : "Add Transportation"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormOpen(false)}
                    className="rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Search */}
          <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search tracking number, vehicle, transport type or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Transportation Table */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <h2 className="text-lg font-semibold text-slate-900">
                All Transportation Records ({filteredRecords.length})
              </h2>
            </div>

            {loading ? (
              <div className="p-10 text-center text-slate-500">
                Loading transportation records...
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="p-10 text-center">
                <Truck size={40} className="mx-auto mb-3 text-slate-300" />

                <p className="font-medium text-slate-700">
                  No transportation records found.
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Add a transportation record to get started.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-sm text-slate-600">
                    <tr>
                      <th className="p-4">Shipment</th>
                      <th className="p-4">Transport</th>
                      <th className="p-4">Route</th>
                      <th className="p-4">Schedule</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredRecords.map((record) => (
                      <tr
                        key={record.id}
                        className="hover:bg-slate-50"
                      >
                        <td className="p-4">
                          <span className="font-semibold text-blue-700">
                            {record.shipments?.tracking_number || "Unknown shipment"}
                          </span>

                          <p className="mt-1 text-xs text-slate-400">
                            {record.shipments?.origin || "N/A"} → {record.shipments?.destination || "N/A"}
                          </p>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                            <Truck size={16} className="text-blue-600" />
                            {record.transport_type}
                          </div>

                          <p className="mt-1 text-xs text-slate-500">
                            {record.vehicle_reference}
                          </p>
                        </td>

                        <td className="p-4 text-sm text-slate-700">
                          <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            {record.departure_location}
                          </div>

                          <p className="mt-1 text-slate-400">
                            → {record.arrival_location}
                          </p>
                        </td>

                        <td className="p-4 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            {formatDate(record.departure_date)}
                          </div>

                          <p className="mt-1 text-xs text-slate-400">
                            Arrival: {formatDate(record.arrival_date)}
                          </p>
                        </td>

                        <td className="p-4">
                          <div className="flex flex-col items-start gap-2">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(record.status)}`}
                            >
                              {formatStatus(record.status)}
                            </span>

                            <select
                              value={record.status}
                              onChange={(e) =>
                                updateStatus(record.id, e.target.value)
                              }
                              className="rounded-md border border-slate-300 p-2 text-xs"
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
                          <div className="flex flex-col gap-3">
                            <button
                              type="button"
                              onClick={() => openEditForm(record)}
                              className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                            >
                              <Pencil size={16} />
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => deleteRecord(record)}
                              className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <p className="mt-5 text-sm text-slate-400">
            Transportation records are saved directly to the CargoFlow database.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Transportation;
