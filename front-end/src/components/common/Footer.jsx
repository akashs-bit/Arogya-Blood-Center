import { Droplet, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto grid w-full max-w-[1720px] gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_0.9fr_1.15fr] lg:px-8 xl:gap-14 2xl:px-10">
        <div>
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="grid h-13 w-13 place-items-center rounded-full bg-white text-red-700 shadow-sm sm:h-14 sm:w-14">
              <Droplet size={28} fill="currentColor" />
            </span>

            <span className="leading-tight">
              <strong className="block text-[26px] font-extrabold text-white sm:text-[30px]">
                Arogya Component
              </strong>
              <small className="block text-sm font-extrabold uppercase tracking-normal text-slate-300 sm:text-base">
                Blood Centre
              </small>
            </span>
          </Link>

          <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
            Empowering communities through voluntary blood donation and advanced
            donor management solutions for safer, faster, and more reliable
            blood centre operations.
          </p>

          <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <p className="text-sm font-bold text-white">Need urgent blood?</p>
            <p className="mt-1 text-sm leading-6 text-slate-400">
              Contact the blood centre team for donor availability and emergency
              support.
            </p>

            <Link
              to="/contact"
              className="mt-4 inline-flex h-11 items-center justify-center rounded-lg bg-red-700 px-5 text-sm font-bold text-white transition hover:bg-red-800"
            >
              Contact Centre
            </Link>
          </div>
        </div>

        <FooterColumn
          title="Quick Links"
          links={[
            ["Home", ""],
            ["About Us", ""],
            ["Contact Us", ""],
            ["Privacy Policy", ""],
            ["Terms & Conditions", ""],
            ["FAQ", ""],
          ]}
        />

        <FooterColumn
          title="Services"
          links={[
            ["Donor Management", ""],
            ["Blood Stock Tracking", ""],
            ["Emergency Alerts", ""],
            ["Camp Management", ""],
            ["Reports & Analytics", ""],
            ["API Integration", ""],
          ]}
        />

        <div>
          <h3 className="text-base font-bold text-white">Contact Us</h3>

          <div className="mt-5 space-y-4 text-sm text-slate-400">
            <ContactItem icon={<MapPin size={18} />}>
              <div className="space-y-3">
                {/* BLOOD CENTRE */}

                <div>
                  <h4 className="text-sm font-black text-white">
                    Arogya Component Blood Centre
                  </h4>

                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    Corporation No: 2-910/64/16/GF, 2-910/64/16FF &
                    2-910/64/16SF
                  </p>
                </div>

                {/* ADDRESS */}

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <p className="text-sm leading-7 text-slate-300">
                    Bearing E-Aasti No. 46-6-24-138C, Kusunur Road, Kalaburagi -
                    585105
                  </p>
                </div>
              </div>
            </ContactItem>
            <ContactItem icon={<Phone size={18} />}>
              <div className="flex flex-col gap-2">
                {/* NUMBER 1 */}

                <div className="group flex items-center gap-3 text-sm font-semibold text-slate-300 transition duration-300 hover:text-white">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400 transition duration-300 group-hover:scale-125"></span>
                  +91 89511 13002
                </div>

                {/* NUMBER 2 */}

                <div className="group flex items-center gap-3 text-sm font-semibold text-slate-300 transition duration-300 hover:text-white">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400 transition duration-300 group-hover:scale-125"></span>
                  +91 89511 14002
                </div>
              </div>
            </ContactItem>

            <ContactItem icon={<Mail size={18} />}>
              <a
                href="mailto:arogyacomponentbloodcenter@gmail.com"
                className="break-all transition hover:text-white"
              >
                arogyacomponentbloodcenter@gmail.com
              </a>
            </ContactItem>
          </div>

          <div className="mt-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
            <p className="text-sm font-bold text-white">Available 24/7</p>
            <p className="mt-1 text-sm leading-6 text-slate-400">
              Emergency support and donor coordination remain active around the
              clock.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[1720px] flex-col gap-3 px-4 py-5 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8 2xl:px-10">
          <p>© 2026 Arogya Component Blood Centre. All rights reserved.</p>

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link to="/privacy-policy" className="transition hover:text-white">
              Privacy
            </Link>
            <Link to="/terms" className="transition hover:text-white">
              Terms
            </Link>
            <Link to="/contact" className="transition hover:text-white">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterColumn = ({ title, links }) => {
  return (
    <div>
      <h3 className="text-base font-bold text-white">{title}</h3>

      <ul className="mt-5 space-y-3">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link
              to={href}
              className="inline-flex text-sm text-slate-400 transition hover:translate-x-1 hover:text-white"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ContactItem = ({ icon, children }) => {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/5 text-red-400">
        {icon}
      </span>
      <div className="leading-6">{children}</div>
    </div>
  );
};

export default Footer;
