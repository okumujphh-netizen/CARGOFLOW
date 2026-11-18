
import { useState } from "react";
import {
  Package,
  Truck,
  Users,
  DollarSign,
  Search,
  Bell,
  ArrowUpRight,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function AdminDashboard() {
  const [search, setSearch] = useState("");

  const shipments = [
    {
      id: "CF-2026-001",
      customer: "John Mwangi",
      origin: "Mombasa, Kenya",
      destination: "Dubai, UAE",
      date: "18 Nov 2026",
      status: "In Transit",
    },
    {
      id: "CF-2026-002",
      customer: "Sarah Wanjiku",
      origin: "Shanghai, China",
      destination: "Nairobi, Kenya",
      date: "17 Nov 2026",
      status: "Delivered",
    },
    {
      id: "CF-2026-003",
      customer: "David Kamau",
      origin: "London, UK",
      destination: "Mombasa, Kenya",
      date: "16 Nov 2026",
      status: "Pending",
    },
    {
      id: "CF-2026-004",
      customer: "Mary Achieng",
      origin: "New York, USA",
      destination: "Nairobi, Kenya",
      date: "15 Nov 2026",
      status: "In Transit",
    },
  ];

  const filteredShipments = shipments.filter((shipment) =>
    shipment.id.toLowerCase().includes(search.toLowerCase()) ||
    shipment.customer.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    {
      title: "Total Shipments",
      value: "248",
      change: "+12% this month",
      icon: Package,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Active Shipments",
      value: "86",
      change: "Currently in transit",
      icon: Truck,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Total Customers",
      value: "124",
      change: "+8 new customers",
      icon: Users,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Total Revenue",
      value: "$48,250",
      change: "+15% this month",
      icon: DollarSign,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  const activities = [
    {
      title: "New shipment registered",
      description: "CF-2026-005 was created",
      time: "10 minutes ago",
      icon: Package,
    },
    {
      title: "Shipment delivered",
      description: "CF-2026-002 reached Nairobi",
      time: "1 hour ago",
      icon: CheckCircle,
    },
    {
      title: "Shipment delayed",
      description: "CF-2026-003 requires attention",
      time: "3 hours ago",
      icon: AlertCircle,
    },
  ];

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
            <button className="relative p-3 bg-white rounded-xl shadow-sm text-slate-600">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                A
              </div>
              <div>
                <p className="font-semibold text-slate-800">Administrator</p>
                <p className="text-xs text-slate-500">System Manager</p>
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
                  <ArrowUpRight className="text-slate-400" size={20} />
                </div>

                <p className="text-sm text-slate-500">{stat.title}</p>
                <h2 className="text-2xl font-bold text-slate-800 mt-1">
                  {stat.value}
                </h2>
                <p className="text-xs text-slate-500 mt-2">{stat.change}</p>
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
                  Overview of recently registered shipments
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
                        {shipment.id}
                      </td>
                      <td className="py-4 text-slate-700">
                        {shipment.customer}
                      </td>
                      <td className="py-4 text-slate-600">
                        {shipment.origin} → {shipment.destination}
                      </td>
                      <td className="py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            shipment.status === "Delivered"
                              ? "bg-green-100 text-green-700"
                              : shipment.status === "In Transit"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {shipment.status}
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
          </div>

          {/* Recent activity */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-800">
              Recent Activity
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Latest system updates
            </p>

            <div className="space-y-6">
              {activities.map((activity, index) => {
                const Icon = activity.icon;

                return (
                  <div key={index} className="flex gap-3">
                    <div className="bg-blue-100 text-blue-600 p-2 rounded-lg h-fit">
                      <Icon size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {activity.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {activity.description}
                      </p>
                      <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                        <Clock size={12} />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-6">
          CargoFlow Admin Portal · Dashboard data is currently sample data.
        </p>
      </main>
    </div>
  );
}

export default AdminDashboard;
