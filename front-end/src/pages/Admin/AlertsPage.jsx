import { useState, useEffect } from "react";
import axios from "axios";
import {
  Bell,
  Search,
  X,
  Plus,
  Clock3,
  Users,
  CheckCircle2,
  AlertTriangle,
  Megaphone,
  Droplets,
  Pencil,
  Trash2,
} from "lucide-react";

const AlertsPage = () => {
  // Core UI States
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({
    active: 0,
    scheduled: 0,
    completed: 0,
    notified: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal Control States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlertId, setEditingAlertId] = useState(null); // Track if we are editing
  const [deleteTarget, setDeleteTarget] = useState(null); // Tracks the alert selected for deletion

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "Emergency",
    blood: "O+",
    priority: "Medium",
    status: "Active",
    date: "",
    time: "",
  });

  // ==========================================
  // FETCH DATA STREAM
  // ==========================================
  const fetchAlertsData = async () => {
    try {
      setLoading(true);
      let url = `http://localhost:5000/api/alerts?search=${searchQuery}`;
      if (selectedType) url += `&type=${selectedType}`;

      const [alertsRes, statsRes] = await Promise.all([
        axios.get(url),
        axios.get("http://localhost:5000/api/alerts/stats"),
      ]);

      if (alertsRes.data.success) setAlerts(alertsRes.data.alerts);
      if (statsRes.data.success) setStats(statsRes.data.stats);
    } catch (error) {
      console.error("Error linking database streams:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchAlertsData();
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedType]);

  // ==========================================
  // INPUT FORM & SUBMIT LOGIC
  // ==========================================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenCreateModal = () => {
    setEditingAlertId(null); // Reset edit context
    setFormData({
      title: "",
      message: "",
      type: "Emergency",
      blood: "O+",
      priority: "Medium",
      status: "Active",
      date: "",
      time: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (alert) => {
    setEditingAlertId(alert._id);

    let rawDate = "";
    if (alert.date) {
      const parsed = new Date(alert.date);
      if (!isNaN(parsed)) rawDate = parsed.toISOString().split("T")[0];
    }

    setFormData({
      title: alert.title,
      message: alert.message,
      type: alert.type,
      blood: alert.blood,
      priority: alert.priority,
      status: alert.status,
      date: rawDate,
      time: "", // Clear time field to let admin update clean timestamp frames explicitly
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...formData,
        date: new Date(formData.date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        time: format12HourTime(formData.time) || "12:00 PM",
      };

      if (editingAlertId) {
        await axios.put(
          `http://localhost:5000/api/alerts/${editingAlertId}`,
          formattedData,
        );
      } else {
        await axios.post("http://localhost:5000/api/alerts", formattedData);
      }

      setIsModalOpen(false);
      fetchAlertsData();
    } catch (error) {
      console.error("Failed to commit notification dispatch:", error);
    }
  };

  // ==========================================
  // DELETE OPERATION PIPELINE
  // ==========================================
  const triggerDeleteConfirmation = (alert) => {
    setDeleteTarget(alert);
  };

  const executeDeleteAction = async () => {
    if (!deleteTarget) return;
    try {
      setLoading(true);
      const res = await axios.delete(
        `http://localhost:5000/api/alerts/${deleteTarget._id}`
      );
      if (res.data.success) {
        setDeleteTarget(null);
        fetchAlertsData(); // Synchronized database reload
      }
    } catch (error) {
      console.error("Error trying to strip document ID target:", error);
    } finally {
      setLoading(false);
    }
  };

  const format12HourTime = (timeString) => {
    if (!timeString) return "";
    let [hours, minutes] = timeString.split(":");
    hours = parseInt(hours);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  return (
    <div className="space-y-6 relative">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-red-50 text-red-700 shadow-sm">
            <Bell size={30} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Alerts
            </h1>
            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Manage blood alerts and notifications
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm sm:w-[320px]">
            <Search size={20} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-full w-full bg-transparent text-sm outline-none"
            />
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-red-700 to-red-600 px-6 text-sm font-bold text-white shadow-lg shadow-red-200 transition duration-300 hover:scale-[1.02]"
          >
            <Plus size={18} />
            Create Alert
          </button>
        </div>
      </div>

      {/* STATS DECK */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Active Alerts</p>
              <h2 className="mt-3 text-4xl font-black text-slate-900">
                {stats.active}
              </h2>
              <p className="mt-2 text-sm font-semibold text-red-600">
                Currently active
              </p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-700">
              <Bell size={30} />
            </div>
          </div>
        </div>

        <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Scheduled</p>
              <h2 className="mt-3 text-4xl font-black text-slate-900">
                {stats.scheduled}
              </h2>
              <p className="mt-2 text-sm font-semibold text-orange-600">
                Upcoming alerts
              </p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-600">
              <Clock3 size={30} />
            </div>
          </div>
        </div>

        <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Completed</p>
              <h2 className="mt-3 text-4xl font-black text-slate-900">
                {stats.completed}
              </h2>
              <p className="mt-2 text-sm font-semibold text-green-600">
                Processed runs
              </p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
              <CheckCircle2 size={30} />
            </div>
          </div>
        </div>

        <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">People Notified</p>
              <h2 className="mt-3 text-4xl font-black text-slate-900">
                {stats.notified >= 1000
                  ? `${(stats.notified / 1000).toFixed(1)}K`
                  : stats.notified}
              </h2>
              <p className="mt-2 text-sm font-semibold text-blue-600">
                Through platform
              </p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-700">
              <Users size={30} />
            </div>
          </div>
        </div>
      </div>

      {/* CONTROL TABLE STRUCTURE */}
      <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-5 border-b border-slate-200 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">All Alerts</h2>
            <p className="mt-1 text-sm text-slate-500">
              View and manage all blood alerts
            </p>
          </div>
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="flex h-14 items-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 outline-none transition duration-300 hover:bg-slate-50"
            >
              <option value="">All Types</option>
              <option value="Emergency">Emergency</option>
              <option value="Camp">Camp</option>
              <option value="System">System</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center font-bold text-slate-500">
            Syncing Live Data...
          </div>
        ) : alerts.length === 0 ? (
          <div className="p-10 text-center font-bold text-slate-400">
            No active alerts matched your description.
          </div>
        ) : (
          <>
            {/* MOBILE LAYER CARDS */}
            <div className="grid gap-5 p-5 lg:hidden">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-red-700 to-red-600 text-white">
                        <Bell size={22} />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900">
                          {alert.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {alert.message}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* MOBILE ACTIONS */}
                  <div className="mt-4 flex items-center justify-end gap-3 border-t border-slate-100 pt-3">
                    <button
                      onClick={() => handleOpenEditModal(alert)}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-blue-600 hover:bg-blue-50 transition"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => triggerDeleteConfirmation(alert)}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP TABLE SHEET */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left">
                    <th className="px-6 py-5 text-sm font-black text-slate-600">
                      Alert Details
                    </th>
                    <th className="px-6 py-5 text-sm font-black text-slate-600">
                      Type
                    </th>
                    <th className="px-6 py-5 text-sm font-black text-slate-600">
                      Blood Group
                    </th>
                    <th className="px-6 py-5 text-sm font-black text-slate-600">
                      Priority
                    </th>
                    <th className="px-6 py-5 text-sm font-black text-slate-600">
                      Status
                    </th>
                    <th className="px-6 py-5 text-sm font-black text-slate-600">
                      Created On
                    </th>
                    <th className="px-6 py-5 text-sm font-black text-slate-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {alerts.map((alert, index) => (
                    <tr
                      key={index}
                      className="border-b border-slate-100 transition duration-300 hover:bg-slate-50"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-start gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-red-700 to-red-600 text-white">
                            {alert.type === "Emergency" ? (
                              <AlertTriangle size={22} />
                            ) : alert.type === "Camp" ? (
                              <Megaphone size={22} />
                            ) : (
                              <Droplets size={22} />
                            )}
                          </div>
                          <div>
                            <h3 className="font-black text-slate-900">
                              {alert.title}
                            </h3>
                            <p className="mt-2 max-w-[320px] text-sm leading-6 text-slate-500">
                              {alert.message}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="rounded-2xl bg-red-50 px-4 py-2 text-xs font-black text-red-700">
                          {alert.type}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="rounded-2xl bg-red-50 px-4 py-2 text-sm font-black text-red-700">
                          {alert.blood}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`rounded-2xl px-4 py-2 text-xs font-black ${alert.priority === "High" ? "bg-red-50 text-red-700" : "bg-orange-50 text-orange-700"}`}
                        >
                          {alert.priority}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`rounded-2xl px-4 py-2 text-xs font-black ${alert.status === "Active" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}`}
                        >
                          {alert.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-semibold text-slate-700">
                            {alert.date}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {alert.time}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleOpenEditModal(alert)}
                            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-blue-600 hover:bg-blue-50 transition"
                            title="Edit Alert"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            onClick={() => triggerDeleteConfirmation(alert)}
                            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition"
                            title="Delete Alert"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* FORM MODAL POPUP FOR CREATE / EDIT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-[32px] bg-white p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-xl font-black text-slate-900">
                {editingAlertId
                  ? "Modify Broadcast Details"
                  : "Create New Broadcast Alert"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider">
                  Alert Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-red-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider">
                  Detailed Message
                </label>
                <textarea
                  name="message"
                  required
                  rows="3"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none focus:border-red-500 focus:bg-white transition resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider">
                    Alert Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-red-500 focus:bg-white transition"
                  >
                    <option value="Emergency">Emergency</option>
                    <option value="Camp">Camp</option>
                    <option value="System">System</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider">
                    Target Blood Group
                  </label>
                  <select
                    name="blood"
                    value={formData.blood}
                    onChange={handleInputChange}
                    className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-red-500 focus:bg-white transition"
                  >
                    <option value="All">All Groups</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider">
                    Priority Scale
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-red-500 focus:bg-white transition"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider">
                    Current Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-red-500 focus:bg-white transition"
                  >
                    <option value="Active">Active</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider">
                    Target Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleInputChange}
                    className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-red-500 focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider">
                    Target Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    required
                    value={formData.time}
                    onChange={handleInputChange}
                    className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-red-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-12 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-12 rounded-xl bg-gradient-to-r from-red-700 to-red-600 px-6 text-sm font-bold text-white shadow-lg shadow-red-200"
                >
                  {editingAlertId ? "Save Changes" : "Launch & Broadcast"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM DELETION CONFIRMATION MODAL LAYER */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[32px] bg-white p-6 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 mb-4">
              <AlertTriangle size={28} />
            </div>
            
            <h3 className="text-xl font-black text-slate-900">
              Delete Broadcast Notification?
            </h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Are you sure you want to permanently remove <span className="font-bold text-slate-800">"{deleteTarget.title}"</span>? This action deployment cannot be reversed down the pipeline.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="h-12 w-full rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                No, Keep It
              </button>
              <button
                type="button"
                onClick={executeDeleteAction}
                className="h-12 w-full rounded-xl bg-red-600 text-sm font-bold text-white shadow-lg shadow-red-200 hover:bg-red-700 transition"
              >
                Yes, Delete Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertsPage;