import {
  Activity,
  Bell,
  Droplet,
  ShieldCheck,
  UserRoundPlus,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "../../assets/hero_section.png";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="relative mx-auto min-h-[760px] max-w-[1536px] sm:min-h-[780px] lg:min-h-[700px]">
        {/* Background Image - works on mobile and desktop */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Blood donation at Arogya Blood Centre"
            className="h-full w-full object-cover object-[68%_top] sm:object-center lg:object-center"
          />

          {/* Mobile readable fade */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/0 to-white lg:hidden" />

          {/* Desktop readable fade */}
          <div className="absolute inset-0 hidden bg-gradient-to-r from-white via-white/0 to-transparent lg:block" />
        </div>

        {/* Left Content */}
        <div className="relative z-10 flex min-h-[760px] flex-col justify-end px-5 pb-10 pt-[55px] sm:min-h-[780px] sm:px-8 sm:pt-[390px] lg:min-h-[700px] lg:w-[58%] lg:justify-center lg:px-14 lg:py-16 xl:px-16">
          <div className="max-w-[650px]">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50/95 px-4 py-2 text-xs font-bold text-red-700 shadow-sm sm:text-sm">
              <Droplet size={16} fill="currentColor" />
              Save Lives. Donate Blood.
            </div>

            <h1 className="text-[42px] font-extrabold leading-[1.08] tracking-normal text-slate-950 sm:text-[56px] lg:text-[68px]">
              Arogya Component
              <br />
              <span className="text-red-700"> Blood Center</span>
            </h1>

            <p className="mt-6 max-w-[560px] text-base leading-8 text-slate-700">
              A comprehensive platform to manage donors, track blood stock,
              organize camps, send alerts, and generate insightful reports.
              Empowering blood centres to serve better, save more lives.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register-donor"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-lg bg-red-700 px-7 text-sm font-bold text-white shadow-md shadow-red-700/20 transition hover:bg-red-800"
              >
                <UserRoundPlus size={18} />
                Register Donor
              </Link>

              <Link
                to="/login-donor"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-lg border border-red-700 bg-white px-7 text-sm font-bold text-red-700 transition hover:bg-red-50"
              >
                <Droplet size={18} />
                Login Donor
              </Link>
            </div>
          </div>

          {/* Bottom trust badges */}
          <div className="mt-10 grid max-w-[850px] gap-4 sm:grid-cols-2 lg:mt-16 xl:grid-cols-4">
            <HeroBadge
              icon={<ShieldCheck size={19} />}
              title="Secure & Reliable"
              text="Data protected"
            />
            <HeroBadge
              icon={<Bell size={19} />}
              title="Real-time Alerts"
              text="Instant notifications"
            />
            <HeroBadge
              icon={<Users size={19} />}
              title="Easy to Use"
              text="Simple & intuitive"
            />
            <HeroBadge
              icon={<Activity size={19} />}
              title="Always Online"
              text="24/7 Availability"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const HeroBadge = ({ icon, title, text }) => {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-white/75 p-3 shadow-sm backdrop-blur-sm xl:border-r xl:border-slate-200 xl:bg-transparent xl:p-0 xl:pr-5 xl:shadow-none last:border-r-0">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-red-50 text-red-700">
        {icon}
      </span>

      <span className="min-w-0">
        <strong className="block text-sm font-bold text-slate-900">
          {title}
        </strong>
        <small className="block text-xs text-slate-500">{text}</small>
      </span>
    </div>
  );
};

export default Hero;
