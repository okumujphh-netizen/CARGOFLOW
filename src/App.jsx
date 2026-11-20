
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDashboard from "./pages/CustomerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import BookShipment from "./pages/BookShipment";
import MyShipments from "./pages/myshipments";
import AdminShipments from "./pages/AdminShipments";
import Containers from "./pages/Containers";
import TrackShipment from "./pages/TrackShipment";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Customer Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRole="customer">
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/shipments"
        element={
          <ProtectedRoute allowedRole="customer">
            <MyShipments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/book-shipment"
        element={
          <ProtectedRoute allowedRole="customer">
            <BookShipment />
          </ProtectedRoute>
        }
      />

       <Route
        path="/track-shipment"
        element={
          <ProtectedRoute allowedRole="customer">
            <TrackShipment />
          </ProtectedRoute>
        }
      />

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/shipments"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminShipments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/containers"
        element={
          <ProtectedRoute allowedRole="admin">
            <Containers />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;



