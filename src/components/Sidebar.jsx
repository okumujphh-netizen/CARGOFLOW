

import { useState } from "react";

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
  Menu,
  X,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

function Sidebar({ role = "customer" }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const customerMenu = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "My Shipments", path: "/shipments", icon: Package },
    { name: "Book Shipment", path: "/book-shipment", icon: PlusCircle },
    { name: "Track Shipment", path: "/track-shipment", icon: Search },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  const adminMenu = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Shipments", path: "/admin/shipments", icon: Package },
    { name: "Containers", path: "/containers", icon: Container },
    { name: "Transportation", path: "/transportation", icon: Truck },
    { name: "Customers", path: "/customers", icon: Users },
    { name: "Settings", path: "/settings", icon: Settings },
  ];
  const menuItems = role === "admin" ? adminMenu : customerMenu;

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-slate-950 text-white p-3 rounded-lg shadow-lg"
        aria-label="Open navigation menu"
      >
        <Menu size={22} />
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          bg-slate-950 text-white w-64 min-h-screen flex flex-col p-5 shrink-0
          fixed md:sticky top-0 left-0 z-50
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Logo and close button */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Ship size={24} />
            </div>

            <span className="text-xl font-bold">
              Cargo<span className="text-blue-500">Flow</span>
            </span>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
            aria-label="Close navigation menu"
          >
            <X size={22} />
          </button>
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
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive
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
    </>
  );
}

export default Sidebar;
