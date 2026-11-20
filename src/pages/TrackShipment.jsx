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
}
