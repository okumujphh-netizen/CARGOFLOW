
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Package, Ship } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { supabase } from "../lib/supabase";

function BookShipment() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    cargo_description: "",
    estimated_delivery: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("Please sign in before booking a shipment.");
      }

      const trackingNumber = `CF-${new Date().getFullYear()}-${crypto.randomUUID()
        .slice(0, 8)
        .toUpperCase()}`;

      const { error: bookingError } = await supabase
        .from("shipments")
        .insert([
          {
            customer_id: user.id,
            tracking_number: trackingNumber,
            origin: formData.origin.trim(),
            destination: formData.destination.trim(),
            cargo_description: formData.cargo_description.trim(),
            status: "pending",
            booking_date: new Date().toISOString().split("T")[0],
            estimated_delivery: formData.estimated_delivery || null,
          },
        ]);

      if (bookingError) {
        throw bookingError;
      }

      setSuccess(
        `Your shipment booking was successful! Tracking number: ${trackingNumber}`
      );

      setFormData({
        origin: "",
        destination: "",
        cargo_description: "",
        estimated_delivery: "",
      });
    } catch (err) {
      setError(err.message || "Unable to book your shipment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role="customer" />

      <main className="flex-1 min-w-0 p-4 pt-20 md:p-8 md:pt-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-600 mb-6"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-teal-100 text-teal-700 p-3 rounded-xl">
                <Package size={26} />
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                  Book a Shipment
                </h1>
                <p className="text-slate-500 text-sm">
                  Submit your cargo shipping request.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6">
                {success}
                <div className="mt-3">
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="font-semibold underline"
                  >
                    Return to Dashboard
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Shipment Origin
                </label>
                <input
                  type="text"
                  name="origin"
                  value={formData.origin}
                  onChange={handleChange}
                  placeholder="e.g. Mombasa, Kenya"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Shipment Destination
                </label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  placeholder="e.g. Dubai, UAE"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Cargo Description
                </label>
                <textarea
                  name="cargo_description"
                  value={formData.cargo_description}
                  onChange={handleChange}
                  placeholder="Describe the cargo you want to ship..."
                  rows="4"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Expected Delivery Date
                </label>
                <input
                  type="date"
                  name="estimated_delivery"
                  value={formData.estimated_delivery}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Optional. Your delivery estimate will be subject to confirmation.
                </p>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition"
                >
                  <Ship size={19} />
                  {loading ? "Submitting Booking..." : "Submit Shipment Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default BookShipment;


