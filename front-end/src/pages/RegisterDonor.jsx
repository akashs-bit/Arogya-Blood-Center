import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Droplet,
  Eye,
  EyeOff,
  HeartPulse,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
  Weight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

const initialFormData = {
  fullName: "",
  phone: "",
  email: "",
  dateOfBirth: "",
  gender: "",
  bloodGroup: "",
  weight: "",
  lastDonationDate: "",
  donorType: "Voluntary Donor",
  emergencyAvailability: "Available Anytime",
  address: "",
  password: "",
  confirmPassword: "",
  consent: false,
};

const RegisterDonor = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState(initialFormData);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

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
      return toast.error("Please accept the consent before registering");
    }

    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Password and confirm password do not match");
    }

    try {
      setLoading(true);

      const { confirmPassword, consent, ...payload } = formData;

      const { data } = await axios.post(
        "http://localhost:5000/api/auth/register",
        payload,
      );

      toast.success(data.message || "Donor registered successfully");
      setFormData(initialFormData);
      navigate("/login-donor");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[radial-gradient(circle_at_top,_rgba(254,226,226,0.9),_transparent_35%),linear-gradient(180deg,_#fff1f2_0%,_#ffffff_42%,_#f8fafc_100%)] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14 xl:px-10">
      <div className="mx-auto w-full max-w-[1480px]">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-8">
          <div className="min-w-0">
            <div className="rounded-[28px] border border-red-100 bg-gradient-to-r from-red-800 via-red-700 to-rose-600 px-5 py-6 text-white shadow-[0_24px_80px_-32px_rgba(185,28,28,0.75)] sm:px-7 sm:py-7 lg:px-8 lg:py-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] sm:text-sm">
                <Droplet size={16} fill="currentColor" />
                Donor Registration
              </span>

              <h1 className="mt-4 text-[30px] font-extrabold leading-tight sm:mt-5 sm:text-4xl lg:text-5xl">
                Register as a Blood Donor
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-red-50 sm:mt-4 sm:text-base sm:leading-7">
                Join Arogya Blood Centre and help save lives. Your details help
                us connect with you for donation camps, reminders, and emergency
                blood requests with secure password-based login.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <InfoChip
                  icon={<ShieldCheck size={16} />}
                  text="Secure donor account"
                />
                <InfoChip
                  icon={<LockKeyhole size={16} />}
                  text="Password-based login"
                />
                <InfoChip
                  icon={<HeartPulse size={16} />}
                  text="Emergency-ready donors"
                />
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-6 rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.35)] sm:mt-8 sm:p-6 lg:p-8 xl:p-10"
            >
              <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:pb-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-950 sm:text-2xl">
                    Donor Information
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Fill in accurate details for donor registration and secure
                    account access.
                  </p>
                </div>

                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
                  <CheckCircle2 size={14} />
                  Verified donor workflow
                </span>
              </div>

              <div className="mt-8">
                <SectionHeading
                  title="Personal Details"
                  text="These details help us identify you and maintain a reliable donor profile."
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
                  />

                  <Select
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    placeholder="Select gender"
                    options={["Male", "Female", "Other"]}
                    required
                    disabled={loading}
                  />

                  <Select
                    label="Blood Group"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    placeholder="Select blood group"
                    options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
                    required
                    disabled={loading}
                  />

                  <Input
                    label="Weight (kg)"
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="Enter weight"
                    icon={<Weight size={18} />}
                    min="1"
                    required
                    disabled={loading}
                  />

                  <Input
                    label="Last Donation Date"
                    name="lastDonationDate"
                    value={formData.lastDonationDate}
                    onChange={handleChange}
                    type="date"
                    icon={<CalendarDays size={18} />}
                    max={today}
                    disabled={loading}
                  />

                  <Select
                    label="Donor Type"
                    name="donorType"
                    value={formData.donorType}
                    onChange={handleChange}
                    options={[
                      "Voluntary Donor",
                      "Replacement Donor",
                      "Rare Group Donor",
                    ]}
                    disabled={loading}
                  />

                  <Select
                    label="Emergency Availability"
                    name="emergencyAvailability"
                    value={formData.emergencyAvailability}
                    onChange={handleChange}
                    options={[
                      "Available Anytime",
                      "Available On Call",
                      "Not Available",
                    ]}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="mt-8">
                <SectionHeading
                  title="Account Security"
                  text="Set a password to log in securely without paying for OTP on every login."
                />

                <div className="mt-5 grid gap-4 sm:grid-cols-2 sm:gap-5">
                  <PasswordInput
                    label="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    icon={<LockKeyhole size={18} />}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    required
                    disabled={loading}
                  />

                  <PasswordInput
                    label="Confirm Password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    icon={<LockKeyhole size={18} />}
                    showPassword={showConfirmPassword}
                    setShowPassword={setShowConfirmPassword}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="mt-8">
                <SectionHeading
                  title="Address"
                  text="This helps us notify you about nearby camps and local emergency requests."
                />

                <div className="mt-5">
                  <TextAreaField
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter full address, city, state"
                    icon={<MapPin size={18} />}
                    rows={4}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm font-medium text-blue-700">
                Your phone number and email will be used for donor
                communication, reminders, emergency alerts, and account-related
                notifications.
              </div>

              <div className="mt-6 rounded-2xl border border-red-100 bg-red-50/70 p-4 sm:p-5">
                <label className="flex items-start gap-3 text-sm font-medium leading-6 text-slate-700">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                    disabled={loading}
                    className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 accent-red-700"
                  />

                  <span>
                    I confirm that the information provided is correct and I
                    agree to receive donor notifications, reminders, and
                    emergency alerts from Arogya Blood Centre.
                  </span>
                </label>
              </div>

              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
                <Link
                  to="/"
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-red-700 px-7 text-sm font-bold text-white shadow-md shadow-red-700/20 transition hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-red-400 sm:w-auto"
                >
                  {loading ? "Registering..." : "Register Donor"}
                </button>
              </div>
            </form>
          </div>

          <aside className="order-first space-y-4 xl:order-none xl:space-y-5">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-700">
                <HeartPulse size={28} />
              </div>

              <h3 className="mt-5 text-lg font-extrabold text-slate-950 sm:text-xl">
                Why Register?
              </h3>

              <ul className="mt-5 space-y-4 text-sm text-slate-600">
                <BenefitItem text="Receive donation reminders." />
                <BenefitItem text="Get emergency blood alerts." />
                <BenefitItem text="Join nearby blood camps." />
                <BenefitItem text="Track donor eligibility." />
              </ul>
            </div>

            <div className="rounded-[28px] border border-red-100 bg-gradient-to-br from-red-50 to-white p-5 shadow-sm sm:p-6">
              <h3 className="text-lg font-extrabold text-red-700 sm:text-xl">
                Donation Eligibility
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-700">
                Donors should usually be healthy, 18+ years old, and should not
                have donated during the restricted period.
              </p>

              <div className="mt-5 space-y-3">
                <EligibilityRow text="Age 18 years or above" />
                <EligibilityRow text="Healthy donor required" />
                <EligibilityRow text="Valid blood donor eligibility" />
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-5 text-white shadow-sm sm:p-6">
              <h3 className="text-lg font-extrabold">Need help?</h3>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                Contact our team for donor registration and account support.
              </p>

              <div className="mt-5 space-y-3 text-sm">
                <ContactRow icon={<Phone size={16} />} text="+91 8951113002" />
                <ContactRow
                  icon={<Mail size={16} />}
                  text="info@arogyabloodcentre.com"
                />
                <ContactRow
                  icon={<MapPin size={16} />}
                  text="Kalaburagi, Karnataka"
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
    </label>
  );
};

