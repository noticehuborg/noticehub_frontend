import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Button from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { useModal, MODAL } from "../../context/ModalContext";
import logoAndText from "../../assets/img/logoandtext.png";

// ─── Mock notifications ────────────────────────────────────────────────────────
const MOCK_NOTIFS = [
  { id: 1, type: "notice",   title: "Updated Class Schedule – Network Security",   time: "2h ago",  read: false },
  { id: 2, type: "deadline", title: "CSM 342 Mid-Semester Exam is tomorrow",        time: "3h ago",  read: false },
  { id: 3, type: "comment",  title: "Eliah replied to your comment on the post",    time: "1d ago",  read: true  },
  { id: 4, type: "notice",   title: "New assignment posted: Data Structures #3",    time: "2d ago",  read: true  },
  { id: 5, type: "info",     title: "Your level correction request was reviewed",   time: "3d ago",  read: true  },
];

const NOTIF_ICON_MAP = {
  notice:   { icon: "lucide:bell",                  bg: "bg-blue-1",    color: "text-primary"     },
  deadline: { icon: "mdi:calendar-clock-outline",   bg: "bg-warning-1", color: "text-warning-7"   },
  comment:  { icon: "iconamoon:comment",             bg: "bg-success-1", color: "text-success-7"   },
  info:     { icon: "iconoir:info-empty",            bg: "bg-section-bg",color: "text-neutral-gray-6" },
};

const UNREAD_COUNT = MOCK_NOTIFS.filter((n) => !n.read).length;

