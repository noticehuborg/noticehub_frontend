import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Button from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";
import logoAndText from "../../assets/img/logoandtext.png";

// Nav links for public header
const publicLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Components", to: "/components" },
];

// Sidebar nav links label (for dashboard header reference)
const dashboardLinks = [
  {
    label: "Feed",
    to: "/dashboard/feed",
    icon: "mdi:newspaper-variant-outline",
  },
  {
    label: "Deadlines",
    to: "/dashboard/deadlines",
    icon: "mdi:calendar-clock-outline",
  },
  { label: "Exams", to: "/dashboard/exams", icon: "mdi:file-document-outline" },
  {
    label: "Assignments",
    to: "/dashboard/assignments",
    icon: "mdi:book-open-outline",
  },
  {
    label: "Resources",
    to: "/dashboard/resources",
    icon: "mdi:folder-outline",
  },
];

function SearchBar({ className = "" }) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (q.trim())
      navigate(`/dashboard/search?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <Icon
        icon="mdi:magnify"
        width={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-gray-6"
      />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search notices..."
        className="w-full pl-9 pr-4 py-2 rounded-xl border border-neutral-gray-4 bg-neutral-gray-2
                   text-[var(--font-size-text-sm)] placeholder:text-neutral-gray-6
                   focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                   transition-all duration-200"
      />
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Public header: Logo + nav + Login + Get Started                     */
/* ------------------------------------------------------------------ */
function PublicHeader({ onMobileToggle, mobileOpen }) {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between w-full">
      <div>
        <img
          src={logoAndText}
          alt="NoticeHub Logo"
          className="w-32.5 sm:w-36 md:w-44.5"
        />
      </div>
      {/* Desktop nav links */}
      <div className="hidden lg:flex items-start mt-1 gap-8">
        {publicLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              `relative text-base transition-colors duration-200
               ${isActive ? "text-primary font-medium" : "text-neutral-gray-9 hover:text-primary"}`
            }
          >
            {({ isActive }) => (
              <div className="flex flex-col items-center gap-2 leading-none">
                {link.label}
                {isActive && (
                  <span className="w-4.5 h-0.5 bg-primary rounded-full" />
                )}
              </div>
            )}
          </NavLink>
        ))}
      </div>

      {/* Desktop CTA buttons */}
      {/* <div className="hidden md:flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/login")}
          className="font"
        >
          Login
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate("/register")}
        >
          Sign up
        </Button>
      </div> */}

      {/* Mobile hamburger */}
      <div className="flex-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/login")}
          className="hidden! sm:flex! px-6! py-2.5!"
        >
          Login
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate("/register")}
          className="px-6! sm:py-2.5!"
        >
          Sign up
        </Button>

        <button
          onClick={onMobileToggle}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-neutral-gray-2 transition-colors"
          aria-label="Toggle menu"
        >
          <Icon
            icon={mobileOpen ? "mdi:close" : "heroicons-solid:menu-alt-3"}
            width={24}
          />
        </button>
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Authenticated header: Logo + nav + search + notifications + avatar  */
/* ------------------------------------------------------------------ */
function AuthenticatedHeader({ onMobileToggle, mobileOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between w-full gap-4">
      {/* Desktop nav links */}
      <div className="hidden md:flex items-center gap-8">
        {publicLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              `relative text-[var(--font-size-text-base)] font-medium transition-colors duration-200 pb-1
               ${isActive ? "text-primary" : "text-neutral-gray-7 hover:text-neutral-gray-10"}`
            }
          >
            {({ isActive }) => (
              <>
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="hidden md:flex items-center gap-3 ml-auto">
        <SearchBar className="w-56 lg:w-72" />

        {/* Notifications */}
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-gray-2 text-neutral-gray-7 hover:text-neutral-gray-10 transition-colors relative">
          <Icon icon="mdi:bell-outline" width={22} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error-7" />
        </button>

        {/* Avatar / profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-[var(--font-size-text-sm)] hover:bg-primary-hover transition-colors"
          >
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-neutral-gray-4 shadow-lg py-1 z-50">
              <div className="px-4 py-2 border-b border-neutral-gray-3">
                <p className="font-medium text-[var(--font-size-text-sm)] text-neutral-gray-10">
                  {user?.name}
                </p>
                <p className="text-[var(--font-size-text-xs)] text-neutral-gray-6">
                  {user?.email}
                </p>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                  setProfileOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-[var(--font-size-text-sm)] text-error-7 hover:bg-error-2 transition-colors flex items-center gap-2"
              >
                <Icon icon="mdi:logout" width={16} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={onMobileToggle}
        className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-neutral-gray-2 transition-colors"
        aria-label="Toggle menu"
      >
        <Icon icon={mobileOpen ? "mdi:close" : "mdi:menu"} width={24} />
      </button>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Dashboard header: Logo + search + notifications + avatar            */
/* ------------------------------------------------------------------ */
function DashboardHeader({ onSidebarToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between w-full gap-4">
      <div className="flex items-center gap-3">
        {/* Sidebar toggle (mobile) */}
        <button
          onClick={onSidebarToggle}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-neutral-gray-2 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Icon icon="mdi:menu" width={24} />
        </button>
      </div>

      <SearchBar className="hidden md:block w-64 lg:w-80" />

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-gray-2 text-neutral-gray-7 hover:text-neutral-gray-10 transition-colors relative">
          <Icon icon="mdi:bell-outline" width={22} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error-7" />
        </button>

        {/* Avatar / profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-[var(--font-size-text-sm)] hover:bg-primary-hover transition-colors"
          >
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-neutral-gray-4 shadow-lg py-1 z-50">
              <div className="px-4 py-2 border-b border-neutral-gray-3">
                <p className="font-medium text-[var(--font-size-text-sm)] text-neutral-gray-10">
                  {user?.name}
                </p>
                <p className="text-[var(--font-size-text-xs)] text-neutral-gray-6">
                  {user?.email}
                </p>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                  setProfileOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-[var(--font-size-text-sm)] text-error-7 hover:bg-error-2 transition-colors flex items-center gap-2"
              >
                <Icon icon="mdi:logout" width={16} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile menu drawer (shared by public + authenticated variants)      */
/* ------------------------------------------------------------------ */
function MobileMenu({ variant, onClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="lg:hidden absolute left-0 right-0 top-full border-t border-neutral-gray-3 px-4 py-4 flex flex-col gap-3 bg-white shadow-md z-40">
      {variant === "public" || variant === "authenticated" ? (
        <>
          {publicLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `text-base font-medium py-2 px-3 rounded-lg transition-colors
                 ${isActive ? "bg-blue-1 text-primary" : "text-neutral-gray-8 hover:bg-neutral-gray-2"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </>
      ) : null}

      {variant === "public" && (
        <div className="sm:hidden flex flex-col gap-2 pt-2 border-t border-neutral-gray-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              navigate("/login");
              onClose();
            }}
            className="py-2.5"
          >
            Login
          </Button>
        </div>
      )}

      {variant === "authenticated" && (
        <div className="pt-2 border-t border-neutral-gray-3">
          <SearchBar className="w-full" />
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main export                                                          */
/* ------------------------------------------------------------------ */
export default function Header({ variant = "public", onSidebarToggle }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 30);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function toggleMobile() {
    setMobileOpen((v) => !v);
  }
  function closeMobile() {
    setMobileOpen(false);
  }

  return (
    <header className={`fixed top-0 z-40 w-full transition-all duration-300 ${scrolled ? "bg-neutral-gray-1 border-b border-neutral-gray-1 shadow-[0px_1px_1px_0px_rgba(0,0,0,0.12)]" : "bg-transparent border-b border-transparent"}`}>
      <div className="mx-auto px-5 md:px-8 xl:px-25 py-4">
        {variant === "public" && (
          <PublicHeader onMobileToggle={toggleMobile} mobileOpen={mobileOpen} />
        )}
        {variant === "authenticated" && (
          <AuthenticatedHeader
            onMobileToggle={toggleMobile}
            mobileOpen={mobileOpen}
          />
        )}
        {variant === "dashboard" && (
          <DashboardHeader onSidebarToggle={onSidebarToggle} />
        )}
      </div>
      {mobileOpen && variant !== "dashboard" && (
        <MobileMenu variant={variant} onClose={closeMobile} />
      )}
    </header>
  );
}
