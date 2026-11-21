
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Sidebar from "../components/Sidebar";
import {
    Search,
    RefreshCw,
    Trash2,
    Plus,
    Edit,
    AlertCircle,
    X,
    Container,
} from "lucide-react";

function Containers() {
    const [containers, setContainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const emptyForm = {
        container_number: "",
        container_type: "",
        capacity: "",
        status: "available",
    };

    const [form, setForm] = useState(emptyForm);

    const statuses = ["available", "assigned", "maintenance"];

    const fetchContainers = async () => {
        setLoading(true);
        setError("");

        const { data, error: fetchError } = await supabase
            .from("containers")
            .select("*")
            .order("container_number", { ascending: true });

        if (fetchError) {
            setError(fetchError.message);
        } else {
            setContainers(data || []);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchContainers();
    }, []);

    const openAddForm = () => {
        setForm(emptyForm);
        setEditingId(null);
        setShowForm(true);
        setError("");
        setSuccess("");
    };

    const openEditForm = (item) => {
        setForm({
            container_number: item.container_number || "",
            container_type: item.container_type || "",
            capacity: item.capacity ?? "",
            status: item.status || "available",
        });

        setEditingId(item.id);
        setShowForm(true);
        setError("");
        setSuccess("");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const saveContainer = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (
            !form.container_number.trim() ||
            !form.container_type.trim() ||
            form.capacity === "" ||
            Number(form.capacity) <= 0
        ) {
            setError("Please provide a container number, type and valid capacity.");
            return;
        }

        setSaving(true);

        const containerData = {
            container_number: form.container_number.trim(),
            container_type: form.container_type.trim(),
            capacity: Number(form.capacity),
            status: form.status,
        };

        let result;

        if (editingId) {
            result = await supabase
                .from("containers")
                .update(containerData)
                .eq("id", editingId);
        } else {
            result = await supabase
                .from("containers")
                .insert([containerData]);
        }

        if (result.error) {
            setError(result.error.message);
        } else {
            setSuccess(
                editingId
                    ? "Container updated successfully."
                    : "Container added successfully."
            );

            setShowForm(false);
            setForm(emptyForm);
            setEditingId(null);

            await fetchContainers();
        }

        setSaving(false);
    };

    const updateStatus = async (containerId, newStatus) => {
        setError("");
        setSuccess("");

        const { error: updateError } = await supabase
            .from("containers")
            .update({ status: newStatus })
            .eq("id", containerId);

        if (updateError) {
            setError(updateError.message);
        } else {
            setContainers((previous) =>
                previous.map((item) =>
                    item.id === containerId
                        ? { ...item, status: newStatus }
                        : item
                )
            );

            setSuccess("Container status updated successfully.");
        }
    };

    const deleteContainer = async (item) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete container ${item.container_number}?`
        );

        if (!confirmed) return;

        setDeletingId(item.id);
        setError("");
        setSuccess("");

        const { error: deleteError } = await supabase
            .from("containers")
            .delete()
            .eq("id", item.id);

        if (deleteError) {
            setError(deleteError.message);
        } else {
            setContainers((previous) =>
                previous.filter((container) => container.id !== item.id)
            );

            setSuccess("Container deleted successfully.");
        }

        setDeletingId(null);
    };

    const filteredContainers = containers.filter((item) => {
        const searchText = [
            item.container_number,
            item.container_type,
            item.capacity,
            item.status,
        ]
            .join(" ")
            .toLowerCase();

        return searchText.includes(search.toLowerCase());
    });

    const getStatusStyle = (status) => {
        const styles = {
            available: "bg-green-100 text-green-700",
            assigned: "bg-blue-100 text-blue-700",
            maintenance: "bg-yellow-100 text-yellow-700",
        };

        return styles[status] || "bg-gray-100 text-gray-700";
    };

    const formatStatus = (status = "") =>
        status.replace("_", " ").replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
        );

    const statistics = [
        {
            label: "Total Containers",
            value: containers.length,
        },
        {
            label: "Available",
            value: containers.filter((c) => c.status === "available").length,
        },
        {
            label: "Assigned",
            value: containers.filter((c) => c.status === "assigned").length,
        },
        {
            label: "Maintenance",
            value: containers.filter((c) => c.status === "maintenance").length,
        },
    ];

    return (
        <div className="min-h-screen bg-slate-100 flex">
            <Sidebar role="admin" />

            <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                                Container Management
                            </h1>

                            <p className="text-sm sm:text-base text-slate-500 mt-2">
                                Add, view and manage shipping containers.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3">
                            <button
                                type="button"
                                onClick={fetchContainers}
                                disabled={loading}
                                className="flex items-center justify-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-50 text-slate-700 px-3 sm:px-4 py-3 rounded-lg text-sm font-medium transition"
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
                                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-5 py-3 rounded-lg text-sm font-medium transition"
                            >
                                <Plus size={18} />
                                Add Container
                            </button>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                        {statistics.map((stat) => (
                            <div
                                key={stat.label}
                                className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-200"
                            >
                                <p className="text-xs sm:text-sm text-slate-500">
                                    {stat.label}
                                </p>

                                <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                                    {stat.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Messages */}
                    {error && (
                        <div
                            role="alert"
                            className="mb-5 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-start gap-3"
                        >
                            <AlertCircle size={18} className="shrink-0 mt-0.5" />
                            <span className="text-sm break-words">{error}</span>
                        </div>
                    )}

                    {success && (
                        <div
                            role="status"
                            className="mb-5 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm"
                        >
                            {success}
                        </div>
                    )}

                    {/* Add/Edit Form */}
                    {showForm && (
                        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200 mb-6">
                            <div className="flex items-center justify-between gap-3 mb-6">
                                <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                                    {editingId ? "Edit Container" : "Add New Container"}
                                </h2>

                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    aria-label="Close container form"
                                    className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                                >
                                    <X size={22} />
                                </button>
                            </div>

                            <form onSubmit={saveContainer}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                                    <div>
                                        <label
                                            htmlFor="container_number"
                                            className="block text-sm font-medium text-slate-700 mb-2"
                                        >
                                            Container Number
                                        </label>

                                        <input
                                            id="container_number"
                                            type="text"
                                            name="container_number"
                                            value={form.container_number}
                                            onChange={handleChange}
                                            placeholder="e.g. CFCU1234567"
                                            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="container_type"
                                            className="block text-sm font-medium text-slate-700 mb-2"
                                        >
                                            Container Type
                                        </label>

                                        <select
                                            id="container_type"
                                            name="container_type"
                                            value={form.container_type}
                                            onChange={handleChange}
                                            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="">Select container type</option>
                                            <option value="20ft">20ft Standard</option>
                                            <option value="40ft">40ft Standard</option>
                                            <option value="40ft High Cube">40ft High Cube</option>
                                            <option value="Refrigerated">Refrigerated</option>
                                            <option value="Open Top">Open Top</option>
                                            <option value="Flat Rack">Flat Rack</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="capacity"
                                            className="block text-sm font-medium text-slate-700 mb-2"
                                        >
                                            Capacity
                                        </label>

                                        <input
                                            id="capacity"
                                            type="number"
                                            name="capacity"
                                            value={form.capacity}
                                            onChange={handleChange}
                                            placeholder="Enter capacity"
                                            min="1"
                                            step="any"
                                            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />

                                        <p className="text-xs text-slate-400 mt-1">
                                            Enter the capacity using the unit defined by your container records.
                                        </p>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="container_status"
                                            className="block text-sm font-medium text-slate-700 mb-2"
                                        >
                                            Status
                                        </label>

                                        <select
                                            id="container_status"
                                            name="status"
                                            value={form.status}
                                            onChange={handleChange}
                                            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {statuses.map((status) => (
                                                <option key={status} value={status}>
                                                    {formatStatus(status)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition"
                                    >
                                        {saving
                                            ? "Saving..."
                                            : editingId
                                                ? "Save Changes"
                                                : "Add Container"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-lg font-medium transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Search */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 mb-6">
                        <label htmlFor="container-search" className="sr-only">
                            Search containers
                        </label>

                        <div className="relative">
                            <Search
                                size={20}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                id="container-search"
                                type="text"
                                placeholder="Search container number, type or status..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Containers Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 sm:p-5 border-b border-slate-200">
                            <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                                All Containers ({filteredContainers.length})
                            </h2>
                        </div>

                        {loading ? (
                            <div className="p-10 text-center text-slate-500">
                                <RefreshCw
                                    size={20}
                                    className="animate-spin mx-auto mb-3"
                                />
                                Loading containers...
                            </div>
                        ) : filteredContainers.length === 0 ? (
                            <div className="p-10 text-center text-slate-500">
                                <Container
                                    size={40}
                                    className="mx-auto mb-3 text-slate-300"
                                />
                                <p>No containers found.</p>
                                <p className="text-sm mt-2">
                                    Add your first container to get started.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[750px] text-left">
                                    <thead className="bg-slate-50 text-slate-600 text-xs sm:text-sm">
                                        <tr>
                                            <th className="p-4">Container Number</th>
                                            <th className="p-4">Container Type</th>
                                            <th className="p-4">Capacity</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4">Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-100">
                                        {filteredContainers.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="hover:bg-slate-50 transition"
                                            >
                                                <td className="p-4">
                                                    <span className="font-semibold text-blue-700 break-words">
                                                        {item.container_number}
                                                    </span>
                                                </td>

                                                <td className="p-4 text-sm text-slate-700">
                                                    {item.container_type}
                                                </td>

                                                <td className="p-4 text-sm text-slate-700">
                                                    {item.capacity}
                                                </td>

                                                <td className="p-4">
                                                    <div className="flex flex-col gap-2 items-start">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusStyle(item.status)}`}
                                                        >
                                                            {formatStatus(item.status)}
                                                        </span>

                                                        <select
                                                            aria-label={`Update status for ${item.container_number}`}
                                                            value={item.status || "available"}
                                                            onChange={(e) =>
                                                                updateStatus(item.id, e.target.value)
                                                            }
                                                            className="text-xs border border-slate-300 rounded-md p-2 bg-white"
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
                                                    <div className="flex flex-wrap gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => openEditForm(item)}
                                                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition"
                                                        >
                                                            <Edit size={16} />
                                                            Edit
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => deleteContainer(item)}
                                                            disabled={deletingId === item.id}
                                                            className="flex items-center gap-1 text-red-600 hover:text-red-800 disabled:opacity-50 text-sm font-medium transition"
                                                        >
                                                            <Trash2 size={16} />
                                                            {deletingId === item.id
                                                                ? "Deleting..."
                                                                : "Delete"}
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

                    <p className="text-xs sm:text-sm text-slate-400 mt-5">
                        Container records are saved directly to the CargoFlow database.
                    </p>
                </div>
            </main>
        </div>
    );
}

export default Containers;