// ─── Notification dropdown ─────────────────────────────────────────────────────
function NotifDropdown({ navigate, onClose }) {
  return (
    <div className="absolute right-0 top-full mt-2 z-50 w-80 bg-white rounded-2xl shadow-[0px_8px_30px_rgba(0,0,0,0.14)] border border-neutral-gray-2 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-gray-2">
        <span className="text-sm font-semibold text-neutral-gray-10">Notifications</span>
        <button className="cursor-pointer text-xs text-primary font-medium hover:text-primary-hover transition-colors">
          Mark all as read
        </button>
      </div>

      <div className="flex flex-col max-h-72 overflow-y-auto">
        {MOCK_NOTIFS.map((n) => {
          const { icon, bg, color } = NOTIF_ICON_MAP[n.type] || NOTIF_ICON_MAP.info;
          return (
            <div
              key={n.id}
              className={`flex items-start gap-3 px-4 py-3 hover:bg-section-bg transition-colors cursor-pointer ${!n.read ? "border-l-[3px] border-primary" : "border-l-[3px] border-transparent"}`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${bg}`}>
                <Icon icon={icon} className={`w-3.5 h-3.5 ${color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs leading-[1.4] line-clamp-2 ${!n.read ? "font-medium text-neutral-gray-9" : "text-neutral-gray-7"}`}>
                  {n.title}
                </p>
                <p className="text-[11px] text-neutral-gray-5 mt-0.5">{n.time}</p>
              </div>
              {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />}
            </div>
          );
        })}
      </div>

      <div className="border-t border-neutral-gray-2 px-4 py-2.5">
        <button
          onClick={() => { navigate("/dashboard/notifications"); onClose(); }}
          className="cursor-pointer w-full text-xs text-primary font-medium text-center hover:text-primary-hover transition-colors"
        >
          View all notifications →
        </button>
      </div>
    </div>
  );
}

// ─── Profile dropdown ──────────────────────────────────────────────────────────
function ProfileDropdown({ user, navigate, onClose }) {
  const { logout } = useAuth();
  const initials = user?.name?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "U";

  function handleLogout() {
    logout();
    navigate("/");
    onClose();
  }

  return (
    <div className="absolute right-0 top-full mt-2 z-50 w-64 bg-white rounded-2xl shadow-[0px_8px_30px_rgba(0,0,0,0.14)] border border-neutral-gray-2 overflow-hidden">
      {/* Avatar + name + email */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-neutral-gray-2">
        <div className="w-10 h-10 rounded-full bg-linear-to-b from-blue-8 to-blue-7 flex items-center justify-center text-white font-semibold text-sm shrink-0 shadow-sm">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-neutral-gray-10 truncate">{user?.name || "Student"}</p>
          <p className="text-xs text-neutral-gray-5 truncate">{user?.email}</p>
        </div>
      </div>

      {/* Program + Level */}
      <div className="px-4 py-3 border-b border-neutral-gray-2 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-neutral-gray-5">Program</span>
          <span className="text-xs font-medium text-neutral-gray-8 text-right">Bsc. Computer Science</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-neutral-gray-5">Level</span>
          <span className="text-xs font-medium text-neutral-gray-8">Level 300</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col p-2 gap-0.5">
        <button
          onClick={() => { navigate("/dashboard/profile"); onClose(); }}
          className="cursor-pointer flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-neutral-gray-7 hover:bg-section-bg hover:text-neutral-gray-9 transition-colors text-left"
        >
          <Icon icon="fluent:person-20-regular" className="w-4 h-4 shrink-0" />
          View Profile
        </button>
        <button
          onClick={() => { navigate("/dashboard/feed"); onClose(); }}
          className="cursor-pointer flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-neutral-gray-7 hover:bg-section-bg hover:text-neutral-gray-9 transition-colors text-left"
        >
          <Icon icon="mdi:view-dashboard-outline" className="w-4 h-4 shrink-0" />
          Dashboard
        </button>
        <div className="my-1 border-t border-neutral-gray-2" />
        <button
          onClick={handleLogout}
          className="cursor-pointer flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-error-7 hover:bg-error-1 transition-colors text-left"
        >
          <Icon icon="mdi:logout" className="w-4 h-4 shrink-0" />
          Log out
        </button>
      </div>
    </div>
  );
}

// Nav links for public header
const publicLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

/* ------------------------------------------------------------------ */
/* Public header: Logo + nav + Login + Get Started                     */
/* ------------------------------------------------------------------ */
function PublicHeader({ onMobileToggle, mobileOpen }) {
  const { openModal } = useModal();
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between w-full">
      <div onClick={() => {navigate("/");}} className="cursor-pointer">
        <img
          src={logoAndText}
          alt="NoticeHub Logo"
          className="w-32.5 sm:w-36 md:w-40 lg:w-44.5"
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
              `relative text-base transition-colors duration-200 outline-none
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

      {/* Mobile hamburger */}
      <div className="flex-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => openModal(MODAL.LOGIN)}
          className="hidden! sm:flex! px-6! py-2.5!"
        >
          Login
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => openModal(MODAL.REGISTER)}
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
/* Authenticated header: Logo + nav + bell + avatar + My feed btn     */
/* ------------------------------------------------------------------ */
function AuthenticatedHeader({ onMobileToggle, mobileOpen }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  useEffect(() => {
    if (!notifOpen && !profileOpen) return;
    function handleClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [notifOpen, profileOpen]);

  return (
    <nav className="flex items-center justify-between w-full gap-4">
      <div onClick={() => navigate("/")} className="cursor-pointer">
        <img src={logoAndText} alt="NoticeHub Logo" className="w-32.5 sm:w-36 md:w-40 lg:w-44.5" />
      </div>

      <div className="hidden lg:flex items-start mt-1 gap-8">
        {publicLinks.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.to === "/"}
            className={({ isActive }) =>
              `relative text-base transition-colors duration-200 outline-none
               ${isActive ? "text-primary font-medium" : "text-neutral-gray-9 hover:text-primary"}`
            }
          >
            {({ isActive }) => (
              <div className="flex flex-col items-center gap-2 leading-none">
                {link.label}
                {isActive && <span className="w-4.5 h-0.5 bg-primary rounded-full" />}
              </div>
            )}
          </NavLink>
        ))}
      </div>

      <div className="flex items-center gap-4">
        {/* Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setNotifOpen((v) => !v); setProfileOpen(false); }}
            className="cursor-pointer relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-neutral-gray-2 transition-colors text-neutral-gray-9"
            aria-label="Notifications"
          >
            <Icon icon="lucide:bell" width={20} />
            {UNREAD_COUNT > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-linear-to-b from-red-500 to-red-600 rounded-[10px] flex items-center justify-center text-white text-xs font-medium leading-none shadow-[0px_4px_6px_-4px_rgba(239,68,68,0.30),0px_10px_15px_-3px_rgba(239,68,68,0.30)]">
                {UNREAD_COUNT}
              </span>
            )}
          </button>
          {notifOpen && <NotifDropdown navigate={navigate} onClose={() => setNotifOpen(false)} />}
        </div>

        {/* Avatar */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false); }}
            className="cursor-pointer w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ease-in-out"
            aria-label="Profile"
          >
            <div className="w-8 h-8 bg-linear-to-b from-blue-8 to-blue-7 rounded-full flex items-center justify-center shadow-[0px_2px_4px_-4px_rgba(79,70,229,0.20),0px_5px_10px_-3px_rgba(79,70,229,0.20)]">
              <span className="text-white text-sm font-medium leading-5">{initials}</span>
            </div>
          </button>
          {profileOpen && <ProfileDropdown user={user} navigate={navigate} onClose={() => setProfileOpen(false)} />}
        </div>

        <Button variant="primary" size="sm" onClick={() => navigate("/dashboard/feed")} className="hidden! xsm:flex! px-6! sm:py-2.5!">
          My feed
        </Button>
        <button onClick={onMobileToggle} className="lg:hidden w-fit h-fit flex items-center justify-center rounded-lg hover:bg-neutral-gray-2 transition-colors" aria-label="Toggle menu">
          <Icon icon={mobileOpen ? "mdi:close" : "heroicons-solid:menu-alt-3"} width={24} />
        </button>
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Dashboard header: Logo + search icon + bell + avatar + Go to site  */
/* ------------------------------------------------------------------ */
function DashboardHeader({ onSidebarToggle }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    if (!notifOpen && !profileOpen) return;
    function handleClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [notifOpen, profileOpen]);

  return (
    <nav className="flex items-center justify-between w-full gap-3">
      <div className="flex items-center gap-2">
        <button onClick={onSidebarToggle} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-neutral-gray-2 transition-colors" aria-label="Toggle sidebar">
          <Icon icon="mdi:menu" width={24} />
        </button>
        <img src={logoAndText} alt="NoticeHub" className="w-30 sm:w-34 md:w-38 lg:w-44.5" />
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Search */}
          <button onClick={() => navigate("/dashboard/search")} className="cursor-pointer w-9 h-9 flex items-center justify-center rounded-xl hover:bg-neutral-gray-2 text-neutral-gray-9 transition-colors" aria-label="Search">
            <Icon icon="mingcute:search-line" width={18} />
          </button>

          {/* Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setNotifOpen((v) => !v); setProfileOpen(false); }}
              className="cursor-pointer relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-neutral-gray-2 transition-colors text-neutral-gray-9"
              aria-label="Notifications"
            >
              <Icon icon="lucide:bell" width={20} />
              {UNREAD_COUNT > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-linear-to-b from-red-500 to-red-600 rounded-[10px] flex items-center justify-center text-white text-xs font-medium leading-none shadow-[0px_4px_6px_-4px_rgba(239,68,68,0.30),0px_10px_15px_-3px_rgba(239,68,68,0.30)]">
                  {UNREAD_COUNT}
                </span>
              )}
            </button>
            {notifOpen && <NotifDropdown navigate={navigate} onClose={() => setNotifOpen(false)} />}
          </div>

          {/* Avatar */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false); }}
              className="cursor-pointer w-9 h-9 rounded-full bg-linear-to-b from-blue-8 to-blue-7 text-neutral-gray-1 flex items-center justify-center font-semibold text-sm shrink-0"
              aria-label="Profile"
            >
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </button>
            {profileOpen && <ProfileDropdown user={user} navigate={navigate} onClose={() => setProfileOpen(false)} />}
          </div>
        </div>

        <Button variant="primary" size="md" onClick={() => navigate("/")} className="hidden! xsm:flex! rounded-full! sm:rounded-xl! sm:px-4! p-2.25! sm:py-2.5!">
          <Icon icon="iconoir:internet" width={24} className="w-4.5 h-4.5" />
          <span className="hidden sm:flex text-sm">Go to Website</span>
        </Button>
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile menu drawer (shared by public + authenticated variants)      */
/* ------------------------------------------------------------------ */
function MobileMenu({ variant, onClose }) {
  const { openModal } = useModal();
  const navigate = useNavigate();

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
                `text-base text-center font-medium py-2 px-3 rounded-lg transition-colors
                 ${isActive ? "bg-blue-1 text-primary" : "text-neutral-gray-8 hover:bg-neutral-gray-2"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </>
      ) : null}

      {variant === "public" && (
        <div className="sm:hidden flex flex-col gap-2 pt-2 sm:border-none border-t border-neutral-gray-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onClose();
              openModal(MODAL.LOGIN);
            }}
            className="py-2.5"
          >
            Login
          </Button>
        </div>
      )}

      {variant === "authenticated" && (
        <div className="xsm:hidden pt-2 xsm:border-none border-t border-neutral-gray-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onClose();
              navigate("/dashboard/feed");
            }}
            className="w-full! py-2.5!"
          >
            My feed
          </Button>
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
    <header
      className={`${variant === "dashboard" ? "" : "fixed"} top-0 z-40 w-full transition-all duration-300 ${scrolled || variant === "dashboard" ? "bg-neutral-gray-1 backdrop-blur-2xl border-b border-neutral-gray-1 shadow-[0px_1px_1px_0px_rgba(0,0,0,0.12)]" : "bg-transparent border-b border-transparent"}`}
    >
      <div className="mx-auto px-5 md:px-8 xl:px-25 py-3.5">
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
