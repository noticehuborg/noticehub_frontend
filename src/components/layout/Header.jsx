import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Button from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { useModal, MODAL } from "../../context/ModalContext";
import logoAndText from "../../assets/img/logoandtext.png";

// Nav links for public header
const publicLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Components", to: "/components" },
];

/* ------------------------------------------------------------------ */
/* Public header: Logo + nav + Login + Get Started                     */
/* ------------------------------------------------------------------ */
function PublicHeader({ onMobileToggle, mobileOpen }) {
  const { openModal } = useModal();

  return (
    <nav className="flex items-center justify-between w-full">
      <div>
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

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <nav className="flex items-center justify-between w-full gap-4">
      {/* Logo */}
      <div>
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

      {/* Right: bell + avatar + My feed */}
      <div className="flex items-center gap-4">
        {/* Bell with number badge */}
        <button
          onClick={() => navigate("/dashboard/notifications")}
          className="cursor-pointer relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-neutral-gray-4 transition-colors text-neutral-gray-9"
          aria-label="Notifications"
        >
          <Icon icon="lucide:bell" width={20} />
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-linear-to-b from-red-500 to-red-600 rounded-[10px] flex items-center justify-center text-white text-xs font-medium leading-none shadow-[0px_4px_6px_-4px_rgba(239,68,68,0.30),0px_10px_15px_-3px_rgba(239,68,68,0.30)]">
            2
          </span>
        </button>

        {/* Avatar with blue gradient */}
        <button
          onClick={() => navigate("/dashboard/profile")}
          className="cursor-pointer hover:mb-1 w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ease-in-out"
          aria-label="Profile"
        >
          <div className="w-8 h-8 bg-linear-to-b from-blue-8 to-blue-7 rounded-full flex items-center justify-center shadow-[0px_2px_4px_-4px_rgba(79,70,229,0.20),0px_5px_10px_-3px_rgba(79,70,229,0.20)]">
            <span className="text-white text-sm font-medium leading-5">
              {initials}
            </span>
          </div>
        </button>

        {/* My feed button */}
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate("/dashboard/feed")}
          className="hidden! xsm:flex! px-6! sm:py-2.5!"
        >
          My feed
        </Button>
        {/* Mobile hamburger */}
        <button
          onClick={onMobileToggle}
          className="lg:hidden w-fit h-fit flex items-center justify-center rounded-lg hover:bg-neutral-gray-2 transition-colors"
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
/* Dashboard header: Logo + search icon + bell + avatar + Go to site  */
/* ------------------------------------------------------------------ */
function DashboardHeader({ onSidebarToggle }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between w-full gap-3">
      {/* Left: hamburger (mobile only) + logo */}
      <div className="flex items-center gap-2">
        <button
          onClick={onSidebarToggle}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-neutral-gray-2 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Icon icon="mdi:menu" width={24} />
        </button>
        <img
          src={logoAndText}
          alt="NoticeHub"
          className="w-30 sm:w-34 md:w-38 lg:w-44.5"
        />
      </div>

      {/* Right: action icons */}
      <div className="flex items-center gap-3 sm:gap-5">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Search icon */}
          <button
            onClick={() => navigate("/dashboard/search")}
            className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-gray-4 text-neutral-gray-7 hover:text-neutral-gray-9 transition-colors"
            aria-label="Search"
          >
            <Icon icon="mingcute:search-line" width={18} />
          </button>

          {/* Bell with badge */}
          <button
            onClick={() => navigate("/dashboard/notifications")}
            className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-gray-4 text-neutral-gray-7 hover:text-neutral-gray-9 transition-colors relative"
            aria-label="Notifications"
          >
            <Icon icon="lucide:bell" width={18} />
            <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-linear-to-b from-red-500 to-red-600 rounded-[10px] flex items-center justify-center text-white text-xs font-medium leading-none shadow-[0px_4px_6px_-4px_rgba(239,68,68,0.30),0px_10px_15px_-3px_rgba(239,68,68,0.30)]">
              2
            </span>{" "}
          </button>

          {/* Avatar initials */}
          <button
            onClick={() => navigate("/dashboard/profile")}
            className="cursor-pointer hover:mb-1 w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-[var(--font-size-text-sm)] hover:bg-primary-hover transition-colors shrink-0"
            aria-label="Profile"
          >
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </button>
        </div>

        {/* Go to Website — text button on lg+, icon on mobile */}
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate("/")}
          className="hidden! xsm:flex!  rounded-full! sm:rounded-xl! sm:px-4!  p-2.25! sm:py-2.5!"
        >
          <Icon
            icon="iconoir:internet"
            width={24}
            className="w-4.5 h-4.5 md:w-6 md:h-6"
          />
          <span className="hidden sm:flex text-sm md:text-base">
            Go to Website
          </span>
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
