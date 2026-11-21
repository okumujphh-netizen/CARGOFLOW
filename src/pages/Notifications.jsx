

import { useEffect, useState } from "react";
import {
    Bell,
    CheckCheck,
    Check,
    RefreshCw,
    AlertCircle,
    Package,
    Trash2,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import { supabase } from "../lib/supabase";

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("all");

    async function fetchNotifications() {
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

        const { data, error: notificationError } = await supabase
            .from("notifications")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (notificationError) {
            setError(notificationError.message);
        } else {
            setNotifications(data || []);
        }

        setLoading(false);
    }

    useEffect(() => {
        fetchNotifications();
    }, []);

    async function markAsRead(id) {
        const { error } = await supabase
            .from("notifications")
            .update({ is_read: true })
            .eq("id", id);

        if (error) {
            setError(error.message);
            return;
        }

        setNotifications((previous) =>
            previous.map((item) =>
                item.id === id ? { ...item, is_read: true } : item
            )
        );
    }

    async function markAllAsRead() {
        const unreadIds = notifications
            .filter((item) => !item.is_read)
            .map((item) => item.id);

        if (unreadIds.length === 0) return;

        const { error } = await supabase
            .from("notifications")
            .update({ is_read: true })
            .in("id", unreadIds);

        if (error) {
            setError(error.message);
            return;
        }

        setNotifications((previous) =>
            previous.map((item) => ({ ...item, is_read: true }))
        );
    }

    async function deleteNotification(id) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this notification?"
        );

        if (!confirmed) return;

        const { error } = await supabase
            .from("notifications")
            .delete()
            .eq("id", id);

        if (error) {
            setError(error.message);
            return;
        }

        setNotifications((previous) =>
            previous.filter((item) => item.id !== id)
        );
    }

    const unreadCount = notifications.filter(
        (item) => !item.is_read
    ).length;

    const filteredNotifications = notifications.filter((item) => {
        if (filter === "unread") return !item.is_read;
        if (filter === "read") return item.is_read;
        return true;
    });

    function formatDate(date) {
        return new Date(date).toLocaleString();
    }

    return (
        <div className="flex min-h-screen bg-slate-100">
            <Sidebar role="customer" />

            <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10">
                <div className="max-w-7xl mx-auto">

                    {/* Page Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                                Notifications
                            </h1>
                            <p className="text-sm sm:text-base text-slate-500 mt-2">
                                Stay updated on your shipments and bookings.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={markAllAsRead}
                            disabled={unreadCount === 0}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-5 py-3 rounded-lg font-semibold text-sm sm:text-base transition"
                        >
                            <CheckCheck size={19} />
                            Mark All as Read
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div
                            role="alert"
                            className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg"
                        >
                            <AlertCircle size={20} className="shrink-0 mt-0.5" />
                            <p className="text-sm break-words">{error}</p>
                        </div>
                    )}

                    {/* Notification Statistics */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
                        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5">
                            <div className="flex items-center gap-3">
                                <Bell className="text-blue-600 shrink-0" size={22} />
                                <div className="min-w-0">
                                    <p className="text-xs sm:text-sm text-slate-500">
                                        Total Notifications
                                    </p>
                                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                                        {notifications.length}
                                    </h2>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="text-orange-500 shrink-0" size={22} />
                                <div className="min-w-0">
                                    <p className="text-xs sm:text-sm text-slate-500">
                                        Unread
                                    </p>
                                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                                        {unreadCount}
                                    </h2>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 col-span-2 lg:col-span-1">
                            <div className="flex items-center gap-3">
                                <CheckCircleIcon />
                                <div className="min-w-0">
                                    <p className="text-xs sm:text-sm text-slate-500">
                                        Read
                                    </p>
                                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                                        {notifications.length - unreadCount}
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h2 className="font-bold text-slate-900">
                                Your Notifications
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Review your latest updates.
                            </p>
                        </div>

                        <div className="grid grid-cols-3 sm:flex gap-2 w-full sm:w-auto">
                            {["all", "unread", "read"].map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => setFilter(option)}
                                    aria-pressed={filter === option}
                                    className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold capitalize transition ${
                                        filter === option
                                            ? "bg-blue-600 text-white"
                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Notification List */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        {loading ? (
                            <div className="flex justify-center items-center py-16 text-slate-500">
                                <RefreshCw
                                    className="animate-spin mr-2 shrink-0"
                                    size={20}
                                />
                                Loading notifications...
                            </div>
                        ) : filteredNotifications.length === 0 ? (
                            <div className="text-center py-14 sm:py-16 px-5">
                                <Bell
                                    size={42}
                                    className="mx-auto text-slate-300 mb-4"
                                />
                                <h3 className="text-lg font-bold text-slate-800">
                                    No notifications found
                                </h3>
                                <p className="text-sm sm:text-base text-slate-500 mt-2">
                                    Your shipment updates will appear here.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {filteredNotifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 ${
                                            !notification.is_read
                                                ? "bg-blue-50/50"
                                                : ""
                                        }`}
                                    >
                                        <div className="flex items-start gap-3 min-w-0 flex-1">
                                            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                                <Package size={21} />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="font-bold text-sm sm:text-base text-slate-900 break-words">
                                                        {notification.title}
                                                    </h3>

                                                    {!notification.is_read && (
                                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold shrink-0">
                                                            New
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="text-sm sm:text-base text-slate-600 mt-2 break-words whitespace-pre-wrap">
                                                    {notification.message}
                                                </p>

                                                <p className="text-xs text-slate-400 mt-3 break-words">
                                                    {formatDate(notification.created_at)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Notification Actions */}
                                        <div className="flex items-center gap-2 pl-12 sm:pl-0 shrink-0">
                                            {!notification.is_read && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        markAsRead(notification.id)
                                                    }
                                                    title="Mark as read"
                                                    aria-label="Mark notification as read"
                                                    className="p-2.5 rounded-lg text-blue-600 hover:bg-blue-100 transition"
                                                >
                                                    <Check size={19} />
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    deleteNotification(notification.id)
                                                }
                                                title="Delete notification"
                                                aria-label="Delete notification"
                                                className="p-2.5 rounded-lg text-red-500 hover:bg-red-50 transition"
                                            >
                                                <Trash2 size={19} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
}

function CheckCircleIcon() {
    return <CheckCheck className="text-green-600 shrink-0" size={22} />;
}

export default Notifications;
