import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Droplet,
  Eye,
  EyeOff,
  HeartPulse,
  LockKeyhole,
  ShieldCheck,
  UserRound,
  UserRoundPlus,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const LoginDonor = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!formData.identifier.trim()) {
      return toast.error("Enter your email or phone number");
    }

    if (!formData.password.trim()) {
      return toast.error("Enter your password");
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        "https://arogya-blood-center.onrender.com/api/auth/login",
        {
          identifier: formData.identifier,
          password: formData.password,
        },
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success(data.message || "Login successful");

      if (data.user.role === "admin") {
        navigate("/");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[radial-gradient(circle_at_top,_rgba(254,226,226,0.9),_transparent_35%),linear-gradient(180deg,_#fff1f2_0%,_#ffffff_42%,_#f8fafc_100%)] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14 xl:px-10">
      <div className="mx-auto w-full max-w-[1480px]">
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_80px_-48px_rgba(15,23,42,0.4)] lg:grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative hidden overflow-hidden bg-gradient-to-br from-red-800 via-red-700 to-rose-700 p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.10),transparent_30%)]" />

            <div className="relative z-10">
              <div className="inline-grid h-16 w-16 place-items-center rounded-2xl bg-white text-red-700 shadow-lg">
                <Droplet size={34} fill="currentColor" />
              </div>

              <h1 className="mt-8 max-w-md text-4xl font-extrabold leading-tight xl:text-5xl">
                Welcome back, lifesaver.
              </h1>

              <p className="mt-5 max-w-lg text-base leading-8 text-red-50">
                Login to view your donor profile, eligibility status, upcoming
                camps, and emergency donation notifications.
              </p>

              <div className="mt-8 grid gap-3">
                <SideChip
                  icon={<ShieldCheck size={16} />}
                  text="Secure donor access"
                />
                <SideChip
                  icon={<LockKeyhole size={16} />}
                  text="Password-based login"
                />
                <SideChip
                  icon={<HeartPulse size={16} />}
                  text="Built for active donors"
                />
              </div>
            </div>

            <div className="relative z-10 mt-10 rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15 text-white">
                  <CheckCircle2 size={24} />
                </span>

                <div>
                  <h3 className="text-lg font-extrabold">Simple and reliable</h3>

                  <p className="mt-2 text-sm leading-7 text-red-50">
                    Use your registered phone number or email with password for
                    fast and affordable donor login.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-8 lg:p-10 xl:p-12">
            <div className="mx-auto max-w-md">
              <span className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-700 sm:text-sm">
                <ShieldCheck size={16} />
                Donor Login
              </span>

              <h2 className="mt-5 text-3xl font-extrabold leading-tight text-slate-950 sm:text-[34px]">
                Login to your donor account
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
                Enter your registered email or phone number and password to
                continue.
              </p>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-50 text-red-700">
                    <UserRound size={18} />
                  </span>

                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Secure donor login
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Use the same email or phone number you used during donor
                      registration.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleLogin} className="mt-7 space-y-5">
                <label className="block text-sm font-bold text-slate-800">
                  Email or Phone Number
                  <div className="relative mt-2">
                    <UserRound
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />

                    <input
                      type="text"
                      name="identifier"
                      value={formData.identifier}
                      onChange={handleChange}
                      placeholder="Enter email or phone number"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-50"
                    />
                  </div>
                </label>

                <label className="block text-sm font-bold text-slate-800">
                  Password
                  <div className="relative mt-2">
                    <LockKeyhole
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-12 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-50"
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

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-red-700 px-6 text-sm font-bold text-white shadow-md shadow-red-700/20 transition hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-red-400"
                >
                  {loading ? "Logging in..." : "Login"}
                  <ArrowRight size={16} />
                </button>
              </form>

              <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                <p className="text-sm text-slate-600">
                  New donor?{" "}
                  <Link
                    to="/register-donor"
                    className="inline-flex items-center gap-1 font-bold text-red-700 transition hover:text-red-800"
                  >
                    <UserRoundPlus size={16} />
                    Register now
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const SideChip = ({ icon, text }) => {
  return (
    <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white">
      {icon}
      <span>{text}</span>
    </div>
  );
};

export default LoginDonor;