 
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Package,
    Plus,
    MapPin,
    Calendar,
    RefreshCw,
    AlertCircle,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import { supabase } from "../lib/supabase";

function MyShipments() {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchShipments() {
            setLoading(true);
            setError("");

            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError || !user) {
                setError("Unable to identify your account. Please log in again.");
                setLoading(false);
                return;
            }

            const { data, error: shipmentError } = await supabase
                .from("shipments")
                .select(
                    "id, tracking_number, origin, destination, cargo_description, status, booking_date, estimated_delivery"
                )
                .eq("customer_id", user.id)
                .order("created_at", { ascending: false });

            if (shipmentError) {
                setError(shipmentError.message);
            } else {
                setShipments(data || []);
            }

            setLoading(false);
        }

        fetchShipments();
    }, []);

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
        return status.replaceAll("_", " ");
    }

    return (
        <div className="flex min-h-screen bg-slate-100">
            <Sidebar role="customer" />

            <main className="flex-1 min-w-0 p-6 md:p-10">
                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                                My Shipments
                            </h1>
                            <p className="text-slate-500 mt-2">
                                View and manage your shipping bookings.
                            </p>
                        </div>

                        <Link
                            to="/book-shipment"
                            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold transition"
                        >
                            <Plus size={20} />
                            Book Shipment
                        </Link>
                    </div>

                    {/* Shipment count */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                                <Package size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Total Shipments</p>
                                <h2 className="text-2xl font-bold text-slate-900">
                                    {shipments.length}
                                </h2>
                            </div>
                        </div>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="bg-white rounded-xl p-10 text-center shadow-sm">
                            <RefreshCw className="animate-spin mx-auto text-blue-600 mb-3" size={30} />
                            <p className="text-slate-500">Loading your shipments...</p>
                        </div>
                    )}

                    {/* Error */}
                    {!loading && error && (
                        <div className="bg-white rounded-xl p-6 border border-red-200 text-red-600">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertCircle size={20} />
                                <span className="font-semibold">Unable to load shipments</span>
                            </div>
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {/* Empty state */}
                    {!loading && !error && shipments.length === 0 && (
                        <div className="bg-white rounded-xl shadow-sm p-10 text-center">
                            <Package size={48} className="mx-auto text-slate-300 mb-4" />
                            <h2 className="text-xl font-bold text-slate-800 mb-2">
                                No shipments yet
                            </h2>
                            <p className="text-slate-500 mb-6">
                                Your bookings will appear here once you create your first shipment.
                            </p>
                            <Link
                                to="/book-shipment"
                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold transition"
                            >
                                <Plus size={19} />
                                Book Your First Shipment
                            </Link>
                        </div>
                    )}

                    {/* Shipment list */}
                    {!loading && !error && shipments.length > 0 && (
                        <div className="space-y-4">
                            {shipments.map((shipment) => (
                                <div
                                    key={shipment.id}
                                    className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 md:p-6"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1">
                                                Tracking Number
                                            </p>
                                            <h3 className="font-bold text-blue-600 text-lg">
                                                {shipment.tracking_number}
                                            </h3>
                                        </div>

                                        <span
                                            className={`inline-flex w-fit px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusStyle(
                                                shipment.status
                                            )}`}
                                        >
                                            {formatStatus(shipment.status)}
                                        </span>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-5">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="text-blue-600 mt-1 shrink-0" size={20} />
                                            <div>
                                                <p className="text-xs text-slate-500">Origin</p>
                                                <p className="font-medium text-slate-800">
                                                    {shipment.origin}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <MapPin className="text-teal-600 mt-1 shrink-0" size={20} />
                                            <div>
                                                <p className="text-xs text-slate-500">Destination</p>
                                                <p className="font-medium text-slate-800">
                                                    {shipment.destination}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Calendar className="text-slate-500 mt-1 shrink-0" size={20} />
                                            <div>
                                                <p className="text-xs text-slate-500">Booking Date</p>
                                                <p className="font-medium text-slate-800">
                                                    {shipment.booking_date || "Not available"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Calendar className="text-slate-500 mt-1 shrink-0" size={20} />
                                            <div>
                                                <p className="text-xs text-slate-500">Estimated Delivery</p>
                                                <p className="font-medium text-slate-800">
                                                    {shipment.estimated_delivery || "Not scheduled"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {shipment.cargo_description && (
                                        <div className="border-t border-slate-100 mt-5 pt-4">
                                            <p className="text-xs text-slate-500 mb-1">
                                                Cargo Description
                                            </p>
                                            <p className="text-sm text-slate-700">
                                                {shipment.cargo_description}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default MyShipments;
