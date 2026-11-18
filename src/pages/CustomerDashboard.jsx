import { useState } from "react";
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

function CustomerDashboard() {
    const [search, setSearch] = useState("");


    const shipments = [
        {
            id: "CF-2026-001",
            origin: "Mombasa, Kenya",
            destination: "Dubai, UAE",
            date: "12 Nov 2026",
            status: "In Transit",
        },
        {
            id: "CF-2026-002",
            origin: "Shanghai, China",
            destination: "Mombasa, Kenya",
            date: "10 Nov 2026",
            status: "Delivered",
        },
        {
            id: "CF-2026-003",
            origin: "London, UK",
            destination: "Nairobi, Kenya",
            date: "15 Nov 2026",
            status: "Pending",
        },
        {
            id: "CF-2026-004",
            origin: "New York, USA",
            destination: "Mombasa, Kenya",
            date: "16 Nov 2026",
            status: "In Transit",
        },
    ];

    const filteredShipments = shipments.filter((shipment) =>
        shipment.id.toLowerCase().includes(search.toLowerCase())
    );


    const stats = [


        {
            title: "Total Shipments",
            value: "12",
            icon: Package,
            color: "bg-blue-100 text-blue-600",
        },
        {
            title: "In Transit",
            value: "4",
            icon: Truck,
            color: "bg-orange-100 text-orange-600",
        },
        {
            title: "Delivered",
            value: "6",
            icon: CheckCircle,
            color: "bg-green-100 text-green-600",
        },
        {
            title: "Pending",
            value: "2",
            icon: Clock,
            color: "bg-purple-100 text-purple-600",
        },
    ]

    return (
        <div className="flex min-h-screen bg-slate-100">

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-8 overflow-x-hidden">

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
                                JD
                            </div>

                            <div>
                                <p className="font-semibold text-slate-800 text-sm">
                                    John Doe
                                </p>
                                <p className="text-xs text-slate-500">
                                    Customer
                                </p>
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

                {/* Statistics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">


                    {stats.map((stat, index) => {
                        const Icon = stat.icon;

                        return (
                            <div
                                key={index}
                                className="bg-white p-5 rounded-xl shadow-sm border border-slate-200"
                            >
                                <div className="flex items-center justify-between">

                                    <div>
                                        <p className="text-slate-500 text-sm">
                                            {stat.title}
                                        </p>

                                        <h3 className="text-3xl font-bold text-slate-900 mt-2">
                                            {stat.value}
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

                                {filteredShipments.map((shipment) => (

                                    <tr key={shipment.id} className="hover:bg-slate-50">

                                        <td className="px-6 py-4 font-semibold text-slate-800">
                                            {shipment.id}
                                        </td>

                                        <td className="px-6 py-4 text-slate-600 text-sm">
                                            {shipment.origin}
                                        </td>

                                        <td className="px-6 py-4 text-slate-600 text-sm">
                                            {shipment.destination}
                                        </td>

                                        <td className="px-6 py-4 text-slate-600 text-sm">
                                            {shipment.date}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${shipment.status === "Delivered"
                                                        ? "bg-green-100 text-green-700"
                                                        : shipment.status === "In Transit"
                                                            ? "bg-orange-100 text-orange-700"
                                                            : "bg-purple-100 text-purple-700"
                                                    }`}
                                            >
                                                {shipment.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <button className="text-teal-600 hover:text-teal-800">
                                                <ArrowUpRight size={20} />
                                            </button>
                                        </td>

                                    </tr>

                                ))}

                                {filteredShipments.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center py-8 text-slate-500">
                                            No shipments found.
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






