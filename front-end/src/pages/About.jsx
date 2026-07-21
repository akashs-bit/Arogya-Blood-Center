import {
  Bell,
  CalendarCheck,
  Droplet,
  HeartPulse,
  ShieldCheck,
  UsersRound,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: UsersRound,
    title: "Donor Registry",
    text: "Manage donor profiles, blood groups, and donation history with a clean workflow.",
  },
  {
    icon: ShieldCheck,
    title: "Eligibility Tracking",
    text: "Identify available donors quickly and improve emergency response speed.",
  },
  {
    icon: Bell,
    title: "Emergency Alerts",
    text: "Send urgent notifications instantly to matching blood donors nearby.",
  },
  {
    icon: CalendarCheck,
    title: "Camp Management",
    text: "Handle blood donation camps, registrations, and participation smoothly.",
  },
];

const About = () => {
  return (
    <section className="relative overflow-hidden bg-[#fafafa] py-14 sm:py-16 lg:py-10">
      {/* Background Effects */}
      <div className="absolute left-0 top-0 h-[320px] w-[320px] rounded-full bg-red-200/20 blur-3xl"></div>

      <div className="absolute bottom-0 right-0 h-[320px] w-[320px] rounded-full bg-red-300/20 blur-3xl"></div>

      {/* MAIN CONTAINER */}
      <div className="mx-auto w-full max-w-[1550px] px-3 sm:px-4 lg:px-5">
        {/* ================= HERO SECTION ================= */}
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* LEFT IMAGE SIDE */}
          <div className="relative">
            {/* Main Image */}
            <div className="group relative overflow-hidden rounded-[34px] bg-white p-3 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
              <div className="overflow-hidden rounded-[28px]">
                <img
                  src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=1400&auto=format&fit=crop"
                  alt="Blood Donation"
                  className="h-[320px] sm:h-[450px] lg:h-[620px] w-full object-cover transition duration-[4000ms] group-hover:scale-110"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-[34px]"></div>

              {/* Floating Card */}
              <div className="absolute bottom-6 left-6 right-6 rounded-[26px] border border-white/20 bg-white/80 p-5 backdrop-blur-xl shadow-2xl transition duration-500 hover:-translate-y-2">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-700 animate-pulse">
                    <Droplet size={30} fill="currentColor" />
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">
                      Donate Blood, Save Lives
                    </h3>

                    <p className="mt-1 text-sm text-slate-600">
                      Every donation can help multiple patients survive.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Small Cards */}
            <div className="absolute -left-2 top-8 hidden rounded-2xl bg-white px-5 py-4 shadow-2xl lg:block animate-bounce">
              <p className="text-sm font-bold text-red-700">
                10K+ Registered Donors
              </p>
            </div>

            <div className="absolute -bottom-5 right-5 hidden rounded-2xl bg-red-700 px-5 py-4 text-white shadow-2xl lg:block animate-pulse">
              <p className="text-sm font-bold">Emergency Ready System</p>
            </div>
          </div>

          {/* RIGHT CONTENT SIDE */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-5 py-2 text-sm font-bold text-red-700">
              <HeartPulse size={16} />
              About Arogya Component Blood Centre
            </div>

            {/* Heading */}
            <h1 className="mt-6 text-4xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Smarter Blood Donation Management For Modern Healthcare
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Arogya simplifies blood donor management, emergency coordination,
              blood stock handling, and camp organization with a fast,
              responsive, and modern digital system built for real healthcare
              operations.
            </p>

            {/* Chips */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Chip text="Emergency Response" />
              <Chip text="Blood Tracking" />
              <Chip text="Donor Management" />
            </div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
              <StatsCard number="10K+" text="Registered Donors" />
              <StatsCard number="24/7" text="Emergency Support" />
              <StatsCard number="100%" text="Secure Management" />
            </div>

            {/* Content Cards */}
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              <InfoCard
                title="What We Do"
                text="We connect donors, hospitals, and blood centres using a streamlined digital workflow."
              />

              <InfoCard
                title="Why It Matters"
                text="Faster coordination and organized data improve emergency blood availability."
              />
            </div>

            {/* Button */}
            <button className="group mt-10 inline-flex items-center gap-2 rounded-2xl bg-red-700 px-8 py-4 text-sm font-bold text-white shadow-xl transition duration-300 hover:scale-105 hover:bg-red-800">
              Learn More
              <ArrowRight
                size={18}
                className="transition duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>

        {/* ================= FEATURES SECTION ================= */}
        <div className="mt-20 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {features.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-3 hover:border-red-100 hover:shadow-2xl"
              >
                {/* Icon */}
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-700 transition duration-500 group-hover:rotate-6 group-hover:bg-red-700 group-hover:text-white">
                  <Icon size={30} />
                </div>

                {/* Title */}
                <h3 className="mt-6 text-2xl font-black text-slate-950">
                  {item.title}
                </h3>

                {/* Text */}
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>

        {/* ================= CTA SECTION ================= */}
        <div className="relative mt-20 overflow-hidden rounded-[40px] bg-gradient-to-r from-red-700 via-red-700 to-red-600 px-6 py-14 text-center shadow-[0_20px_60px_rgba(220,38,38,0.3)] sm:px-10">
          {/* Glow */}
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>

          <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>

          <h2 className="text-3xl font-black text-white sm:text-4xl lg:text-5xl">
            Together We Can Save More Lives
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-sm leading-8 text-red-50 sm:text-base">
            Better blood coordination and faster donor response can make a
            life-saving difference during emergencies.
          </p>

          <button className="mt-8 rounded-2xl bg-white px-8 py-4 text-sm font-bold text-red-700 shadow-xl transition duration-300 hover:scale-105 hover:bg-red-50">
            Become A Donor
          </button>
        </div>
      </div>
    </section>
  );
};

/* ================= COMPONENTS ================= */

const Chip = ({ text }) => {
  return (
    <div className="rounded-xl border border-red-100 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
      {text}
    </div>
  );
};

const StatsCard = ({ number, text }) => {
  return (
    <div className="rounded-[24px] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">
      <h3 className="text-3xl font-black text-red-700">{number}</h3>

      <p className="mt-2 text-sm font-medium text-slate-600">{text}</p>
    </div>
  );
};

const InfoCard = ({ title, text }) => {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">
      <h3 className="text-2xl font-black text-slate-950">{title}</h3>

      <p className="mt-4 text-sm leading-7 text-slate-600">{text}</p>
    </div>
  );
};

export default About;