const PasswordInput = ({
  label,
  placeholder,
  icon,
  name,
  value,
  onChange,
  showPassword,
  setShowPassword,
  required = false,
  disabled = false,
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
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-12 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-50 disabled:cursor-not-allowed disabled:bg-slate-100"
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </label>
  );
};

const Select = ({
  label,
  options,
  name,
  value,
  onChange,
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
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}

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
          rows={rows}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 py-3 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-50 disabled:cursor-not-allowed disabled:bg-slate-100 ${
            icon ? "pl-11" : "px-4"
          }`}
        />
      </div>
    </label>
  );
};

const InfoChip = ({ icon, text }) => {
  return (
    <div className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white">
      {icon}
      <span>{text}</span>
    </div>
  );
};

const BenefitItem = ({ text }) => {
  return (
    <li className="flex items-start gap-3 leading-6">
      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600">
        <CheckCircle2 size={14} />
      </span>

      <span>{text}</span>
    </li>
  );
};

const EligibilityRow = ({ text }) => {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/70 bg-white/80 px-4 py-3 text-sm font-medium text-slate-700">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-red-50 text-red-700">
        <ShieldCheck size={15} />
      </span>

      <span>{text}</span>
    </div>
  );
};

const ContactRow = ({ icon, text }) => {
  return (
    <div className="flex items-center gap-3 text-slate-200">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/10 text-red-300">
        {icon}
      </span>

      <span className="break-words">{text}</span>
    </div>
  );
};

export default RegisterDonor;
