
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

            <main className="flex-1 min-w-0 p-6 md:p-10">
                <div className="max-w-7xl mx-auto">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                                Notifications
                            </h1>
                            <p className="text-slate-500 mt-2">
                                Stay updated on your shipments and bookings.
                            </p>
                        </div>

                        <button
                            onClick={markAllAsRead}
                            disabled={unreadCount === 0}
                            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-5 py-3 rounded-lg font-semibold transition"
                        >
                            <CheckCheck size={19} />
                            Mark All as Read
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                            <AlertCircle size={20} />
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-xl shadow-sm p-5">
                            <div className="flex items-center gap-3">
                                <Bell className="text-blue-600" size={24} />
                                <div>
                                    <p className="text-sm text-slate-500">Total Notifications</p>
                                    <h2 className="text-2xl font-bold text-slate-900">
                                        {notifications.length}
                                    </h2>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-5">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="text-orange-500" size={24} />
                                <div>
                                    <p className="text-sm text-slate-500">Unread</p>
                                    <h2 className="text-2xl font-bold text-slate-900">
                                        {unreadCount}
                                    </h2>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-5">
                            <div className="flex items-center gap-3">
                                <CheckCircleIcon />
                                <div>
                                    <p className="text-sm text-slate-500">Read</p>
                                    <h2 className="text-2xl font-bold text-slate-900">
                                        {notifications.length - unreadCount}
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h2 className="font-bold text-slate-900">Your Notifications</h2>
                            <p className="text-sm text-slate-500">
                                Review your latest updates.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {["all", "unread", "read"].map((option) => (
                                <button
                                    key={option}
                                    onClick={() => setFilter(option)}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition ${
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

                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        {loading ? (
                            <div className="flex justify-center items-center py-16 text-slate-500">
                                <RefreshCw className="animate-spin mr-2" size={20} />
                                Loading notifications...
                            </div>
                        ) : filteredNotifications.length === 0 ? (
                            <div className="text-center py-16 px-6">
                                <Bell size={45} className="mx-auto text-slate-300 mb-4" />
                                <h3 className="text-lg font-bold text-slate-800">
                                    No notifications found
                                </h3>
                                <p className="text-slate-500 mt-2">
                                    Your shipment updates will appear here.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {filteredNotifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-5 flex flex-col sm:flex-row sm:items-start gap-4 ${
                                            !notification.is_read ? "bg-blue-50/50" : ""
                                        }`}
                                    >
                                        <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                            <Package size={21} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="font-bold text-slate-900">
                                                    {notification.title}
                                                </h3>

                                                {!notification.is_read && (
                                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                                                        New
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-slate-600 mt-2">
                                                {notification.message}
                                            </p>

                                            <p className="text-xs text-slate-400 mt-3">
                                                {formatDate(notification.created_at)}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {!notification.is_read && (
                                                <button
                                                    onClick={() => markAsRead(notification.id)}
                                                    title="Mark as read"
                                                    className="p-2 rounded-lg text-blue-600 hover:bg-blue-100"
                                                >
                                                    <Check size={19} />
                                                </button>
                                            )}

                                            <button
                                                onClick={() => deleteNotification(notification.id)}
                                                title="Delete notification"
                                                className="p-2 rounded-lg text-red-500 hover:bg-red-50"
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
    return <CheckCheck className="text-green-600" size={24} />;
}

export default Notifications;
