import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Clock3,
  Loader2,
  MapPin,
  Save,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const initialFormData = {
  campName: "",
  campLocation: "",
  campDate: "",
  campTime: "",
  totalSlots: 150,
  isActive: true,
};

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

const toDateInputValue = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const toTimeInputValue = (value = "") => {
  if (/^\d{2}:\d{2}$/.test(value)) return value;

  const match = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return "";

  let hours = Number(match[1]);
  const minutes = match[2];
  const period = match[3].toUpperCase();

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return `${String(hours).padStart(2, "0")}:${minutes}`;
};

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date not available";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
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

const getCampStatus = (campDate, isActive) => {
  if (!isActive) return "Hidden";

  const date = new Date(campDate);
  if (Number.isNaN(date.getTime())) return "Upcoming";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const campDay = new Date(date);
  campDay.setHours(0, 0, 0, 0);

  if (campDay.getTime() === today.getTime()) return "Active";
  if (campDay < today) return "Completed";
  return "Upcoming";
};

const statusStyles = {
  Upcoming: "bg-orange-50 text-orange-700 border-orange-200",
  Active: "bg-blue-50 text-blue-700 border-blue-200",
  Completed: "bg-green-50 text-green-700 border-green-200",
  Hidden: "bg-slate-100 text-slate-700 border-slate-200",
};

const EditCampPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = getStoredUser();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [registeredCount, setRegisteredCount] = useState(0);
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (user?.role !== "admin") {
      toast.error("Admin access only");
      navigate("/", { replace: true });
      return;
    }

    const fetchCamp = async () => {
      try {
        setLoading(true);

        const { data } = await axios.get("https://arogya-blood-center.onrender.com/api/camps/all");
        const camps = Array.isArray(data?.camps) ? data.camps : [];
        const camp = camps.find((item) => item._id.toString() === id.toString());

        if (!camp) {
          toast.error("Camp not found");
          navigate("/admin/camps", { replace: true });
          return;
        }

        setRegisteredCount(Number(camp.registered) || 0);

        setFormData({
          campName: camp.campName || "",
          campLocation: camp.campLocation || "",
          campDate: toDateInputValue(camp.campDate),
          campTime: toTimeInputValue(camp.campTime),
          totalSlots: Number(camp.totalSlots) || 150,
          isActive: camp.isActive ?? true,
        });
      } catch (error) {
        console.log(error);
        toast.error("Failed to load camp details");
        navigate("/admin/camps", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchCamp();
  }, [id, navigate, user?.role]);

  const status = useMemo(() => {
    return getCampStatus(formData.campDate, formData.isActive);
  }, [formData.campDate, formData.isActive]);

  const slotsLeft = Math.max(Number(formData.totalSlots || 0) - registeredCount, 0);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "totalSlots"
          ? value
          : name === "isActive"
            ? value === "true"
            : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      navigate("/login-donor");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        campName: formData.campName.trim(),
        campLocation: formData.campLocation.trim(),
        campDate: formData.campDate,
        campTime: formData.campTime,
        totalSlots: Number(formData.totalSlots) || 150,
        isActive: formData.isActive,
      };

      const { data } = await axios.put(
        `https://arogya-blood-center.onrender.com/api/camps/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(data.message || "Camp updated successfully");
      navigate("/admin/camps");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update camp");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <div className="inline-flex items-center gap-3 text-sm font-bold text-slate-500">
          <Loader2 size={18} className="animate-spin" />
          Loading camp details...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <button
            onClick={() => navigate("/admin/camps")}
            className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition duration-300 hover:bg-slate-50"
          >
            <ArrowLeft size={22} />
          </button>

          <div>
            <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">
              Edit Blood Camp
            </h1>
            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Update camp information, capacity, and visibility.
            </p>
          </div>
        </div>

        <button
          form="edit-camp-form"
          type="submit"
          disabled={saving}
          className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-red-700 to-red-600 px-6 text-sm font-bold text-white shadow-lg shadow-red-200 transition duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <form
          id="edit-camp-form"
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm"
        >
          <div className="border-b border-slate-200 bg-gradient-to-r from-red-700 to-red-600 p-6 text-white">
            <h2 className="text-3xl font-black">Camp Information</h2>
            <p className="mt-2 text-sm text-red-100">
              Update the core details that donors will see on the public camps page.
            </p>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <InputField
                label="Camp Name"
                name="campName"
                value={formData.campName}
                onChange={handleChange}
                placeholder="Mega Donation Camp"
                icon={<Building2 size={18} />}
                required
              />

              <InputField
                label="Location"
                name="campLocation"
                value={formData.campLocation}
                onChange={handleChange}
                placeholder="Ahmedabad"
                icon={<MapPin size={18} />}
                required
              />

              <InputField
                label="Date"
                name="campDate"
                type="date"
                value={formData.campDate}
                onChange={handleChange}
                icon={<CalendarDays size={18} />}
                required
              />

              <InputField
                label="Time"
                name="campTime"
                type="time"
                value={formData.campTime}
                onChange={handleChange}
                icon={<Clock3 size={18} />}
                required
              />

              <InputField
                label="Total Slots"
                name="totalSlots"
                type="number"
                value={formData.totalSlots}
                onChange={handleChange}
                placeholder="150"
                icon={<Users size={18} />}
                min="1"
                required
              />

              <SelectField
                label="Camp Visibility"
                name="isActive"
                value={String(formData.isActive)}
                onChange={handleChange}
                options={[
                  { value: "true", label: "Visible to donors" },
                  { value: "false", label: "Hidden from donors" },
                ]}
                icon={<ShieldCheck size={18} />}
              />
            </div>

            <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate("/admin/camps")}
                className="flex h-14 items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-700 transition duration-300 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-red-700 to-red-600 px-6 text-sm font-bold text-white shadow-lg shadow-red-200 transition duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>

        <aside className="space-y-5">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-700">
              <CalendarDays size={26} />
            </div>

            <h3 className="mt-5 text-xl font-black text-slate-900">Live Preview</h3>
            <p className="mt-2 text-sm text-slate-500">
              A quick view of the public-facing camp details.
            </p>

            <div className="mt-5 space-y-4">
              <PreviewRow
                label="Camp Name"
                value={formData.campName || "Camp name will appear here"}
              />
              <PreviewRow
                label="Location"
                value={formData.campLocation || "Location will appear here"}
              />
              <PreviewRow
                label="Date"
                value={formData.campDate ? formatDate(formData.campDate) : "Date not selected"}
              />
              <PreviewRow
                label="Time"
                value={formData.campTime ? formatTime(formData.campTime) : "Time not selected"}
              />
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-black text-slate-900">Camp Summary</h3>

            <div className="mt-5 space-y-4">
              <SummaryCard
                title="Current Status"
                value={status}
                chipClass={statusStyles[status]}
              />
              <SummaryCard title="Registered Donors" value={registeredCount} />
              <SummaryCard title="Slots Left" value={slotsLeft} />
              <SummaryCard title="Capacity" value={Number(formData.totalSlots) || 0} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

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
    <div>
      <label className="mb-3 block text-sm font-black text-slate-700">{label}</label>
      <div className="flex h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 transition duration-300 focus-within:border-red-500">
        <div className="text-slate-400">{icon}</div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          min={min}
          required={required}
          placeholder={placeholder}
          className="h-full w-full bg-transparent text-sm outline-none"
        />
      </div>
    </div>
  );
};

const SelectField = ({ label, name, value, onChange, options, icon }) => {
  return (
    <div>
      <label className="mb-3 block text-sm font-black text-slate-700">{label}</label>
      <div className="flex h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 transition duration-300 focus-within:border-red-500">
        <div className="text-slate-400">{icon}</div>
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="h-full w-full bg-transparent text-sm outline-none"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

const PreviewRow = ({ label, value }) => {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 font-black text-slate-900">{value}</p>
    </div>
  );
};

const SummaryCard = ({ title, value, chipClass }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{title}</p>
      {chipClass ? (
        <span className={`mt-3 inline-flex rounded-2xl border px-4 py-2 text-xs font-black ${chipClass}`}>
          {value}
        </span>
      ) : (
        <p className="mt-2 text-2xl font-black text-slate-900">{value}</p>
      )}
    </div>
  );
};

export default EditCampPage;