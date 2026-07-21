import {
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Droplet,
  HeartPulse,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
  Weight,
} from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const initialFormData = {
  fullName: "",
  phone: "",
  email: "",
  dateOfBirth: "",
  bloodGroup: "",
  weight: "",
  preferredSlot: "",
  lastDonationDate: "",
  address: "",
  medicalInfo: "",
  consent: false,
};

const bloodGroupOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const slotOptions = [
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "01:00 PM - 02:00 PM",
  "02:00 PM - 03:00 PM",
];

const RegisterCamps = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const { id } = useParams();

  const location = useLocation();

  const [camp, setCamp] = useState(location.state?.camp || null);

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.consent) {
      toast.error("Please accept the confirmation before registering");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        navigate("/login-donor");
        return;
      }

      const { consent, ...restFormData } = formData;

      const payload = {
        ...restFormData,
        weight: Number(restFormData.weight),
        campId: id,
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/camps/register-camp",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(data.message || "Camp registration successful");
      setFormData(initialFormData);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Camp registration failed");
    } finally {
      setLoading(false);
    }
  };

  // console.log(id);

  return (
    <section className="bg-[radial-gradient(circle_at_top,_rgba(254,226,226,0.9),_transparent_35%),linear-gradient(180deg,_#fff1f2_0%,_#ffffff_45%,_#f8fafc_100%)] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14 xl:px-10">
      <div className="mx-auto w-full max-w-[1480px]">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px] xl:gap-8">
          <div className="min-w-0">
            <div className="overflow-hidden rounded-[28px] border border-red-200 bg-gradient-to-r from-red-800 via-red-700 to-rose-600 px-5 py-6 text-white shadow-[0_24px_80px_-32px_rgba(185,28,28,0.75)] sm:px-7 sm:py-7 lg:px-8 lg:py-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] sm:text-sm">
                <CalendarCheck size={16} />
                Camp Registration
              </span>

              <h1 className="mt-4 max-w-3xl text-[30px] font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                Register for a Blood Donation Camp
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-red-50 sm:text-base sm:leading-7">
                Reserve your donation slot in advance and enjoy a faster,
                smoother check-in experience at the camp.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <HeroChip
                  icon={<ShieldCheck size={16} />}
                  text="Verified registration"
                />
                <HeroChip
                  icon={<Clock3 size={16} />}
                  text="Quick slot booking"
                />
                <HeroChip
                  icon={<HeartPulse size={16} />}
                  text="Donor-friendly process"
                />
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-6 rounded-[28px] border border-slate-200 bg-white/95 p-4 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.4)] backdrop-blur sm:mt-8 sm:p-6 lg:p-8 xl:p-10"
            >
              <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:pb-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-950 sm:text-2xl">
                    Camp Registration Details
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Fill in your details so we can reserve your preferred
                    donation slot.
                  </p>
                </div>

                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
                  <CheckCircle2 size={14} />
                  Smooth donor check-in
                </span>
              </div>

              <div className="mt-6 rounded-[24px] border border-red-100 bg-gradient-to-r from-red-50 via-rose-50 to-white p-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">
                  Selected Camp
                </p>

                <h3 className="mt-2 text-2xl font-extrabold text-slate-900">
                  {camp.campName}
                </h3>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Badge icon={<MapPin size={15} />} text={camp.campLocation} />

                  <Badge
                    icon={<CalendarDays size={15} />}
                    text={new Date(camp.campDate).toLocaleDateString()}
                  />

                  <Badge icon={<Clock3 size={15} />} text={camp.campTime} />
                </div>
              </div>

              <div className="mt-8">
                <SectionHeading
                  title="Personal Information"
                  text="These details help us verify your registration and prepare your donor profile."
                />

                <div className="mt-5 grid gap-4 sm:grid-cols-2 sm:gap-5">
                  <Input
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    icon={<UserRound size={18} />}
                    placeholder="Enter full name"
                    required
                    disabled={loading}
                  />

                  <Input
                    label="Phone Number"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    icon={<Phone size={18} />}
                    placeholder="+91 9876543210"
                    required
                    disabled={loading}
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    icon={<Mail size={18} />}
                    placeholder="name@example.com"
                    required
                    disabled={loading}
                  />

                  <Input
                    label="Date of Birth"
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    icon={<CalendarDays size={18} />}
                    max={today}
                    required
                    disabled={loading}
                    helperText="Now this shows correctly as a date input."
                  />

                  <Select
                    label="Blood Group"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    options={bloodGroupOptions}
                    placeholder="Select blood group"
                    required
                    disabled={loading}
                  />

                  <Input
                    label="Weight (kg)"
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    icon={<Weight size={18} />}
                    placeholder="Enter weight"
                    min="45"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="mt-8">
                <SectionHeading
                  title="Donation Preferences"
                  text="These details help us schedule your visit and support you better at the camp."
                />

                <div className="mt-5 grid gap-4 sm:grid-cols-2 sm:gap-5">
                  <Select
                    label="Preferred Time Slot"
                    name="preferredSlot"
                    value={formData.preferredSlot}
                    onChange={handleChange}
                    options={slotOptions}
                    placeholder="Select preferred slot"
                    required
                    disabled={loading}
                  />

                  <Input
                    label="Last Donation Date"
                    type="date"
                    name="lastDonationDate"
                    value={formData.lastDonationDate}
                    onChange={handleChange}
                    icon={<CalendarDays size={18} />}
                    max={today}
                    disabled={loading}
                    helperText="Leave blank if this is your first donation."
                  />

                  <div className="sm:col-span-2">
                    <TextAreaField
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      icon={<MapPin size={18} />}
                      placeholder="Enter full address, city, state"
                      rows={4}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <TextAreaField
                      label="Medical Information"
                      name="medicalInfo"
                      value={formData.medicalInfo}
                      onChange={handleChange}
                      placeholder="Mention recent illness, medication, or special requirements"
                      rows={4}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm font-medium text-blue-700">
                donation reminders will be sent to your registered mobile
                number.
              </div>

              <div className="mt-6 rounded-2xl border border-red-100 bg-red-50/80 p-4 sm:p-5">
                <label className="flex items-start gap-3 text-sm font-medium leading-6 text-slate-700">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 accent-red-700"
                    disabled={loading}
                  />
                  <span>
                    I confirm that I am willing to attend the selected camp and
                    receive reminder calls, OTP verification, and donation
                    notifications from Arogya Component Blood Centre.
                  </span>
                </label>
              </div>

              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
                <Link
                  to="/camps"
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-red-700 px-7 text-sm font-bold text-white shadow-md shadow-red-700/20 transition hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-red-400 sm:w-auto"
                >
                  {loading ? "Registering..." : "Confirm Camp Registration"}
                </button>
              </div>
            </form>
          </div>

          <aside className="order-first space-y-4 xl:order-none xl:space-y-5">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-700">
                <CalendarCheck size={28} />
              </div>

              <h3 className="mt-5 text-lg font-extrabold text-slate-950 sm:text-xl">
                Camp Details
              </h3>

              <div className="mt-5 space-y-4 text-sm text-slate-600">
                <InfoRow
                  icon={<MapPin size={18} />}
                  title="Location"
                  text={camp.campLocation}
                />

                <InfoRow
                  icon={<Clock3 size={18} />}
                  title="Camp Hours"
                  text={camp.campTime}
                />

                <InfoRow
                  icon={<Droplet size={18} />}
                  title="Target"
                  text={`${camp.totalSlots} Donors`}
                />
              </div>
            </div>

            <div className="rounded-[28px] border border-red-100 bg-gradient-to-br from-red-50 via-rose-50 to-white p-5 shadow-sm sm:p-6">
              <h3 className="text-lg font-extrabold text-red-700 sm:text-xl">
                Before You Donate
              </h3>

              <div className="mt-5 space-y-3">
                <ChecklistItem text="Eat a healthy meal before coming." />
                <ChecklistItem text="Carry a valid ID proof." />
                <ChecklistItem text="Drink enough water." />
                <ChecklistItem text="Avoid donation if you are unwell." />
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-5 text-white shadow-sm sm:p-6">
              <h3 className="text-lg font-extrabold">Need assistance?</h3>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                Our team can help you choose a camp and guide you through
                registration.
              </p>

              <div className="mt-5 space-y-3 text-sm">
                <SupportRow icon={<Phone size={16} />} text="+91 8951113002" />
                <SupportRow
                  icon={<MapPin size={16} />}
                  text={camp.campLocation}
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

