import { useEffect, useState } from "react";
import {
  Search,
  Download,
  Plus,
  Pencil,
  Trash2,
  Phone,
  Mail,
  SlidersHorizontal,
  ChevronDown,
  UserCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import DeleteDonorModal from "../../components/Admin/Donors/DeleteDonorModal";

const ViewAllDonorsPage = () => {
  const navigate = useNavigate();

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [bloodFilter, setBloodFilter] = useState("");
  const [selectedDonorId, setSelectedDonorId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const { data } = await axios.get("http://localhost:5000/api/donors/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDonors(data?.donors || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load donors database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  const filteredDonors = donors.filter((donor) => {
    // Standardize field evaluations with safe fallbacks
    const nameStr = donor.fullName || donor.name || "";
    const emailStr = donor.email || "";
    const phoneStr = donor.phone || "";
    const bloodGroupStr = donor.bloodGroup || donor.blood || "";

    const searchMatch =
      nameStr.toLowerCase().includes(search.toLowerCase()) ||
      emailStr.toLowerCase().includes(search.toLowerCase()) ||
      phoneStr.includes(search);

    const bloodMatch = !bloodFilter || bloodGroupStr === bloodFilter;

    return searchMatch && bloodMatch;
  });

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      const token = localStorage.getItem("token");

      const { data } = await axios.delete(
        `http://localhost:5000/api/donors/delete/${selectedDonorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(data.message || "Donor record removed successfully");
      setShowDeleteModal(false);
      setSelectedDonorId(null);
      fetchDonors();
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to delete donor record",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-1 animate-fade-in">
      {/* ================= ACTIONS & ACTION CARDS LAYER ================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            View All Donors
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage, verify, filter, and track registered clinical blood donor
            history profiles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition duration-200 hover:bg-slate-50">
            <Download size={16} className="text-slate-500" />
            Export CSV
          </button>

          <button
            onClick={() => navigate("/admin/donors")}
            className="flex h-10 items-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-red-700"
          >
            <Plus size={16} />
            Add Donor
          </button>
        </div>
      </div>

      {/* ================= SEARCH & INTERACTIVE CONTROLS CONTAINER ================= */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 sm:flex-row sm:items-center">
        {/* Corrected Single Unified Search Field Block */}
        <div className="flex h-11 flex-1 items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 transition duration-200 focus-within:border-red-500 focus-within:bg-white focus-within:shadow-sm">
          <Search size={16} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search profiles by name, email, or contact number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-full w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
        </div>

        {/* Refined Quick Blood Filtering Select Dropdown */}
        <div className="relative shrink-0">
          <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <SlidersHorizontal size={14} />
          </div>
          <select
            value={bloodFilter}
            onChange={(e) => setBloodFilter(e.target.value)}
            className="h-11 w-full min-w-[190px] appearance-none rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-10 text-sm font-medium text-slate-700 outline-none transition duration-200 hover:border-slate-300 focus:border-red-500 focus:bg-white focus:shadow-sm"
          >
            <option value="">All Blood Groups</option>
            {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((bg) => (
              <option key={bg} value={bg}>
                Type {bg}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <ChevronDown size={14} />
          </div>
        </div>
      </div>

      {/* ================= CORE SYSTEM DATABASE DISPLAY DATA LISTINGS ================= */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          /* High Quality CSS Simulated Animated Table Core skeleton loader skeleton skeleton screen */
          <div className="space-y-4 p-8">
            <div className="h-6 w-1/4 animate-pulse rounded-md bg-slate-100" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-12 w-full animate-pulse rounded-xl bg-slate-50"
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-3.5">Donor Profile</th>
                  <th className="px-6 py-3.5">Blood Group</th>
                  <th className="px-6 py-3.5">Contact Points</th>
                  <th className="px-6 py-3.5">Location</th>
                  <th className="px-6 py-3.5 text-center">Frequency</th>
                  <th className="px-6 py-3.5">Last Donation</th>
                  <th className="px-6 py-3.5">Availability</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredDonors.map((donor) => {
                  const donorName =
                    donor.fullName || donor.name || "Unknown Donor";
                  return (
                    <tr
                      key={donor._id}
                      className="transition duration-150 hover:bg-slate-50/80"
                    >
                      {/* Name / Avatar Badge Block Layout */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 font-bold text-red-600 border border-red-100/60 text-sm">
                            {donorName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900 block max-w-[180px] truncate">
                              {donorName}
                            </span>
                            <span className="text-xs text-slate-400 block mt-0.5">
                              ID: {String(donor._id).slice(-6).toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Blood Group Tag */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="inline-flex items-center rounded-lg bg-red-50/80 px-2.5 py-1 text-xs font-bold text-red-700 border border-red-100/40">
                          🩸 {donor.bloodGroup || donor.blood || "N/A"}
                        </span>
                      </td>

                      {/* Secondary Communication details Contact Column */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="space-y-1 text-xs text-slate-600">
                          <div className="flex items-center gap-1.5 font-medium text-slate-800">
                            <Phone size={12} className="text-slate-400" />
                            {donor.phone || "---"}
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Mail size={12} className="text-slate-400" />
                            <span className="max-w-[160px] truncate">
                              {donor.email || "---"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Geographic Data Coordinates Location */}
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-600">
                        {donor.city || "Unspecified"}
                      </td>

                      {/* Metric Frequency Tracker Counters */}
                      <td className="whitespace-nowrap px-6 py-4 text-center font-bold text-slate-800">
                        {donor.donations ?? 0}
                      </td>

                      {/* Dynamic Last Interaction Time Values */}
                      <td className="whitespace-nowrap px-6 py-4 text-xs font-medium text-slate-500">
                        {donor.lastDonationDate ||
                          donor.lastDonation ||
                          "Never"}
                      </td>

                      {/* Dynamic Color Mapped System Availability Badge */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                            donor.emergencyAvailability ===
                              "Available Anytime" ||
                            donor.emergency === "Available"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100/60"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {(donor.emergencyAvailability ===
                            "Available Anytime" ||
                            donor.emergency === "Available") && (
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          )}
                          {donor.emergencyAvailability ||
                            donor.emergency ||
                            "Not Specified"}
                        </span>
                      </td>

                      {/* Operational Table Action Items Buttons Line */}
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() =>
                              navigate(`/admin/donors/edit/${donor._id}`)
                            }
                            title="Edit Record"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition duration-150 hover:border-slate-300 hover:text-slate-800 hover:shadow-sm"
                          >
                            <Pencil size={14} />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedDonorId(donor._id);
                              setShowDeleteModal(true);
                            }}
                            title="Remove Record"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition duration-150 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ================= CONDITIONAL EMPTY STATE NOTIFIER DISPLAY ================= */}
        {!loading && filteredDonors.length === 0 && (
          <div className="flex flex-col items-center justify-center border-t border-slate-100 bg-white p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 border border-slate-100">
              <Search size={20} />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-900">
              No donor profiles matched
            </h3>
            <p className="mt-1 text-xs text-slate-400 max-w-xs">
              We couldn't find matches for "{search}" within the selected
              parameters. Double check your query spelling.
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Lifecycle Injection */}
      <DeleteDonorModal
        open={showDeleteModal}
        setOpen={setShowDeleteModal}
        handleDelete={handleDelete}
        deleteLoading={deleteLoading}
      />
    </div>
  );
};

export default ViewAllDonorsPage;
