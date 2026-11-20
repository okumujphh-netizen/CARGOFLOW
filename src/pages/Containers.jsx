import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Sidebar from "../components/Sidebar";
import {
    Container,
    Search,
    RefreshCw,
    Trash2,
    Plus,
    Edit,
    AlertCircle,
    X,
} from "lucide-react";


function Containers() {
    const [containers, setContainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

  const emptyForm = {
    container_number: "",
    container_type: "",
    capacity: "",
    status: "available",
  };


  const [form, setForm] = useState(emptyForm);

  const statuses = ["available", "assigned", "maintenance"];

  const fetchContainers = async () => {
    setLoading(true);
    setError("");

     const { data, error: fetchError } = await supabase
      .from("containers")
      .select("*")
      .order("container_number", { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setContainers(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchContainers();
  }, []);


  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError("");
    setSuccess("");
  };


  const openEditForm = (item) => {
    setForm({
      container_number: item.container_number || "",
      container_type: item.container_type || "",
      capacity: item.capacity ?? "",
      status: item.status || "available",
    });

     setEditingId(item.id);
    setShowForm(true);
    setError("");
    setSuccess("");
  };


  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const saveContainer = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.container_number.trim() ||
      !form.container_type.trim() ||
      form.capacity === "" ||
      Number(form.capacity) <= 0
    ) {
      setError("Please provide a container number, type and valid capacity.");
      return;
    }

    setSaving(true);

    const containerData = {
      container_number: form.container_number.trim(),
      container_type: form.container_type.trim(),
      capacity: Number(form.capacity),
      status: form.status,
    };

    let result;

    if (editingId) {
      result = await supabase
        .from("containers")
        .update(containerData)
        .eq("id", editingId);

        } else {
      result = await supabase
        .from("containers")
        .insert([containerData]);
    }

    if (result.error) {
      setError(result.error.message);
    } else {
      setSuccess(
        editingId
          ? "Container updated successfully."
          : "Container added successfully."
      );

      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);

      await fetchContainers();
    }

    setSaving(false);
  };

  const updateStatus = async (containerId, newStatus) => {
    setError("");
    setSuccess("");

    const { error: updateError } = await supabase
      .from("containers")
      .update({ status: newStatus })
      .eq("id", containerId);

      if (updateError) {
      setError(updateError.message);
    } else {
      setContainers((previous) =>
        previous.map((item) =>
          item.id === containerId
            ? { ...item, status: newStatus }
            : item
        )
      );

      setSuccess("Container status updated successfully.");
    }
  };


  const deleteContainer = async (item) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete container ${item.container_number}?`
    );

    if (!confirmed) return;

    setDeletingId(item.id);
    setError("");
    setSuccess("");

    const { error: deleteError } = await supabase
      .from("containers")
      .delete()
      .eq("id", item.id);

      if (deleteError) {
      setError(deleteError.message);
    } else {
      setContainers((previous) =>
        previous.filter((container) => container.id !== item.id)
      );

      setSuccess("Container deleted successfully.");
    }

    setDeletingId(null);
  };


  const filteredContainers = containers.filter((item) => {
    const searchText = [
      item.container_number,
      item.container_type,
      item.capacity,
      item.status,
    ]
      .join(" ")
      .toLowerCase();

    return searchText.includes(search.toLowerCase());
  });

  const getStatusStyle = (status) => {
    const styles = {
      available: "bg-green-100 text-green-700",
      assigned: "bg-blue-100 text-blue-700",
      maintenance: "bg-yellow-100 text-yellow-700",
    };

    return styles[status] || "bg-gray-100 text-gray-700";
  };

  


}

