import {
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Activity,
  Clock3,
  Droplets,
  ArrowRight,
} from "lucide-react";

const EligibilityPage = () => {
  const eligiblePoints = [
    "Age between 18 - 65 years",
    "Minimum weight of 50kg",
    "Normal hemoglobin level",
    "Healthy blood pressure",
    "Proper sleep before donation",
    "3 months gap after last donation",
    "Hydrated and physically fit",
    "No recent tattoos or surgeries",
  ];

  const notEligiblePoints = [
    "Cold, fever, or infection",
    "Pregnant or breastfeeding",
    "Recent blood donation",
    "Low hemoglobin or anemia",
    "Major surgery in recent months",
    "Severe heart or kidney disease",
    "Taking strong antibiotics",
    "Contagious diseases",
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] overflow-hidden">
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-700 to-rose-900"></div>

        {/* Animated Blur Circles */}
        <div className="absolute top-[-100px] right-[-100px] w-[320px] h-[320px] bg-white/10 rounded-full blur-3xl animate-pulse"></div>

        <div className="absolute bottom-[-120px] left-[-100px] w-[300px] h-[300px] bg-red-300/10 rounded-full blur-3xl animate-pulse"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-16 sm:pt-20 lg:pt-28 pb-20 sm:pb-24 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            {/* ================= LEFT CONTENT ================= */}
            <div className="order-2 lg:order-1 text-center lg:text-left animate-[fadeIn_1s_ease]">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full backdrop-blur-md mb-6 hover:scale-105 transition duration-300">
                <HeartHandshake size={16} />
                <span className="text-xs sm:text-sm font-medium tracking-wide">
                  Blood Donation Eligibility
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
                Check Eligibility Before Donating Blood
              </h1>

              {/* Description */}
              <p className="mt-6 text-sm sm:text-base lg:text-lg text-red-100 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Donating blood is a life-saving act. Ensure you meet the
                required eligibility criteria for a safe and healthy donation
                process.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-8">
                <button className="group w-full sm:w-auto bg-white hover:bg-red-50 text-red-700 px-7 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-2xl hover:scale-105">
                  <span className="flex items-center justify-center gap-2">
                    Become a Donor
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-all"
                    />
                  </span>
                </button>

                <button className="w-full sm:w-auto border border-white/30 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 px-7 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105">
                  Learn More
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
                {[
                  { title: "3+", text: "Lives Saved" },
                  { title: "10m", text: "Quick Process" },
                  { title: "100%", text: "Safe Donation" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-3xl p-5 hover:-translate-y-2 hover:bg-white/20 transition-all duration-500 cursor-pointer"
                  >
                    <h3 className="text-3xl font-black text-white">
                      {item.title}
                    </h3>

                    <p className="text-red-100 text-sm mt-1">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ================= RIGHT IMAGE ================= */}
            <div className="order-1 lg:order-2 relative">
              <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[30px] sm:rounded-[40px] p-3 sm:p-5 lg:p-7 shadow-[0_20px_80px_rgba(0,0,0,0.25)] hover:scale-[1.02] transition-all duration-700">
                {/* Animated Image */}
                <div className="overflow-hidden rounded-[24px] sm:rounded-[32px]">
                  <img
                    src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=1200&auto=format&fit=crop"
                    alt="Blood Donation"
                    className="w-full h-[300px] sm:h-[420px] lg:h-[550px] object-cover hover:scale-110 transition-transform duration-[3000ms] ease-out"
                  />
                </div>

                {/* Floating Card */}
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-8 sm:-bottom-10 w-[90%] bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-gray-100 hover:-translate-y-2 transition-all duration-500">
                  <div className="flex items-center gap-4">
                    <div className="bg-red-100 p-3 sm:p-4 rounded-2xl animate-bounce">
                      <Droplets className="text-red-600" size={28} />
                    </div>

                    <div>
                      <h3 className="text-base sm:text-xl font-bold text-gray-900">
                        Every Drop Matters
                      </h3>

                      <p className="text-gray-500 text-sm sm:text-base mt-1">
                        One donation can save multiple lives.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Blur */}
              <div className="absolute -top-8 -left-8 w-20 h-20 bg-red-400/20 rounded-full blur-2xl animate-ping"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ELIGIBILITY SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
          {/* ELIGIBLE CARD */}
          <div className="bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 lg:p-10 border border-gray-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
            <div className="flex items-start sm:items-center gap-4 mb-8">
              <div className="bg-green-100 p-4 rounded-3xl animate-pulse">
                <CheckCircle2 className="text-green-600" size={32} />
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                  Eligible Donors
                </h2>

                <p className="text-gray-500 mt-1 text-sm sm:text-base">
                  Requirements for donation
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {eligiblePoints.map((item, index) => (
                <div
                  key={index}
                  className="group flex items-start gap-4 p-4 rounded-2xl bg-green-50 hover:bg-green-100/70 hover:translate-x-2 transition-all duration-300"
                >
                  <CheckCircle2
                    className="text-green-600 mt-1 flex-shrink-0 group-hover:scale-110 transition-all"
                    size={22}
                  />

                  <p className="text-gray-700 text-sm sm:text-[15px] font-medium">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* NOT ELIGIBLE CARD */}
          <div className="bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 lg:p-10 border border-gray-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
            <div className="flex items-start sm:items-center gap-4 mb-8">
              <div className="bg-red-100 p-4 rounded-3xl animate-pulse">
                <XCircle className="text-red-600" size={32} />
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                  Restrictions
                </h2>

                <p className="text-gray-500 mt-1 text-sm sm:text-base">
                  Avoid donation under these conditions
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {notEligiblePoints.map((item, index) => (
                <div
                  key={index}
                  className="group flex items-start gap-4 p-4 rounded-2xl bg-red-50 hover:bg-red-100/70 hover:translate-x-2 transition-all duration-300"
                >
                  <XCircle
                    className="text-red-600 mt-1 flex-shrink-0 group-hover:scale-110 transition-all"
                    size={22}
                  />

                  <p className="text-gray-700 text-sm sm:text-[15px] font-medium">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-16 sm:pb-20 lg:pb-24">
        <div className="bg-gradient-to-r from-gray-950 to-gray-900 rounded-[30px] sm:rounded-[40px] p-6 sm:p-10 lg:p-16 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[250px] sm:w-[320px] h-[250px] sm:h-[320px] bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>

          <div className="relative grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: (
                  <ShieldCheck className="text-red-400" size={32} />
                ),
                title: "Safe Donation",
                text: "Donations are monitored by professionals using sterilized equipment and strict safety protocols.",
              },
              {
                icon: <Clock3 className="text-red-400" size={32} />,
                title: "Quick Process",
                text: "The complete donation process takes only a few minutes while helping save lives.",
              },
              {
                icon: <Activity className="text-red-400" size={32} />,
                title: "Health Screening",
                text: "Every donor undergoes a health check to ensure safety for both donor and recipient.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 hover:-translate-y-3 hover:bg-white/10 transition-all duration-500 cursor-pointer"
              >
                <div className="bg-red-500/10 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:rotate-6 transition-all duration-500">
                  {item.icon}
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {item.title}
                </h3>

                <p className="text-gray-400 mt-4 leading-relaxed text-sm sm:text-base">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default EligibilityPage;