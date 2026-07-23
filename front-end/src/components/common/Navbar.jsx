import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Droplet,
  LogIn,
  Menu,
  Search,
  ShieldCheck,
  UserRoundPlus,
  X,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDonorMenuOpen, setIsDonorMenuOpen] = useState(false);
  const navigate = useNavigate();

  const donorMenuRef = useRef(null);

  // USER LOGIC

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        donorMenuRef.current &&
        !donorMenuRef.current.contains(event.target)
      ) {
        setIsDonorMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const closeAllMenus = () => {
    setIsOpen(false);
    setIsDonorMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    toast.success("Logout successful");

    navigate("/");
  };

  const navLinkClass = ({ isActive }) =>
    `relative text-sm font-bold transition ${
      isActive ? "text-red-700" : "text-slate-800 hover:text-red-700"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <nav className="mx-auto flex h-[78px] w-full max-w-[1560px] items-center gap-4 px-4 sm:px-6 lg:px-8 xl:px-10">
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-red-700 text-white shadow-sm sm:h-14 sm:w-14">
            <Droplet size={28} fill="currentColor" />
          </span>

          <span className="leading-tight">
            <strong className="block text-[24px] font-extrabold text-red-700 sm:text-[30px]">
              Arogya Component
            </strong>

            <small className="block text-sm font-extrabold uppercase tracking-normal text-slate-900 sm:text-base">
              Blood Centre
            </small>
          </span>
        </Link>

        <div className="ml-auto hidden items-center gap-6 lg:flex xl:gap-7">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <div className="relative" ref={donorMenuRef}>
            <button
              type="button"
              onClick={() => setIsDonorMenuOpen((value) => !value)}
              className={`inline-flex items-center gap-1 text-sm font-bold transition ${
                isDonorMenuOpen
                  ? "text-red-700"
                  : "text-slate-800 hover:text-red-700"
              }`}
            >
              Donors
              <ChevronDown
                size={16}
                className={`transition duration-200 ${
                  isDonorMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`absolute left-0 top-full mt-3 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl transition-all duration-200 ${
                isDonorMenuOpen
                  ? "visible translate-y-0 opacity-100"
                  : "invisible translate-y-2 opacity-0"
              }`}
            >
              {/* <DropdownLink
                to="/camps"
                icon={<UserRoundPlus size={16} />}
                text="Register Camps"
                onClick={closeAllMenus}
              /> */}

              <DropdownLink
                to="/search-donor"
                icon={<Search size={16} />}
                text="Search Donor"
                onClick={closeAllMenus}
              />

              <DropdownLink
                to="/eligibility"
                icon={<ShieldCheck size={16} />}
                text="Eligibility Check"
                onClick={closeAllMenus}
              />

              <DropdownLink
                to="/login-donor"
                icon={<LogIn size={16} />}
                text="Donor Login"
                onClick={closeAllMenus}
              />
            </div>
          </div>

          <NavLink to="/camps" className={navLinkClass}>
            Camps
          </NavLink>

          <NavLink to="/reports" className={navLinkClass}>
            Reports
          </NavLink>

          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>

          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {/* ADMIN BUTTON */}

          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="px-3 py-2 text-xs font-bold uppercase tracking-widest text-gray-700 hover:text-[#ea2e0e] hover:bg-gray-100 rounded-full transition"
            >
              Admin
            </Link>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="flex h-12 items-center justify-center rounded-xl border border-slate-200 px-6 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/register-donor"
              className="flex h-12 items-center justify-center rounded-xl bg-red-700 px-6 text-sm font-bold text-white shadow-md shadow-red-700/20 transition hover:bg-red-800"
            >
              Get Started
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          aria-label="Toggle menu"
          className="ml-auto grid h-12 w-12 place-items-center rounded-xl border border-slate-200 text-slate-800 transition hover:bg-slate-50 lg:hidden"
        >
          {isOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </nav>

      <div
        className={`overflow-hidden border-t border-slate-200 bg-white shadow-lg transition-all duration-300 lg:hidden ${
          isOpen ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-4 sm:px-6">
          <div className="grid gap-1">
            <MobileLink to="/" text="Home" onClick={closeAllMenus} />

            {/* <MobileLink
              to="/register-camps"
              text="Register Camps"
              onClick={closeAllMenus}
            /> */}

            <MobileLink
              to="/search-donor"
              text="Search Donor"
              onClick={closeAllMenus}
            />

            <MobileLink
              to="/eligibility"
              text="Eligibility Check"
              onClick={closeAllMenus}
            />

            <MobileLink
              to="/blood-stock"
              text="Blood Stock"
              onClick={closeAllMenus}
            />

            <MobileLink to="/camps" text="Camps" onClick={closeAllMenus} />

            <MobileLink to="/reports" text="Reports" onClick={closeAllMenus} />

            <MobileLink to="/about" text="About" onClick={closeAllMenus} />

            <MobileLink to="/contact" text="Contact" onClick={closeAllMenus} />
          </div>

          <div className="mt-4 grid gap-3 border-t border-slate-200 pt-4">
            {/* MOBILE ADMIN */}

            {user?.role === "admin" && (
              <Link
                to="/admin"
                onClick={closeAllMenus}
                className="flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
              >
                <LogIn size={17} />
                ADMIN
              </Link>
            )}

            {user ? (
              <button
                onClick={handleLogout}
                className="flex h-12 items-center justify-center rounded-xl border border-slate-200 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/register-donor"
                onClick={closeAllMenus}
                className="flex h-12 items-center justify-center rounded-xl bg-red-700 text-sm font-bold text-white transition hover:bg-red-800"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

const DropdownLink = ({ to, icon, text, onClick }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-red-50 hover:text-red-700"
    >
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-50 text-slate-600">
        {icon}
      </span>

      {text}
    </Link>
  );
};

const MobileLink = ({ to, text, onClick }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="rounded-xl px-3 py-3 text-sm font-bold text-slate-800 transition hover:bg-red-50 hover:text-red-700"
    >
      {text}
    </Link>
  );
};

export default Navbar;
