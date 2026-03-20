import { NavLink, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useAuth } from "../../hooks/useAuth";

const mainNavItems = [
  { label: "Feed", to: "/dashboard/feed", icon: "lucide:home" },
  {
    label: "Deadlines",
    to: "/dashboard/deadlines",
    icon: "fluent:calendar-16-regular",
  },
  {
    label: "Resources",
    to: "/dashboard/resources",
    icon: "grommet-icons:resources",
  },
];

const myPostsItem = {
  label: "My Posts",
  to: "/dashboard/my-posts",
  icon: "mdi:pencil-outline",
};

const secondaryNavItems = [
  {
    label: "Notifications",
    to: "/dashboard/notifications",
    icon: "lucide:bell",
  },
  {
    label: "Profile",
    to: "/dashboard/profile",
    icon: "fluent:person-20-regular",
  },
];

export default function Sidebar({ isMobile = false, onToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const canPost = user?.role === "lecturer" || user?.role === "course_rep";
  const allNavItems = canPost ? [...mainNavItems, myPostsItem] : mainNavItems;
  const iconSize = isMobile ? 20 : 28;
  const rounded = isMobile ? "rounded-xl" : "rounded-2xl";

  function handleLogout() {
    logout();
    navigate("/");
    onToggle?.();
  }

  // Desktop: collapsed = icon only (p-3.5, gap-0, w-auto so bg hugs icon)
  //          expanded  = icon + label (px-4 py-3.5, gap-2, w-full)
  // Mobile:  always expanded (px-4 py-3.5, gap-2, w-full)
  function navClassName({ isActive }) {
    if (isMobile) {
      const base = `flex items-center gap-2 px-4 py-3.5 w-full transition-colors ${rounded}`;
      return isActive ? `${base} bg-primary` : `${base} hover:bg-[#F6F6FC]`;
    }
    const base = `flex items-center transition-all ${rounded}
      p-3.5 group-hover:px-4 group-hover:py-3.5
      gap-0 group-hover:gap-2
      w-auto group-hover:w-full`;
    return isActive ? `${base} bg-primary` : `${base} hover:bg-[#F6F6FC]`;
  }

  function navContent({ isActive }) {
    return {
      iconCls: isActive ? "text-blue-1" : "text-secondary",
      textCls: isActive ? "text-blue-1" : "text-secondary",
    };
  }

  // Label: mobile = always visible, desktop = hidden (zero width) until hover
  function labelCls(textCls) {
    if (isMobile) {
      return `whitespace-nowrap text-sm font-normal ${textCls}`;
    }
    return `whitespace-nowrap text-base font-normal ${textCls}
      max-w-0 overflow-hidden opacity-0
      group-hover:max-w-xs group-hover:opacity-100
      transition-all duration-200 delay-100`;
  }

  function renderItem(item, isActive) {
    const { iconCls, textCls } = navContent({ isActive });
    return (
      <>
        <Icon
          icon={item.icon}
          width={iconSize}
          className={`shrink-0 ${iconCls}`}
        />
        <span className={labelCls(textCls)}>{item.label}</span>
      </>
    );
  }

  return (
    <aside
      className={`group h-full bg-white rounded-[20px] flex flex-col justify-between
        shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10),0px_1px_3px_0px_rgba(0,0,0,0.10)]
        border-r border-slate-200
        ${
          isMobile
            ? "px-3.5 py-6 w-60"
            : "p-6 overflow-hidden transition-[width] duration-300 ease-in-out w-26 hover:w-64"
        }`}
    >
      {/* Top nav */}
      <div className={`flex flex-col ${isMobile ? "gap-3.5 w-52" : "gap-4"}`}>
        {allNavItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={navClassName}>
            {({ isActive }) => renderItem(item, isActive)}
          </NavLink>
        ))}
      </div>

      {/* Bottom nav */}
      <div className={`flex flex-col gap-3 ${isMobile ? "w-52" : ""}`}>
        {secondaryNavItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={navClassName}>
            {({ isActive }) => renderItem(item, isActive)}
          </NavLink>
        ))}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`cursor-pointer flex items-center transition-all text-error-8 ${rounded}
            ${
              isMobile
                ? "gap-2 px-4 py-3.5 w-full bg-red-50 text-sm"
                : "p-3.5 group-hover:px-4 group-hover:py-3.5 gap-0 group-hover:gap-2 w-auto group-hover:w-full hover:bg-[#fff4f3] text-base"
            }`}
        >
          <Icon icon="mdi:logout" width={iconSize} className="shrink-0" />
          <span
            className={`whitespace-nowrap font-normal ${isMobile ? "text-sm" : "text-base"}
            ${isMobile ? "" : "max-w-0 overflow-hidden opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-200 delay-100"}`}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}
