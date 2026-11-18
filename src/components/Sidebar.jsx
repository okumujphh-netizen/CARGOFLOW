
import {
  LayoutDashboard,
  Package,
  Container,
  Truck,
  Users,
  Settings,
  LogOut,
  Ship,
  PlusCircle,
  Search,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

function Sidebar({ role = "customer" }) {
  const navigate = useNavigate();

  const customerMenu = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Shipments",
      path: "/shipments",
      icon: Package,
    },
    {
      name: "Book Shipment",
      path: "/book-shipment",
      icon: PlusCircle,
    },
    {
      name: "Track Shipment",
      path: "/track-shipment",
      icon: Search,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  const adminMenu = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Shipments",
      path: "/shipments",
      icon: Package,
    },
    {
      name: "Containers",
      path: "/containers",
      icon: Container,
    },
    {
      name: "Transportation",
      path: "/transportation",
      icon: Truck,
    },
    {
      name: "Customers",
      path: "/customers",
      icon: Users,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  const menuItems = role === "admin" ? adminMenu : customerMenu;

  return (
    <aside className="bg-slate-950 text-white w-64 min-h-screen flex flex-col p-5 shrink-0">

      {/* Logo */}
      <div className="flex items-center gap-2 mb-10">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Ship size={24} />
        </div>

        <span className="text-xl font-bold">
          Cargo<span className="text-blue-500">Flow</span>
        </span>
      </div>

      {/* Account type */}
      <p className="text-xs uppercase tracking-wider text-slate-500 mb-4">
        {role === "admin" ? "Administration" : "Customer Portal"}
      </p>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/dashboard" || item.path === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={() => navigate("/login")}
        className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-red-600 hover:text-white rounded-lg transition"
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>

    </aside>
  );
}

export default Sidebar;

