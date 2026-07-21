import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  CalendarDays,
  MapPin,
  Users,
  Pencil,
  Trash2,
  Filter,
  Clock3,
  CheckCircle2,
  Building2,
  X,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const initialFormData = {
  campName: "",
  campLocation: "",
  campDate: "",
  campTime: "",
  totalSlots: 150,
};

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

const getLocalDateKey = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date not available";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatTime = (value) => {
  if (!value) return "Time not available";
  if (/am|pm/i.test(value)) return value;

  const [hours, minutes] = value.split(":");
  if (!hours || !minutes) return value;

  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);

  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const getCampStatus = (campDate) => {
  const campKey = getLocalDateKey(campDate);
  const todayKey = getLocalDateKey(new Date());

  if (!campKey) return "Upcoming";
  if (campKey === todayKey) return "Active";

  return new Date(campDate) < new Date(new Date().setHours(0, 0, 0, 0))
    ? "Completed"
    : "Upcoming";
};

const statusStyles = {
  Upcoming: "bg-orange-50 text-orange-700 border-orange-200",
  Active: "bg-blue-50 text-blue-700 border-blue-200",
  Completed: "bg-green-50 text-green-700 border-green-200",
};

const CampsPage = () => {
  const navigate = useNavigate();
  const user = getStoredUser();

  const [openModal, setOpenModal] = useState(false);
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [formData, setFormData] = useState(initialFormData);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCampId, setSelectedCampId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCamps = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:5000/api/camps/all");
      setCamps(Array.isArray(data?.camps) ? data.camps : []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load camps");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role !== "admin") {
      toast.error("Admin access only");
      navigate("/", { replace: true });
      return;
    }
    fetchCamps();
  }, [navigate, user?.role]);

  const campsWithStatus = useMemo(() => {
    return camps.map((camp) => ({
      ...camp,
      status: getCampStatus(camp.campDate),
    }));
  }, [camps]);

  const filteredCamps = useMemo(() => {
    const query = search.trim().toLowerCase();

    return campsWithStatus.filter((camp) => {
      const matchesSearch =
        !query ||
        camp.campName?.toLowerCase().includes(query) ||
        camp.campLocation?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || camp.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [campsWithStatus, search, statusFilter]);

  const stats = useMemo(() => {
    const total = campsWithStatus.length;
    const upcoming = campsWithStatus.filter(
      (camp) => camp.status === "Upcoming",
    ).length;
    const active = campsWithStatus.filter(
      (camp) => camp.status === "Active",
    ).length;
    const completed = campsWithStatus.filter(
      (camp) => camp.status === "Completed",
    ).length;

    return { total, upcoming, active, completed };
  }, [campsWithStatus]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateCamp = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      return navigate("/login-donor");
    }

    try {
      setCreateLoading(true);
      const payload = {
        campName: formData.campName.trim(),
        campLocation: formData.campLocation.trim(),
        campDate: formData.campDate,
        campTime: formData.campTime,
        totalSlots: Number(formData.totalSlots) || 150,
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/camps/create",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success(data.message || "Camp created successfully");
      setFormData(initialFormData);
      setOpenModal(false);
      fetchCamps();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to create camp");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (!selectedCampId) {
        toast.error("Camp ID missing");
        return;
      }

      setDeleteLoading(true);
      const token = localStorage.getItem("token");

      const { data } = await axios.delete(
        `http://localhost:5000/api/camps/${selectedCampId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success(data.message || "Camp deleted successfully");
      setCamps((prev) => prev.filter((camp) => camp._id !== selectedCampId));
      setShowDeleteModal(false);
      setSelectedCampId(null);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to delete camp");
    } finally {
      setDeleteLoading(false);
    }
  };

  const previewCamps = filteredCamps.slice(0, 4);

  return (
    <>
      <div className="space-y-8 max-w-[1400px] mx-auto p-4 sm:p-6">
        {/* Top Header Row */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 sm:text-4xl tracking-tight">
              Camp Management System
            </h1>
            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              Organize, track, and deploy live donation operations globally.
            </p>
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="inline-flex h-13 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-700 to-red-600 px-6 font-bold text-white shadow-lg shadow-red-200 transition duration-300 hover:opacity-95 hover:scale-[1.01] self-start md:self-auto"
          >
            <Plus size={18} />
            Create Camp
          </button>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Campaigns"
            value={stats.total}
            icon={<Building2 size={22} />}
            color="red"
          />
          <StatsCard
            title="Upcoming Blocks"
            value={stats.upcoming}
            icon={<Clock3 size={22} />}
            color="orange"
          />
          <StatsCard
            title="Active Encampments"
            value={stats.active}
            icon={<CalendarDays size={22} />}
            color="blue"
          />
          <StatsCard
            title="Completed Runs"
            value={stats.completed}
            icon={<CheckCircle2 size={22} />}
            color="green"
          />
        </div>

        {/* Database Grid Layout */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Campaign Logs
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Showing recent database listings filtering system
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row items-stretch sm:items-center">
              <div className="flex h-12 items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 sm:w-[280px] focus-within:bg-white focus-within:ring-2 focus-within:ring-red-100 transition">
                <Search size={18} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search database..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="h-full w-full bg-transparent text-sm outline-none placeholder:text-slate-400 font-medium text-slate-700"
                />
              </div>

              <div className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 min-w-[150px]">
                <Filter size={16} className="text-slate-400 shrink-0" />
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="h-full w-full bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer"
                >
                  <option value="All">All Status</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <button
                onClick={() => navigate("/admin/camps/all")}
                className="inline-flex h-12 items-center justify-center gap-1.5 rounded-xl bg-red-50/70 px-4 text-xs font-black text-red-700 transition hover:bg-red-100/80 whitespace-nowrap"
              >
                View Full Database
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Conditional Layouts */}
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="inline-flex items-center gap-3 text-sm font-bold text-slate-500">
                <Loader2 size={20} className="animate-spin text-red-600" />
                Querying database clusters...
              </div>
            </div>
          ) : filteredCamps.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center p-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 text-slate-400">
                <CalendarDays size={24} />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-800">
                No records found
              </h3>
              <p className="mt-1 text-sm text-slate-400 max-w-xs">
                Try modifying your filter system choices or check spelling
                formats.
              </p>
            </div>
          ) : (
            <>
              {/* Responsive Cards (Mobile Viewports) */}
              <div className="grid gap-4 p-4 lg:hidden">
                {previewCamps.map((camp) => (
                  <div
                    key={camp._id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                          {camp.campName}
                        </h3>
                        <p className="text-xs font-mono text-slate-400 mt-0.5">
                          #{camp._id?.slice(-6)?.toUpperCase()}
                        </p>
                      </div>
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-0.5 text-2xs font-bold uppercase tracking-wider ${statusStyles[camp.status]}`}
                      >
                        {camp.status}
                      </span>
                    </div>

                    <div className="p-4 space-y-3.5">
                      <InfoTile
                        icon={<MapPin size={15} />}
                        iconClass="bg-red-50 text-red-700"
                        label="Location"
                        title={camp.campLocation}
                      />
                      <InfoTile
                        icon={<CalendarDays size={15} />}
                        iconClass="bg-blue-50 text-blue-700"
                        label="Schedule"
                        title={formatDate(camp.campDate)}
                        text={formatTime(camp.campTime)}
                      />
                      <InfoTile
                        icon={<Users size={15} />}
                        iconClass="bg-green-50 text-green-700"
                        label="Capacity Matrix"
                        title={`${camp.registered || 0} / ${camp.totalSlots} Slots Taken`}
                      />

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() =>
                            navigate(`/admin/camps/edit/${camp._id}`)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCampId(camp._id);
                            setShowDeleteModal(true);
                          }}
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Strict Dataset Table (Desktop Viewports) */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-bold uppercase tracking-wider text-slate-500">
                      <th className="px-6 py-4.5">Camp Summary</th>
                      <th className="px-6 py-4.5">Location Anchor</th>
                      <th className="px-6 py-4.5">Timestamps</th>
                      <th className="px-6 py-4.5 text-center">Limit Pool</th>
                      <th className="px-6 py-4.5 text-center">Registered</th>
                      <th className="px-6 py-4.5">Live Status</th>
                      <th className="px-6 py-4.5 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                    {previewCamps.map((camp) => (
                      <tr
                        key={camp._id}
                        className="group transition hover:bg-slate-50/50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3.5">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 transition group-hover:scale-105">
                              <Building2 size={18} />
                            </div>
                            <div>
                              <span className="block font-bold text-slate-900 line-clamp-1">
                                {camp.campName}
                              </span>
                              <span className="mt-0.5 block text-xs font-mono text-slate-400">
                                #{camp._id?.slice(-6)?.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <MapPin size={15} className="text-slate-400" />
                            {camp.campLocation}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <span className="block text-slate-800">
                              {formatDate(camp.campDate)}
                            </span>
                            <span className="block text-xs text-slate-400 font-normal mt-0.5">
                              {formatTime(camp.campTime)}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-center font-bold text-slate-800 whitespace-nowrap">
                          {camp.totalSlots} Max
                        </td>

                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50/50 text-blue-700 font-bold">
                            <Users size={13} />
                            {camp.registered || 0}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold ${statusStyles[camp.status]}`}
                          >
                            {camp.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() =>
                                navigate(`/admin/camps/edit/${camp._id}`)
                              }
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700 shadow-sm"
                            >
                              <Pencil size={14} />
                            </button>

                            <button
                              onClick={() => {
                                setSelectedCampId(camp._id);
                                setShowDeleteModal(true);
                              }}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 shadow-sm"
                            >
                              <Trash2 size={14} />
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
      </div>

      {/* Confirmation Modal Overlay */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl border border-slate-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <Trash2 size={22} />
            </div>

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              Purge Record confirmation
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Are you certain? This transaction deletes connected registration
              pipelines permanently.
            </p>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedCampId(null);
                }}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Abort
              </button>

              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-red-700 px-4 text-sm font-bold text-white transition hover:bg-red-800 disabled:opacity-50"
              >
                {deleteLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Confirm Erasure"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <AddCampModal
        open={openModal}
        setOpen={setOpenModal}
        formData={formData}
        onChange={handleFormChange}
        onSubmit={handleCreateCamp}
        loading={createLoading}
      />
    </>
  );
};

/* Modal Form Core Section */
const AddCampModal = ({
  open,
  setOpen,
  formData,
  onChange,
  onSubmit,
  loading,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-xl border border-slate-100">
        {/* Header Block */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Provision Camp Block
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Setup parameters for live viewing indexes
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-slate-600 transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Dynamic Inputs System */}
        <form
          onSubmit={onSubmit}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <InputField
                label="Camp Identifier Name"
                name="campName"
                value={formData.campName}
                onChange={onChange}
                placeholder="e.g. Red Cross Annual Drive"
                icon={<Building2 size={16} />}
                required
              />
              <InputField
                label="Geographic Location Anchor"
                name="campLocation"
                value={formData.campLocation}
                onChange={onChange}
                placeholder="City Complex or Arena"
                icon={<MapPin size={16} />}
                required
              />
              <InputField
                label="Target Calendar Date"
                name="campDate"
                type="date"
                value={formData.campDate}
                onChange={onChange}
                icon={<CalendarDays size={16} />}
                required
              />
              <InputField
                label="Operation Time-window"
                name="campTime"
                type="time"
                value={formData.campTime}
                onChange={onChange}
                icon={<Clock3 size={16} />}
                required
              />
            </div>

            <div className="border-t border-slate-100 pt-4">
              <InputField
                label="Total Maximum Slots Allocation"
                name="totalSlots"
                type="number"
                value={formData.totalSlots}
                onChange={onChange}
                placeholder="150"
                icon={<Users size={16} />}
                required
                min="1"
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-red-700 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-red-800 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Plus size={16} />
              )}
              {loading ? "Constructing..." : "Assemble Camp"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* Micro Functional Dynamic Modules */
const InputField = ({
  label,
  placeholder,
  type = "text",
  icon,
  name,
  value,
  onChange,
  required = false,
  min,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
        {label}
      </label>
      <div className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-100 transition duration-200">
        <div className="text-slate-400 shrink-0">{icon}</div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          min={min}
          required={required}
          placeholder={placeholder}
          className="h-full w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 font-medium"
        />
      </div>
    </div>
  );
};

const InfoTile = ({ icon, iconClass, label, title, text }) => {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50/70 border border-slate-100 p-3">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-3xs font-bold uppercase tracking-wider text-slate-400 leading-none">
          {label}
        </p>
        <h4 className="mt-1 text-xs font-bold text-slate-800 truncate">
          {title}
        </h4>
        {text && (
          <p className="text-2xs text-slate-400 mt-0.5 truncate">{text}</p>
        )}
      </div>
    </div>
  );
};

const StatsCard = ({ title, value, icon, color }) => {
  const colors = {
      red: "bg-red-50 text-red-600 border-red-100",
      orange: "bg-orange-50 text-orange-600 border-orange-100",
      blue: "bg-blue-50 text-blue-600 border-blue-100",
    },
    defaultColor = "bg-green-50 text-green-600 border-green-100";

  const selectedColor = colors[color] || defaultColor;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md duration-200">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            {value}
          </h2>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl border ${selectedColor}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default CampsPage;
