import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  Building2,
  MapPin,
  Pencil,
  Trash2,
  ArrowLeft,
  Loader2,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const statusStyles = {
  Active: "bg-blue-50 text-blue-700 border border-blue-200",
  Upcoming: "bg-orange-50 text-orange-700 border border-orange-200",
  Completed: "bg-green-50 text-green-700 border border-green-200",
};

const ViewAllCamps = () => {
  const navigate = useNavigate();

  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchCamps = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:5000/api/camps/all");
      setCamps(data?.camps || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load camps");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCamps();
  }, []);

  const getCampStatus = (campDate) => {
    const date = new Date(campDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date.toDateString() === today.toDateString()) return "Active";
    if (date < today) return "Completed";
    return "Upcoming";
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this camp?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication required");
      return;
    }

    try {
      setDeletingId(id);
      await axios.delete(`http://localhost:5000/api/camps/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Camp deleted successfully");
      setCamps((prev) => prev.filter((camp) => camp._id !== id));
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to delete camp");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCamps = useMemo(() => {
    return camps.filter((camp) => {
      const status = getCampStatus(camp.campDate);
      const searchMatch =
        camp.campName?.toLowerCase().includes(search.toLowerCase()) ||
        camp.campLocation?.toLowerCase().includes(search.toLowerCase());

      const statusMatch = statusFilter === "All" || status === statusFilter;
      return searchMatch && statusMatch;
    });
  }, [camps, search, statusFilter]);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 sm:text-4xl tracking-tight">
            View All Camps
          </h1>
          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            Complete database management system for upcoming and past donation
            camps.
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/camps")}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 font-bold text-slate-700 shadow-sm transition duration-300 hover:bg-slate-50 self-start sm:self-auto"
        >
          <ArrowLeft size={18} />
          Dashboard
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
        <div className="flex h-14 flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/50 px-4 transition-within:border-red-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-red-100">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by camp name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-full w-full bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 min-w-[180px]">
          <Filter size={18} className="text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-full w-full bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Table Interface */}
      <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">Camp Details</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Schedule</th>
                <th className="px-6 py-4 text-center">Capacity</th>
                <th className="px-6 py-4 text-center">Registered</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-20 text-center text-slate-400">
                    <div className="inline-flex items-center gap-3 font-bold text-slate-500">
                      <Loader2
                        size={20}
                        className="animate-spin text-red-600"
                      />
                      Fetching real-time records...
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCamps.map((camp) => {
                  const status = getCampStatus(camp.campDate);

                  return (
                    <tr
                      key={camp._id}
                      className="group transition hover:bg-slate-50/60"
                    >
                      {/* Camp Name & ID */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 transition group-hover:scale-105">
                            <Building2 size={20} />
                          </div>
                          <div>
                            <span className="block font-black text-slate-900 line-clamp-1">
                              {camp.campName}
                            </span>
                            <span className="mt-0.5 block text-xs font-mono text-slate-400">
                              #{camp._id?.slice(-6)?.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <MapPin size={16} className="text-slate-400" />
                          {camp.campLocation}
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar size={15} className="text-slate-400" />
                          <div>
                            <span className="block text-slate-800">
                              {new Date(camp.campDate).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </span>
                            <span className="block text-xs text-slate-400 font-normal mt-0.5">
                              {camp.campTime}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Total Capacity */}
                      <td className="px-6 py-4 text-center font-bold text-slate-800">
                        {camp.totalSlots}
                      </td>

                      {/* Registered */}
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 font-bold text-slate-800">
                          {camp.registered || 0}
                        </span>
                      </td>

                      {/* Status pill */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${statusStyles[status] || "bg-slate-100 text-slate-700"}`}
                        >
                          {status}
                        </span>
                      </td>

                      {/* Action Menu */}
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              navigate(`/admin/camps/edit/${camp._id}`)
                            }
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition duration-200 hover:border-green-200 hover:bg-green-50 hover:text-green-700 shadow-sm"
                            title="Edit Camp"
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            onClick={() => handleDelete(camp._id)}
                            disabled={deletingId === camp._id}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-700 shadow-sm disabled:opacity-50"
                            title="Delete Camp"
                          >
                            {deletingId === camp._id ? (
                              <Loader2 size={15} className="animate-spin" />
                            ) : (
                              <Trash2 size={15} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Empty Boundary Screen */}
        {!loading && filteredCamps.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 border border-dashed border-slate-200 mb-4">
              <Building2 size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              No records to display
            </h3>
            <p className="mt-1 text-sm text-slate-400 max-w-xs mx-auto">
              We couldn't find any camps matching your combined keyword and
              status selectors.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAllCamps;
