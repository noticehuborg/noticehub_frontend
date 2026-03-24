import { useState, useMemo } from "react";
import { Icon } from "@iconify/react";
import Button from "../../components/ui/Button";
import FilterPills from "../../components/dashboard/FilterPills";

// ─── Config ───────────────────────────────────────────────────────────────────
const FILTERS = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
];

const NOTIF_ICONS = {
  deadline: { icon: "fluent:calendar-16-regular", color: "text-primary" },
  comment: { icon: "iconamoon:comment", color: "text-primary" },
  notice: { icon: "lucide:bell", color: "text-secondary" },
  info: { icon: "iconoir:info-empty", color: "text-secondary" },
};

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_NOTIFS = [
  {
    id: 1,
    type: "deadline",
    title: "CS 301 Final Exam deadline is approaching (6 days left)",
    time: new Date(Date.now() - 30 * 60000).toISOString(),
    read: false,
  },
  {
    id: 2,
    type: "comment",
    title:
      "Dr. Kofi Mensah replied to your comment on Software Engineering Project",
    time: new Date(Date.now() - 2 * 3600000).toISOString(),
    read: false,
  },
  {
    id: 3,
    type: "notice",
    title: "New announcement: Guest Lecture on Machine Learning",
    time: new Date(Date.now() - 24 * 3600000).toISOString(),
    read: true,
  },
  {
    id: 4,
    type: "info",
    title: "Welcome to NoticeHub! Complete your profile to get started.",
    time: new Date(Date.now() - 3 * 24 * 3600000).toISOString(),
    read: true,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const m = Math.floor(diffMs / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h > 1 ? "s" : ""} ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d > 1 ? "s" : ""} ago`;
}

// ─── Notification item ────────────────────────────────────────────────────────
function NotifItem({ notif, onRead }) {
  const ni = NOTIF_ICONS[notif.type] || NOTIF_ICONS.info;
  return (
    <div
      onClick={() => onRead(notif.id)}
      className={`relative w-full px-4 lg:px-6 py-4 lg:py-5 rounded-2xl flex items-start gap-3 lg:gap-4 cursor-pointer transition-colors
        ${
          notif.read
            ? "bg-white shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10),0px_1px_3px_0px_rgba(0,0,0,0.10)] hover:bg-neutral-gray-2"
            : "bg-white shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10),0px_1px_3px_0px_rgba(0,0,0,0.10)] border-l-4 border-primary hover:bg-blue-1/30"
        }`}
    >
      <Icon
        icon={ni.icon}
        className={`w-5 h-5 shrink-0 mt-0.5 ${notif.read ? "text-secondary" : "text-primary"}`}
      />
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <p
          className={`text-sm lg:text-base leading-6 ${notif.read ? "font-normal text-secondary" : "font-medium text-secondary"}`}
        >
          {notif.title}
        </p>
        <p className="text-xs lg:text-sm text-neutral-gray-8">
          {timeAgo(notif.time)}
        </p>
      </div>
      {!notif.read && (
        <span className="shrink-0 w-2.5 h-2.5 rounded-full bg-primary mt-1" />
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [notifs, setNotifs] = useState(MOCK_NOTIFS);

  function markAllRead() {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markRead(id) {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }

  const filtered = useMemo(() => {
    let list =
      activeFilter === "unread" ? notifs.filter((n) => !n.read) : notifs;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((n) => n.title.toLowerCase().includes(q));
    }
    return list;
  }, [notifs, activeFilter, searchQuery]);

  const mobileCard =
    "bg-white rounded-[20px] shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10),0px_1px_3px_0px_rgba(0,0,0,0.10)] lg:bg-transparent lg:shadow-none lg:rounded-none";

  return (
    <div className="flex flex-col gap-3 lg:gap-6 h-full overflow-y-auto scrollbar-hide">
      {/* ── Header card ── */}
      <div
        className={`shrink-0 flex flex-col gap-4 lg:gap-5 px-3.5 py-5 lg:p-0 ${mobileCard}`}
      >
        <div className="flex flex-col gap-1 lg:gap-2">
          <h1 className="text-xl lg:text-[32px] font-bold text-secondary leading-none">
            Notifications
          </h1>
          <p className="text-sm lg:text-base text-neutral-gray-8">
            Stay updated with all your announcements
          </p>
        </div>

        {/* Filter pills */}
        <FilterPills filters={FILTERS} active={activeFilter} onChange={setActiveFilter} />
      </div>

      {/* ── Search + list card ── */}
      <div
        className={`sticky top-0 z-10 lg:static lg:z-auto flex flex-1 flex-col gap-3 lg:gap-5 p-3.5 lg:p-0 ${mobileCard}`}
      >
        {/* Search + Mark all as read — sticky inside card */}
        <div className="sticky top-0 z-5 bg-white py-2.5 lg:py-0 lg:bg-transparent flex justify-between items-center gap-3 lg:gap-4">
          <div className="group flex-1 lg:max-w-147.5 flex items-center justify-between pl-3 lg:pl-5 pr-1 lg:pr-1.5 py-1.5 rounded-full border-[0.67px] border-neutral-gray-5 focus-within:border-secondary bg-white">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notifications..."
              className="bg-transparent text-xs lg:text-sm text-neutral-gray-9 placeholder:text-neutral-gray-6 outline-none flex-1 min-w-0"
            />
            <button className="cursor-pointer w-6 h-6 lg:w-8 lg:h-8 bg-secondary hover:bg-secondary/90 rounded-full flex items-center justify-center shrink-0">
              <Icon
                icon="lucide:search"
                className="w-3 h-3 lg:w-4 lg:h-4 text-white"
              />
            </button>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={markAllRead}
            className="text-white rounded-full! xsm:rounded-xl! sm:px-4! p-2.25! sm:py-2.5!"
          >
            <Icon icon="mdi:check-all" className="w-4.5 h-4.5" />
            <span className="hidden xsm:flex text-sm">Mark all as read</span>
          </Button>
        </div>

        {/* Notification list */}
        <div className="pt-5 flex flex-col gap-3 lg:gap-5 max-w-6xl justify-center items-center mx-auto w-full">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 lg:py-16 text-center">
              <Icon
                icon="lucide:bell-off"
                className="w-16 h-16 lg:w-20 lg:h-20 text-neutral-gray-4"
              />
              <div className="flex flex-col items-center">
                <p className="text-base lg:text-lg font-semibold text-secondary">
                  No notifications
                </p>
                <p className="text-sm lg:text-base text-neutral-gray-8">
                  You're all caught up!
                </p>
              </div>
            </div>
          ) : (
            filtered.map((n) => (
              <NotifItem key={n.id} notif={n} onRead={markRead} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