const SectionHeading = ({ title, text }) => {
  return (
    <div>
      <h3 className="text-base font-extrabold text-slate-900 sm:text-lg">
        {title}
      </h3>
      <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
};

const Input = ({
  label,
  placeholder,
  icon,
  type = "text",
  name,
  value,
  onChange,
  helperText,
  required = false,
  disabled = false,
  min,
  max,
}) => {
  return (
    <label className="block text-sm font-bold text-slate-800">
      {label}

      <div className="relative mt-2">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        )}

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          className={`h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition [color-scheme:light] placeholder:text-slate-400 focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-50 disabled:cursor-not-allowed disabled:bg-slate-100 ${
            icon ? "pl-11" : ""
          }`}
        />
      </div>

      {helperText && (
        <p className="mt-2 text-xs font-medium text-slate-500">{helperText}</p>
      )}
    </label>
  );
};

const Select = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  required = false,
  disabled = false,
}) => {
  return (
    <label className="block text-sm font-bold text-slate-800">
      {label}

      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-50 disabled:cursor-not-allowed disabled:bg-slate-100"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
};

const TextAreaField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  icon,
  rows = 4,
  required = false,
  disabled = false,
}) => {
  return (
    <label className="block text-sm font-bold text-slate-800">
      {label}

      <div className="relative mt-2">
        {icon && (
          <span className="absolute left-4 top-4 text-slate-400">{icon}</span>
        )}

        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-50 disabled:cursor-not-allowed disabled:bg-slate-100 ${
            icon ? "pl-11" : ""
          }`}
        />
      </div>
    </label>
  );
};

const Badge = ({ icon, text }) => {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
      {icon}
      {text}
    </span>
  );
};

const HeroChip = ({ icon, text }) => {
  return (
    <div className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white">
      {icon}
      <span>{text}</span>
    </div>
  );
};

const InfoRow = ({ icon, title, text }) => {
  return (
    <div className="flex items-start gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-50 text-red-700">
        {icon}
      </span>

      <div>
        <p className="text-sm font-bold text-slate-900">{title}</p>
        <p className="mt-1 text-sm text-slate-500">{text}</p>
      </div>
    </div>
  );
};

const ChecklistItem = ({ text }) => {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-white/80 bg-white/90 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600">
        <CheckCircle2 size={14} />
      </span>

      <span>{text}</span>
    </div>
  );
};

const SupportRow = ({ icon, text }) => {
  return (
    <div className="flex items-center gap-3 text-slate-200">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/10 text-red-300">
        {icon}
      </span>

      <span className="break-words">{text}</span>
    </div>
  );
};

export default RegisterCamps;
