import { useState } from "react";
import {
    Search,
    Package,
    MapPin,
    CalendarDays,
    CheckCircle2,
    Circle,
    Truck,
    AlertCircle,
    Clock,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import { supabase } from "../lib/supabase";


function TrackShipment() {
    const [trackingNumber, setTrackingNumber] = useState("");
    const [shipment, setShipment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const stages = [
        { value: "pending", label: "Booking Received" },
        { value: "confirmed", label: "Shipment Confirmed" },
        { value: "in_transit", label: "In Transit" },
        { value: "delivered", label: "Delivered" },
    ];

    async function handleTrack(e) {
        e.preventDefault();

        if (!trackingNumber.trim()) {
            setError("Please enter a tracking number.");
            return;
        }

        setLoading(true);
        setError("");
        setShipment(null);

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
            .eq("tracking_number", trackingNumber.trim())
            .eq("customer_id", user.id)
            .maybeSingle();

        if (shipmentError) {
            setError("Something went wrong while tracking your shipment. Please try again.");
        } else if (!data) {
            setError("No shipment found with that tracking number in your account.");
        } else {
            setShipment(data);
        }

        setLoading(false);
    }

    function formatDate(date) {
        if (!date) return "Not available";

        return new Date(date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    }


    const currentStage = stages.findIndex(
        (stage) => stage.value === shipment?.status
    );

    const isCancelled = shipment?.status === "cancelled";

    function statusLabel(status) {
        return status
            ? status.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase())
            : "Unknown";
    }
    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />

            <main className="min-w-0 flex-1 p-6 md:p-8">
                <div className="mx-auto max-w-5xl">
                    <div className="mb-8">
                        <p className="mb-2 text-sm font-medium text-blue-600">
                            SHIPMENT MANAGEMENT
                        </p>

                        <h1 className="text-3xl font-bold text-slate-900">
                            Track Shipment
                        </h1>

                        <p className="mt-2 text-slate-500">
                            Enter your tracking number to check the latest shipment progress.
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <form onSubmit={handleTrack}>
                            <label
                                htmlFor="trackingNumber"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Tracking Number
                            </label>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <input
                                    id="trackingNumber"
                                    type="text"
                                    value={trackingNumber}
                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                    placeholder="Enter your CargoFlow tracking number"
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Search size={18} />
                                    {loading ? "Tracking..." : "Track Shipment"}
                                </button>
                            </div>
                        </form>

                        {error && (
                            <div className="mt-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                <AlertCircle size={20} className="shrink-0" />
                                {error}
                            </div>
                        )}
                    </div>

                    {shipment && (
                        <div className="mt-8 space-y-6">
                            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            Tracking Number
                                        </p>
                                        <h2 className="mt-1 text-xl font-bold text-slate-900">
                                            {shipment.tracking_number}
                                        </h2>
                                    </div>

                                    <span className="w-fit rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                                        {statusLabel(shipment.status)}
                                    </span>
                                </div>

                                <div className="mt-8 grid gap-6 md:grid-cols-2">
                                    <div className="flex items-start gap-3">
                                        <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                                            <MapPin size={22} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Origin</p>
                                            <p className="mt-1 font-semibold text-slate-900">
                                                {shipment.origin}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="rounded-lg bg-green-50 p-3 text-green-600">
                                            <MapPin size={22} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Destination</p>
                                            <p className="mt-1 font-semibold text-slate-900">
                                                {shipment.destination}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="rounded-lg bg-slate-100 p-3 text-slate-600">
                                            <CalendarDays size={22} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Booking Date</p>
                                            <p className="mt-1 font-semibold text-slate-900">
                                                {formatDate(shipment.booking_date)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="rounded-lg bg-slate-100 p-3 text-slate-600">
                                            <Clock size={22} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">
                                                Estimated Delivery
                                            </p>
                                            <p className="mt-1 font-semibold text-slate-900">
                                                {formatDate(shipment.estimated_delivery)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 border-t border-slate-100 pt-5">
                                    <p className="text-sm text-slate-500">Cargo Description</p>
                                    <p className="mt-1 font-medium text-slate-800">
                                        {shipment.cargo_description || "Not provided"}
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="mb-6 flex items-center gap-3">
                                    <Truck className="text-blue-600" size={24} />
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900">
                                            Shipment Progress
                                        </h2>
                                        <p className="text-sm text-slate-500">
                                            Follow your shipment through each stage.
                                        </p>
                                    </div>
                                </div>

                                {isCancelled ? (
                                    <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                                        <AlertCircle size={22} />
                                        <div>
                                            <p className="font-semibold">Shipment Cancelled</p>
                                            <p className="text-sm">
                                                This shipment is no longer progressing through delivery.
                                            </p>
                                        </div>
                                    </div>
                                ) : currentStage === -1 ? (
                                    <p className="text-sm text-slate-500">
                                        Progress information is not available for this status.
                                    </p>
                                ) : (
                                    <div className="space-y-6">
                                        {stages.map((stage, index) => {
                                            const completed = index <= currentStage;
                                            const active = index === currentStage;

                                            return (
                                                <div key={stage.value} className="flex gap-4">
                                                    <div className="flex flex-col items-center">
                                                        {completed ? (
                                                            <CheckCircle2
                                                                size={24}
                                                                className="text-green-600"
                                                            />
                                                        ) : (
                                                            <Circle
                                                                size={24}
                                                                className="text-slate-300"
                                                            />
                                                        )}

                                                        {index !== stages.length - 1 && (
                                                            <div
                                                                className={`mt-2 h-8 w-0.5 ${index < currentStage
                                                                        ? "bg-green-500"
                                                                        : "bg-slate-200"
                                                                    }`}
                                                            />
                                                        )}
                                                    </div>

                                                    <div className="-mt-0.5">
                                                        <p
                                                            className={`font-semibold ${completed
                                                                    ? "text-slate-900"
                                                                    : "text-slate-400"
                                                                }`}
                                                        >
                                                            {stage.label}
                                                        </p>

                                                        {active && (
                                                            <p className="mt-1 text-sm font-medium text-blue-600">
                                                                Current shipment status
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {!shipment && !loading && !error && (
                        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
                            <Package
                                size={42}
                                className="mx-auto text-slate-300"
                            />
                            <h2 className="mt-4 font-semibold text-slate-800">
                                Ready to track your shipment?
                            </h2>
                            <p className="mt-2 text-sm text-slate-500">
                                Your shipment details and delivery progress will appear here.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default TrackShipment;



