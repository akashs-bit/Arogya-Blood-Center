import {
  X,
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
  UploadCloud,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";

const AddDonorModal = ({ open, setOpen, fetchDonors }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    gender: "",
    bloodGroup: "",
    dateOfBirth: "",
    weight: "",
    address: "",
    city: "",
    state: "",
    emergencyAvailability: "Available Anytime",
    lastDonationDate: "",
    hemoglobin: "",
    bloodPressure: "",
    smokingHabit: "",
    alcoholConsumption: "",
    govIdNumber: "",
  });

  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent standard form reload behavior
    if (loading) return;

    // Basic Validation check
    if (!formData.fullName || !formData.phone || !formData.bloodGroup) {
      return toast.error("Please fill in all required fields marked with *");
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const payload = {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        dateOfBirth: formData.dateOfBirth,
        weight: formData.weight,
        address: `${formData.city}, ${formData.state}, ${formData.address}`,
        emergencyAvailability: formData.emergencyAvailability,
        lastDonationDate: formData.lastDonationDate,
        medicalDetails: {
          hemoglobin: formData.hemoglobin,
          bloodPressure: formData.bloodPressure,
          smokingHabit: formData.smokingHabit,
          alcoholConsumption: formData.alcoholConsumption,
        },
        govIdNumber: formData.govIdNumber,
      };

      const response = await axios.post(
        "https://arogya-blood-center.onrender.com/api/donors/create",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (
        response.data &&
        (response.data.success ||
          response.status === 200 ||
          response.status === 201)
      ) {
        toast.success(response.data.message || "Donor added successfully");

        if (typeof fetchDonors === "function") {
          fetchDonors();
        }

        // Reset to initial structure
        setFormData({
          fullName: "",
          phone: "",
          email: "",
          password: "",
          gender: "",
          bloodGroup: "",
          dateOfBirth: "",
          weight: "",
          address: "",
          city: "",
          state: "",
          emergencyAvailability: "Available Anytime",
          lastDonationDate: "",
          hemoglobin: "",
          bloodPressure: "",
          smokingHabit: "",
          alcoholConsumption: "",
          govIdNumber: "",
        });

        setOpen(false);
      } else {
        toast.error(response.data?.message || "Failed to add donor");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.response?.data?.message || "Failed to add donor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in">
      <div className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-3xl bg-white shadow-2xl border border-slate-100 flex flex-col">
        {/* ================= HEADER ================= */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-100 bg-white/95 backdrop-blur px-8 py-5">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Add New Donor
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Register donor medical record profiles securely into the blood
              bank management system.
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition duration-200 hover:bg-red-50 hover:text-red-600 border border-slate-200/60"
          >
            <X size={18} />
          </button>
        </div>

        {/* ================= BODY / FORM CONTAINER ================= */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 p-8 space-y-8 overflow-y-auto"
        >
          {/* Section 1: Personal Details */}
          <div className="space-y-5">
            <SectionTitle
              title="Personal Information"
              subtitle="Identity and contact verification data"
              icon={<User size={20} />}
              color="bg-red-50 text-red-600 border border-red-100"
            />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              <InputField
                label="Full Name"
                required
                placeholder="John Doe"
                icon={<User size={16} />}
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
              <InputField
                label="Phone Number"
                required
                name="phone"
                placeholder="9876543210"
                icon={<Phone size={16} />}
                value={formData.phone}
                onChange={handleChange}
              />
              <InputField
                label="Email Address"
                name="email"
                type="email"
                placeholder="example@mail.com"
                icon={<Mail size={16} />}
                value={formData.email}
                onChange={handleChange}
              />
              <InputField
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                icon={<ShieldCheck size={16} />}
              />
              <SelectField
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                icon={<User size={16} />}
                options={["Select Gender", "Male", "Female", "Other"]}
              />
              <InputField
                label="Date of Birth"
                type="date"
                name="dateOfBirth"
                icon={<CalendarDays size={16} />}
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
              <SelectField
                label="Blood Group"
                required
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                icon={<Droplets size={16} />}
                options={[
                  "Select Blood Group",
                  "O+",
                  "O-",
                  "A+",
                  "A-",
                  "B+",
                  "B-",
                  "AB+",
                  "AB-",
                ]}
              />
              <InputField
                label="Weight (Kg)"
                name="weight"
                placeholder="70"
                icon={<Weight size={16} />}
                value={formData.weight}
                onChange={handleChange}
              />
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 2: Address */}
          <div className="space-y-5">
            <SectionTitle
              title="Address Details"
              subtitle="Current residential information for tracking logistics"
              icon={<MapPin size={20} />}
              color="bg-blue-50 text-blue-600 border border-blue-100"
            />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <InputField
                label="City"
                placeholder="City Name"
                icon={<MapPin size={16} />}
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
              <InputField
                label="State"
                name="state"
                placeholder="State Name"
                icon={<MapPin size={16} />}
                value={formData.state}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Full Address
              </label>
              <textarea
                rows={3}
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="House no, Street name, Locality details..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none transition duration-200 focus:border-red-500 focus:bg-white resize-none"
              />
            </div>
            <div className="max-w-md">
              <SelectField
                label="Emergency Availability"
                name="emergencyAvailability"
                value={formData.emergencyAvailability}
                onChange={handleChange}
                icon={<ShieldCheck size={16} />}
                options={[
                  "Available Anytime",
                  "Available On Call",
                  "Not Available",
                ]}
              />
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 3: Medical Information */}
          <div className="space-y-5">
            <SectionTitle
              title="Medical Information"
              subtitle="Clinical data regarding eligibility"
              icon={<ShieldCheck size={20} />}
              color="bg-emerald-50 text-emerald-600 border border-emerald-100"
            />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              <InputField
                label="Last Donation Date"
                type="date"
                name="lastDonationDate"
                icon={<CalendarDays size={16} />}
                value={formData.lastDonationDate}
                onChange={handleChange}
              />
              <InputField
                label="Hemoglobin Level (g/dL)"
                name="hemoglobin"
                value={formData.hemoglobin}
                onChange={handleChange}
                placeholder="13.5"
                icon={<Activity size={16} />}
              />
              <InputField
                label="Blood Pressure (mmHg)"
                name="bloodPressure"
                value={formData.bloodPressure}
                onChange={handleChange}
                placeholder="120/80"
                icon={<Activity size={16} />}
              />
              <SelectField
                label="Smoking Habit"
                name="smokingHabit"
                value={formData.smokingHabit}
                onChange={handleChange}
                icon={<Activity size={16} />}
                options={["Select Option", "Yes", "No", "Occasionally"]}
              />
              <SelectField
                label="Alcohol Consumption"
                name="alcoholConsumption"
                value={formData.alcoholConsumption}
                onChange={handleChange}
                icon={<Activity size={16} />}
                options={["Select Option", "Yes", "No", "Occasionally"]}
              />
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 4: Document Verification */}
          <div className="space-y-5">
            <SectionTitle
              title="Verification Documents"
              subtitle="Regulatory administrative compliance documentation"
              icon={<FileText size={20} />}
              color="bg-purple-50 text-purple-600 border border-purple-100"
            />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <InputField
                label="Government ID Number"
                name="govIdNumber"
                value={formData.govIdNumber}
                onChange={handleChange}
                placeholder="Aadhaar / PAN / Passport details"
                icon={<FileText size={16} />}
              />
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Upload Verification Document File
                </label>
                <label className="flex h-13 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 text-slate-500 transition duration-200 hover:border-red-400 hover:bg-red-50/20 px-4 text-sm">
                  <UploadCloud size={16} className="text-slate-400" />
                  <span>Choose file to upload</span>
                  <input type="file" className="hidden" />
                </label>
              </div>
            </div>
          </div>
        </form>

        {/* ================= FOOTER ================= */}
        <div className="border-t border-slate-100 bg-slate-50 px-8 py-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition duration-200 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="h-11 rounded-xl bg-red-600 px-6 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Saving Records..." : "Save Donor Profile"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ================= CLEAN REUSABLE COMPONENTS WITH SUBTLE UI REFINEMENTS ================= */

const SectionTitle = ({ title, subtitle, icon, color }) => (
  <div className="flex items-center gap-3.5">
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${color}`}
    >
      {icon}
    </div>
    <div>
      <h3 className="text-lg font-bold text-slate-800 leading-tight">
        {title}
      </h3>
      <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
    </div>
  </div>
);

const InputField = ({
  label,
  placeholder,
  icon,
  type = "text",
  name,
  value,
  onChange,
  required,
}) => (
  <div className="w-full">
    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="flex h-11 items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 transition duration-200 focus-within:border-red-500 focus-within:bg-white focus-within:shadow-sm">
      {icon && <div className="text-slate-400 shrink-0">{icon}</div>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-full w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
      />
    </div>
  </div>
);

const SelectField = ({
  label,
  options = [],
  icon,
  name,
  value,
  onChange,
  required,
}) => (
  <div className="w-full">
    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="flex h-11 items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 transition duration-200 focus-within:border-red-500 focus-within:bg-white focus-within:shadow-sm">
      {icon && <div className="text-slate-400 shrink-0">{icon}</div>}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="h-full w-full bg-transparent text-sm text-slate-700 outline-none cursor-pointer"
      >
        {options.map((option, index) => (
          <option
            key={index}
            value={index === 0 && option.includes("Select") ? "" : option}
            disabled={index === 0 && option.includes("Select")}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default AddDonorModal;
