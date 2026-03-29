import { useState, useMemo, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useNotices } from "../../hooks/useNotices";
import { useAuth } from "../../hooks/useAuth";
import Modal from "../../components/ui/Modal";
import { matchesDate } from "../../utils/helpers";
import { DATE_FILTERS } from "../../utils/noticeConstants";
import DashNoticeCard from "../../components/dashboard/DashNoticeCard";
import NoticePreview from "../../components/dashboard/NoticePreview";
import FilterPills from "../../components/dashboard/FilterPills";

// ─── Config ───────────────────────────────────────────────────────────────────
const FILTERS = [
  { value: "all", label: "All" },
  { value: "general", label: "General" },
  { value: "assignment", label: "Assignments" },
  { value: "exam", label: "Exams" },
];

// ─── Date filter dropdown ─────────────────────────────────────────────────────
function DateFilterDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const activeLabel =
    DATE_FILTERS.find((f) => f.value === value)?.label ?? "Date";

  useEffect(() => {
    if (!open) return;
    function onOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`cursor-pointer flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-2 lg:py-2.5 rounded-full outline-1 transition-colors
          ${
            value !== "none"
              ? "bg-primary text-blue-1 outline-primary"
              : "outline-neutral-gray-3 text-neutral-gray-6 hover:bg-neutral-gray-2"
          }`}
      >
        <Icon
          icon="mdi:calendar-blank-outline"
          className="w-4 h-4 lg:w-5 lg:h-5"
        />
        <span className="text-sm whitespace-nowrap">{activeLabel}</span>
        <Icon
          icon={open ? "mdi:chevron-up" : "mdi:chevron-down"}
          className="w-3 h-3 lg:w-3.5 lg:h-3.5"
        />
      </button>

      {open && (
        <div className="flex flex-col p-2 absolute right-0 top-full mt-1.5 z-20 bg-white rounded-2xl shadow-[0px_4px_20px_0px_rgba(0,0,0,0.12)] outline-1 outline-neutral-gray-3 overflow-hidden min-w-40 lg:min-w-48">
          {/* None — always shown at top as a reset, separated by a border */}
          <button
            onClick={() => {
              onChange("none");
              setOpen(false);
            }}
            className={`rounded-xl w-full text-left px-3.5 lg:px-4 py-2 lg:py-2.5 text-[13px] lg:text-sm transition-colors
              ${value === "none" ? "bg-primary text-blue-1 font-medium" : "text-neutral-gray-5 hover:bg-neutral-gray-2"}`}
          >
            --None--
          </button>
          <div className="my-1 border-t border-neutral-gray-2" />
          {DATE_FILTERS.filter((f) => f.value !== "none").map((f) => (
            <button
              key={f.value}
              onClick={() => {
                onChange(f.value);
                setOpen(false);
              }}
              className={`rounded-xl w-full text-left px-3.5 lg:px-4 py-2 lg:py-2.5 text-[13px] lg:text-sm transition-colors
                ${value === f.value ? "bg-primary text-blue-1 font-medium" : "text-neutral-gray-8 hover:bg-neutral-gray-2"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
function levelYear(level) {
  const n = parseInt(level);
  return n ? String(n / 100) : (level ?? '');
}

export default function FeedPage() {
  const { notices, loading, initialized } = useNotices();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("none");
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    let list =
      activeFilter === "all"
        ? notices
        : notices.filter((n) => n.type === activeFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.body.toLowerCase().includes(q) ||
          n.author?.toLowerCase().includes(q),
      );
    }
    if (dateFilter !== "none") {
      list = list.filter((n) => matchesDate(n.date, dateFilter));
    }
    // When a date filter is active, respect strict date order without floating pinned items
    if (dateFilter !== "none") return list;
    return [...list].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  }, [notices, activeFilter, searchQuery, dateFilter]);

  // mobile card wrapper classes (white card on mobile, invisible on desktop)
  const mobileCard =
    "bg-white rounded-[20px] shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10),0px_1px_3px_0px_rgba(0,0,0,0.10)] lg:bg-transparent lg:shadow-none lg:rounded-none";

  return (
    <div className="flex flex-col lg:flex-row gap-3 lg:gap-0 h-full">
      {/* ── Left column ── */}
      <div className="flex flex-col lg:min-h-0 gap-3 lg:gap-6 lg:w-1/2 lg:pr-8 h-full overflow-y-auto lg:overflow-visible scrollbar-hide">
        {/* Header — fixed, no scroll */}
        <div
          className={`shrink-0 flex flex-col gap-4 lg:gap-5 px-3.5 py-5 lg:p-0 ${mobileCard}`}
        >
          <div className="flex flex-col gap-1 lg:gap-2">
            <h1 className="text-xl lg:text-[32px] font-bold text-secondary leading-none">
              Feed
            </h1>
            <p className="text-sm lg:text-base text-neutral-gray-8">
              Find announcements, deadlines, and more
            </p>
          </div>

          {user?.role === 'lecturer' ? (
            <div className="flex flex-wrap gap-2">
              {(user.courses ?? []).length > 0 ? (
                user.courses.map((c) => (
                  <div key={c.id} className="inline-flex items-center gap-2 lg:gap-2.5 px-2.5 py-1.5 rounded-xl outline-1 outline-primary self-start">
                    <Icon icon="mdi:book-open-outline" className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                    <span className="text-primary text-xs lg:text-sm font-medium">{c.code} — {c.name}</span>
                  </div>
                ))
              ) : (
                <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl outline-1 outline-neutral-gray-4 self-start">
                  <Icon icon="mdi:book-open-outline" className="w-4 h-4 text-neutral-gray-5" />
                  <span className="text-neutral-gray-5 text-xs lg:text-sm">No courses assigned yet</span>
                </div>
              )}
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 lg:gap-2.5 px-2.5 py-1.5 rounded-xl outline-1 outline-primary self-start">
              <Icon icon="iconoir:graduation-cap" className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
              <span className="text-primary text-xs lg:text-sm font-medium">
                {user?.program ?? 'Your Program'} {levelYear(user?.level)}
              </span>
            </div>
          )}

          {/* Filter pills */}
          <FilterPills filters={FILTERS} active={activeFilter} onChange={setActiveFilter} />
        </div>

        {/* Search + date filter — fixed, no scroll */}
        <div
          className={`hidden lg:flex shrink-0 justify-between items-center gap-3 lg:gap-4 px-3.5 py-3 lg:p-0 ${mobileCard}`}
        >
          <div className="group flex-1 lg:max-w-70 xl:max-w-80 flex items-center justify-between pl-3 lg:pl-5 pr-1 lg:pr-1.5 py-1.5 rounded-full outline-[0.67px] outline-neutral-gray-5 focus-within:outline-secondary bg-white">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search anything..."
              className="bg-transparent text-xs lg:text-sm text-neutral-gray-9 placeholder:text-neutral-gray-6 outline-none flex-1 min-w-0"
            />
            <button className="cursor-pointer w-6 h-6 lg:w-8 lg:h-8 bg-secondary hover:bg-secondary/90 rounded-full flex items-center justify-center shrink-0">
              <Icon
                icon="lucide:search"
                className="w-3 h-3 lg:w-4 lg:h-4 text-white"
              />
            </button>
          </div>
          <DateFilterDropdown value={dateFilter} onChange={setDateFilter} />
        </div>

        {/* Notice list — scrollable */}
        <div
          className={`sticky top-0 z-10 lg:static lg:z-auto lg:flex-1 lg:min-h-0 flex flex-col gap-2.5 p-3.5 lg:p-0 ${mobileCard}`}
        >
          <div
            className={`lg:hidden py-2.5 bg-white sticky top-0 z-5 shrink-0 flex justify-between items-center gap-3 lg:gap-4 `}
          >
            <div className="group flex-1 lg:flex-none lg:w-80 flex items-center justify-between pl-3 lg:pl-5 pr-1 lg:pr-1.5 py-1.5 rounded-full outline-[0.67px] outline-neutral-gray-5 focus-within:outline-secondary bg-white">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search anything..."
                className="bg-transparent text-xs lg:text-sm text-neutral-gray-9 placeholder:text-neutral-gray-6 outline-none flex-1 min-w-0"
              />
              <button className="cursor-pointer w-8 h-8 bg-secondary hover:bg-secondary/90 rounded-full flex items-center justify-center shrink-0">
                <Icon icon="lucide:search" className="w-4 h-4 text-white" />
              </button>
            </div>
            <DateFilterDropdown value={dateFilter} onChange={setDateFilter} />
          </div>
          <div className="relative z-0 flex flex-col gap-2 lg:gap-2.5 lg:overflow-y-auto scrollbar-hide">
            {!initialized || loading ? (
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-24 lg:h-32 rounded-2xl bg-neutral-gray-2 animate-pulse"
                />
              ))
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 lg:py-16 text-center">
                <Icon
                  icon="iconoir:info-empty"
                  className="w-16 h-16 lg:w-20 lg:h-20 text-neutral-gray-4"
                />
                <div className="flex flex-col items-center">
                  <p className="text-base lg:text-lg font-semibold text-secondary">
                    No announcements found
                  </p>
                  <p className="text-sm lg:text-base text-neutral-gray-8">
                    Contact your course rep or lecturers for updates
                  </p>
                </div>
              </div>
            ) : (
              filtered.map((n) => (
                <DashNoticeCard
                  key={n.id}
                  notice={n}
                  isSelected={selectedNotice?.id === n.id}
                  onClick={() => {
                    setSelectedNotice(n);
                    if (window.innerWidth < 1024) setMobilePreviewOpen(true);
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Right column — preview panel, desktop only ── */}
      <div className="hidden lg:flex lg:w-1/2 h-full">
        <NoticePreview notice={selectedNotice} />
      </div>

      {/* ── Mobile preview modal ── */}
      {mobilePreviewOpen && selectedNotice && (
          <Modal
            onClose={() => setMobilePreviewOpen(false)}
            xIcon={false}
            className="md:max-w-xl overflow-hidden !p-0"
            portalClassName="lg:hidden p-0! items-end md:items-center md:p-6!"
          >
            <NoticePreview notice={selectedNotice} inModal />
          </Modal>
      )}
    </div>
  );
}
