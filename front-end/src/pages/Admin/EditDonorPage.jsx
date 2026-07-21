// ===========================
// FILE: EditDonorPage.jsx
// ===========================

import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Droplets,
  CalendarDays,
  Weight,
  MapPin,
  ShieldCheck,
  Activity,
  FileText,
  Save,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const EditDonorPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    gender: "",
    bloodGroup: "",
    dateOfBirth: "",
    weight: "",
    address: "",
    emergencyAvailability: "",
    lastDonationDate: "",
  });

  const fetchDonor = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get(
        `https://arogya-blood-center.onrender.com/api/donors/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setFormData({
        fullName: data.donor.fullName || "",
        phone: data.donor.phone || "",
        email: data.donor.email || "",
        gender: data.donor.gender || "",
        bloodGroup: data.donor.bloodGroup || "",
        dateOfBirth: data.donor.dateOfBirth
          ? data.donor.dateOfBirth.split("T")[0]
          : "",
        weight: data.donor.weight || "",
        address: data.donor.address || "",
        emergencyAvailability: data.donor.emergencyAvailability || "",
        lastDonationDate: data.donor.lastDonationDate
          ? data.donor.lastDonationDate.split("T")[0]
          : "",
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to load donor");
    }
  };

  useEffect(() => {
    fetchDonor();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const { data } = await axios.put(
        `https://arogya-blood-center.onrender.com/api/donors/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(data.message);

      navigate("/admin/donors/all");
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message || "Failed to update donor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}

      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          {/* Back */}
          <button
            onClick={() => navigate("/admin/donors/all")}
            className="flex h-14 items-center justify-center gap-3 rounded-2xl border border-slate-200 px-6"
          >
            <ArrowLeft size={22} />
          </button>

          <div>
            <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">
              Edit Donor
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Update donor information and medical details.
            </p>
          </div>
        </div>

        {/* Save */}
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-green-700 to-green-600 px-6 text-sm font-bold text-white"
        >
          <Save size={18} />
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* ================= FORM ================= */}

      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {/* Full Name */}
          <InputField
            label="Full Name"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            icon={<User size={18} />}
          />

          {/* Phone */}
          <InputField
            label="Phone Number"
            placeholder="9876543210"
            value={formData.phone}
            onChange={handleChange}
            icon={<Phone size={18} />}
          />

          {/* Email */}
          <InputField
            label="Email Address"
            placeholder="rahul@gmail.com"
            value={formData.email}
            onChange={handleChange}
            icon={<Mail size={18} />}
          />

          {/* Gender */}
          <SelectField
            label="Gender"
            value={formData.gender}
            onChange={handleChange}
            icon={<User size={18} />}
            options={["Male", "Female", "Other"]}
          />

          {/* DOB */}
          <InputField
            label="Date of Birth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            icon={<CalendarDays size={18} />}
          />

          {/* Blood */}
          <SelectField
            label="Blood Group"
            value={formData.bloodGroup}
            onChange={handleChange}
            icon={<Droplets size={18} />}
            options={["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]}
          />

          {/* Weight */}
          <InputField
            label="Weight"
            placeholder="72kg"
            value={formData.weight}
            onChange={handleChange}
            icon={<Weight size={18} />}
          />

          {/* City */}
          <InputField
            label="City"
            placeholder="Ahmedabad"
            icon={<MapPin size={18} />}
          />

          {/* State */}
          <InputField
            label="State"
            placeholder="Gujarat"
            icon={<MapPin size={18} />}
          />

          {/* Emergency */}
          <InputField
            label="Emergency Contact"
            placeholder="9876543211"
            value={formData.emergencyAvailability}
            onChange={handleChange}
            icon={<Phone size={18} />}
          />

          {/* Last Donation */}
          <InputField
            label="Last Donation Date"
            type="date"
            value={formData.lastDonationDate}
            onChange={handleChange}
            icon={<CalendarDays size={18} />}
          />

          {/* Hemoglobin */}
          <InputField
            label="Hemoglobin"
            placeholder="13.5"
            icon={<Activity size={18} />}
          />

          {/* BP */}
          <InputField
            label="Blood Pressure"
            placeholder="120/80"
            icon={<Activity size={18} />}
          />

          {/* Smoking */}
          <SelectField
            label="Smoking Habit"
            icon={<ShieldCheck size={18} />}
            options={["No", "Yes", "Occasionally"]}
          />

          {/* Alcohol */}
          <SelectField
            label="Alcohol Consumption"
            icon={<ShieldCheck size={18} />}
            options={["No", "Yes", "Occasionally"]}
          />
        </div>

        {/* Address */}
        <div className="mt-6">
          <label className="mb-3 block text-sm font-black text-slate-700">
            Full Address
          </label>

          <textarea
            rows={4}
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter full address..."
            className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none transition duration-300 focus:border-green-500"
          ></textarea>
        </div>

        {/* Diseases */}
        <div className="mt-6">
          <label className="mb-3 block text-sm font-black text-slate-700">
            Diseases / Medical Conditions
          </label>

          <textarea
            rows={4}
            placeholder="Write diseases or allergies..."
            className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none transition duration-300 focus:border-green-500"
          ></textarea>
        </div>

        {/* Notes */}
        <div className="mt-6">
          <label className="mb-3 block text-sm font-black text-slate-700">
            Admin Notes
          </label>

          <textarea
            rows={5}
            placeholder="Write additional donor notes..."
            className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none transition duration-300 focus:border-green-500"
          ></textarea>
        </div>

        {/* Upload */}
        <div className="mt-6">
          <label className="mb-3 block text-sm font-black text-slate-700">
            Upload Government ID
          </label>

          <div className="flex h-14 items-center rounded-2xl border border-dashed border-slate-300 bg-white px-4">
            <FileText size={18} className="mr-3 text-slate-400" />

            <input type="file" className="w-full text-sm" />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= INPUT FIELD ================= */

const InputField = ({
  label,
  placeholder,
  icon,
  type = "text",
  name,
  value,
  onChange,
}) => {
  return (
    <div>
      <label className="mb-3 block text-sm font-black text-slate-700">
        {label}
      </label>

      <div className="flex h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4">
        <div className="text-slate-400">{icon}</div>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="h-full w-full bg-transparent text-sm outline-none"
        />
      </div>
    </div>
  );
};

/* ================= SELECT FIELD ================= */

const SelectField = ({ label, options, icon, name, value, onChange }) => {
  return (
    <div>
      <label className="mb-3 block text-sm font-black text-slate-700">
        {label}
      </label>

      <div className="flex h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4">
        <div className="text-slate-400">{icon}</div>

        <select
          name={name}
          value={value}
          onChange={onChange}
          className="h-full w-full bg-transparent text-sm outline-none"
        >
          <option value="">Select</option>

          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default EditDonorPage;
