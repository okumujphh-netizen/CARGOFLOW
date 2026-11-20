import { useEffect, useState } from "react";
import {
  Users,
  Search,
  RefreshCw,
  Package,
  Phone,
  Calendar,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import { supabase } from "../lib/supabase";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [expandedCustomer, setExpandedCustomer] = useState(null);

  const fetchCustomers = async () => {
    setLoading(true);
    setError("");

    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name, phone, role, created_at")
      .eq("role", "customer")
      .order("created_at", { ascending: false });

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    const { data: shipmentData, error: shipmentError } = await supabase
      .from("shipments")
      .select(
        "id, customer_id, tracking_number, origin, destination, status, booking_date, estimated_delivery"
      )
      .order("created_at", { ascending: false });

    if (shipmentError) {
      setError(shipmentError.message);
      setLoading(false);
      return;
    }

    setCustomers(profiles || []);
    setShipments(shipmentData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const getCustomerShipments = (customerId) => {
    return shipments.filter(
      (shipment) => shipment.customer_id === customerId
    );
  };

  const filteredCustomers = customers.filter((customer) => {
    const query = search.toLowerCase();

    return (
      (customer.full_name || "").toLowerCase().includes(query) ||
      (customer.phone || "").toLowerCase().includes(query) ||
      customer.id.toLowerCase().includes(query)
    );
  });

  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusStyle = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      confirmed: "bg-blue-100 text-blue-700",
      in_transit: "bg-purple-100 text-purple-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };

    return styles[status] || "bg-slate-100 text-slate-600";
  };

  const formatStatus = (status) => {
    return status
      ? status.replaceAll("_", " ").replace(/\b\w/g, (char) =>
          char.toUpperCase()
        )
      : "Unknown";
  };

  const totalCustomerShipments = shipments.length;

  const activeShipments = shipments.filter(
    (shipment) =>
      shipment.status === "confirmed" ||
      shipment.status === "in_transit"
  ).length;