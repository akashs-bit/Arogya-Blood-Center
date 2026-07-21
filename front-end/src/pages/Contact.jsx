import {
  Clock3,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  HeartHandshake,
  Droplets,
} from "lucide-react";

const Contact = () => {
  return (
    <section className="relative overflow-hidden bg-[#fafafa] pt-6 sm:pt-8 lg:pt-10 pb-14 sm:pb-16">
      {/* Background Blur */}
      <div className="absolute left-0 top-0 h-[320px] w-[320px] rounded-full bg-red-200/20 blur-3xl"></div>

      <div className="absolute bottom-0 right-0 h-[320px] w-[320px] rounded-full bg-red-300/20 blur-3xl"></div>

      {/* MAIN CONTAINER */}
      <div className="mx-auto w-full max-w-[1550px] px-3 sm:px-4 lg:px-5">
        <div className="grid gap-8 xl:grid-cols-[480px_minmax(0,1fr)]">
          {/* ================= LEFT SIDE ================= */}
          <aside className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-red-700 via-red-700 to-red-600 p-5 sm:p-7 text-white shadow-[0_20px_60px_rgba(220,38,38,0.25)]">
            {/* Glow */}
            <div className="absolute -top-16 -right-16 h-52 w-52 rounded-full bg-white/10 blur-3xl"></div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur-xl sm:text-sm">
              <HeartHandshake size={16} />
              Contact Arogya
            </div>

            {/* Heading */}
            <h1 className="mt-5 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              We’re Here To Help Save Lives
            </h1>

            {/* Text */}
            <p className="mt-5 text-sm leading-7 text-red-50 sm:text-base">
              Contact Arogya Blood Centre for donor support, blood donation
              camps, emergency blood requests, or healthcare coordination.
            </p>

            {/* IMAGE SECTION */}
            <div className="group relative mt-8 overflow-hidden rounded-[28px] border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=1400&auto=format&fit=crop"
                alt="Blood Donation"
                className="h-[240px] w-full object-cover transition duration-[4000ms] group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>

              {/* Floating Card */}
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/20 bg-white/80 p-4 shadow-2xl backdrop-blur-xl transition duration-500 hover:-translate-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-700 animate-pulse">
                    <Droplets size={24} fill="currentColor" />
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 sm:text-base">
                      Emergency Blood Support
                    </h3>

                    <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                      Fast response during critical situations.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* INFO CARDS */}
            <div className="mt-8 space-y-4">
              <InfoCard
                icon={<MapPin size={18} />}
                title="Address"
                text=" Bearing E-Aasti No. 46-6-24-138C, Kusunur Road, Kalaburagi - 585105"
              />

              <InfoCard
                icon={<Phone size={18} />}
                title="Phone"
                text="+91 8951113002"
              />

              <InfoCard
                icon={<Mail size={18} />}
                title="Email"
                text="info@arogyacomponentbloodcentre"
              />

              <InfoCard
                icon={<Clock3 size={18} />}
                title="Working Hours"
                text="Available 24/7 for emergency coordination and donor support."
              />
            </div>
          </aside>

          {/* ================= RIGHT SIDE FORM ================= */}
          <form className="rounded-[34px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.06)] sm:p-8 lg:p-10">
            {/* Top */}
            <div className="border-b border-slate-200 pb-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-2 text-xs font-bold text-red-700 sm:text-sm">
                <ShieldCheck size={16} />
                Send Message
              </div>

              <h2 className="mt-5 text-3xl font-black text-slate-950 sm:text-4xl">
                Let’s Connect
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                Fill in your details and our support team will contact you as
                soon as possible.
              </p>
            </div>

            {/* Inputs */}
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <Input label="Full Name" placeholder="Enter your name" />

              <Input label="Mobile Number" placeholder="+91" />

              <Input label="Email Address" placeholder="name@example.com" />

              <Select
                label="Query Type"
                options={[
                  "Select query type",
                  "Donor Help",
                  "Camp Query",
                  "Emergency Request",
                  "General Query",
                ]}
              />

              {/* Textarea */}
              <label className="block text-sm font-bold text-slate-800 sm:col-span-2">
                Message
                <textarea
                  rows="7"
                  placeholder="Write your message..."
                  className="mt-2 w-full resize-none rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4 text-sm outline-none transition duration-300 placeholder:text-slate-400 focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-50"
                />
              </label>
            </div>

            {/* Bottom */}
            <div className="mt-8 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xl text-sm leading-7 text-slate-500">
                For urgent blood requirements, contact our emergency support
                directly instead of waiting for an email response.
              </p>

              <button
                type="submit"
                className="group inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-red-700 px-8 text-sm font-bold text-white shadow-xl transition duration-300 hover:scale-105 hover:bg-red-800"
              >
                <Send
                  size={18}
                  className="transition duration-300 group-hover:translate-x-1"
                />
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

/* ================= COMPONENTS ================= */

const InfoCard = ({ icon, title, text }) => {
  return (
    <div className="group flex items-start gap-4 rounded-[22px] border border-white/15 bg-white/10 p-4 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white/15">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/15 text-white transition duration-300 group-hover:scale-110">
        {icon}
      </span>

      <div>
        <h3 className="font-extrabold text-white">{title}</h3>

        <p className="mt-1 text-sm leading-6 text-red-50">{text}</p>
      </div>
    </div>
  );
};

const Input = ({ label, placeholder }) => {
  return (
    <label className="block text-sm font-bold text-slate-800">
      {label}

      <input
        type="text"
        placeholder={placeholder}
        className="mt-2 h-14 w-full rounded-[20px] border border-slate-200 bg-slate-50 px-5 text-sm outline-none transition duration-300 placeholder:text-slate-400 focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-50"
      />
    </label>
  );
};

const Select = ({ label, options }) => {
  return (
    <label className="block text-sm font-bold text-slate-800">
      {label}

      <select className="mt-2 h-14 w-full rounded-[20px] border border-slate-200 bg-slate-50 px-5 text-sm text-slate-700 outline-none transition duration-300 focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-50">
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
};

export default Contact;
