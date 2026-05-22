import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import {
  HiSun, HiMoon, HiMenu, HiX, HiChevronDown,
  HiUser, HiLogout, HiLightBulb, HiCollection,
  HiPlusCircle, HiAnnotation,
} from "react-icons/hi";

const navLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/ideas", label: "Ideas" },
  { to: "/add-idea", label: "Add Idea", private: true },
  { to: "/my-ideas", label: "My Ideas", private: true },
  { to: "/my-interactions", label: "My Interactions", private: true },
];

const Navbar = () => {
  const { user, loading, theme, toggleTheme, logoutUser } = useAuth();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen]   = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const dropdownRef = useRef(null);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully!");
      navigate("/");
    } catch {
      toast.error("Failed to logout.");
    }
    setDropdownOpen(false);
    setMobileOpen(false);
  };

  const visibleLinks = navLinks.filter(
    (link) => !link.private || user
  );

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive
        ? "text-primary-600 dark:text-primary-400"
        : "text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-gray-950/90 backdrop-blur shadow-sm border-b border-gray-100 dark:border-gray-800"
          : "bg-white dark:bg-gray-950 border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <HiLightBulb size={18} className="text-white" />
            </div>
            <span className="text-lg font-heading font-bold text-gray-900 dark:text-white">
              IdeaVault
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {visibleLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={navLinkClass}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <HiSun size={20} /> : <HiMoon size={20} />}
            </button>

            {/* Auth area */}
            {!loading && (
              <>
                {user ? (
                  /* User dropdown */
                  <div className="relative hidden md:block" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen((p) => !p)}
                      className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                      <img
                        src={
                          user.photoURL ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.displayName || "U"
                          )}&background=6366f1&color=fff&size=80`
                        }
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.displayName || "U"
                          )}&background=6366f1&color=fff&size=80`;
                        }}
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[100px] truncate">
                        {user.displayName?.split(" ")[0] || "User"}
                      </span>
                      <HiChevronDown
                        size={14}
                        className={`text-gray-400 transition-transform duration-200 ${
                          dropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-52 card shadow-lg border border-gray-100 dark:border-gray-700 py-1 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-700">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Account
                          </p>
                          <p className="text-sm font-medium text-gray-800 dark:text-white mt-0.5 truncate">
                            {user.email}
                          </p>
                        </div>

                        {[
                          { to: "/profile", icon: <HiUser size={15} />, label: "My Profile" },
                          { to: "/add-idea", icon: <HiPlusCircle size={15} />, label: "Add Idea" },
                          { to: "/my-ideas", icon: <HiCollection size={15} />, label: "My Ideas" },
                          { to: "/my-interactions", icon: <HiAnnotation size={15} />, label: "My Interactions" },
                        ].map((item) => (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                          >
                            <span className="text-gray-400">{item.icon}</span>
                            {item.label}
                          </Link>
                        ))}

                        <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                          >
                            <HiLogout size={15} />
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="hidden md:flex items-center gap-2">
                    <Link to="/login" className="btn-outline py-2 text-sm">
                      Login
                    </Link>
                    <Link to="/register" className="btn-primary py-2 text-sm">
                      Register
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen((p) => !p)}
              className="md:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {mobileOpen ? <HiX size={22} /> : <HiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-4 space-y-1">
          {visibleLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2 mb-2">
                  <img
                    src={
                      user.photoURL ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.displayName || "U"
                      )}&background=6366f1&color=fff&size=80`
                    }
                    alt="avatar"
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      {user.displayName || "User"}
                    </p>
                    <p className="text-xs text-gray-400 truncate max-w-[180px]">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <HiUser size={16} />
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <HiLogout size={16} />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="btn-outline w-full justify-center py-2.5"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary w-full justify-center py-2.5"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
