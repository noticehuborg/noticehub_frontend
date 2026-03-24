import { useState, useMemo, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useNotices } from "../../hooks/useNotices";
import Modal from "../../components/ui/Modal";
import { initials, timeAgo, splitFilename } from "../../utils/helpers";
import { CATEGORY, ATTACH_ICONS } from "../../utils/noticeConstants";
import CountdownBadge from "../../components/dashboard/CountdownBadge";
import CommentBubble from "../../components/dashboard/CommentBubble";
import LinkCard from "../../components/dashboard/LinkCard";
import FilterPills from "../../components/dashboard/FilterPills";
import readingIllustration from "../../assets/svg/Reading a letter-pana.svg";

// ─── Config ───────────────────────────────────────────────────────────────────
const FILTERS = [
  { value: "all", label: "All" },
  { value: "assignment", label: "Assignments" },
  { value: "exam", label: "Exams" },
  { value: "general", label: "General" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function dueLabel(dueDate) {
  const diff = new Date(dueDate) - Date.now();
  if (diff <= 0) return "Expired";
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `Due in ${days}d`;
}

function isDueSoon(dueDate) {
  const diff = new Date(dueDate) - Date.now();
  return diff > 0 && diff <= 3 * 86400000;
}

function getDaysLeft(iso) {
  return (new Date(iso) - Date.now()) / 86400000;
}

// ─── Deadline card (list item) ────────────────────────────────────────────────
function DeadlineCard({ notice, isSelected, onClick }) {
  const cat = CATEGORY[notice.type] || CATEGORY.general;
  const soon = notice.dueDate ? isDueSoon(notice.dueDate) : false;
  const label = notice.dueDate ? dueLabel(notice.dueDate) : null;

  return (
    <button
      onClick={onClick}
      className={`select-none outline-0 cursor-pointer w-full text-left px-3 py-3.5 md:px-5 lg:px-8 lg:py-5 rounded-2xl flex flex-col gap-2.5 lg:gap-3 transition-all relative
        ${
          soon
            ? "bg-red-50 border border-red-100 hover:border-red-200"
            : isSelected
              ? "bg-white shadow-sm shadow-secondary/5 border border-neutral-gray-3"
              : "bg-white border border-transparent hover:bg-section-bg hover:border-neutral-gray-3"
        }`}
    >
      {/* Row 1: category + due label */}
      <div className="flex items-center justify-between w-full">
        <span
          className={`inline-flex items-center gap-1 text-xs lg:text-sm rounded-full
            ${
              soon
                ? "bg-error-2 text-error-7 px-2.5 py-0.5"
                : "text-primary-hover"
            }`}
        >
          <Icon
            icon={cat.icon}
            className="w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0"
          />
          {cat.label}
        </span>
        {label && (
          <span
            className={`text-xs lg:text-sm font-medium ${soon ? "text-error-7" : "text-neutral-gray-6"}`}
          >
            {soon && (
              <Icon
                icon="mdi:clock-alert-outline"
                className="w-3.5 h-3.5 inline mr-1"
              />
            )}
            {label}
          </span>
        )}
      </div>

      {/* Row 2: title + body */}
      <div className="flex flex-col gap-1 lg:gap-1.5">
        <p className="text-xs lg:text-base font-medium text-neutral-gray-10 leading-5 lg:leading-6">
          {notice.title}
        </p>
        <p className="text-xs lg:text-sm text-neutral-gray-7 leading-5 line-clamp-1">
          {notice.body}
        </p>
      </div>

      {/* Row 3: author + comments */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-1.5">
          {notice.authorAvatar ? (
            <img
              src={notice.authorAvatar}
              className="w-6 h-6 lg:w-7 lg:h-7 rounded-full object-cover"
              alt=""
            />
          ) : (
            <div className="w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-blue-1 flex items-center justify-center text-[10px] lg:text-xs font-semibold text-primary">
              {initials(notice.author)}
            </div>
          )}
          <span className="text-xs font-medium text-neutral-gray-9">
            {notice.author}
          </span>
          <span className="w-[3px] h-[3px] lg:w-1 lg:h-1 rounded-full bg-stone-300 shrink-0" />
          <span className="text-xs text-neutral-gray-6">
            {notice.authorRole}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs lg:text-sm text-neutral-gray-6">
          <Icon
            icon="iconamoon:comment"
            className="w-3.5 h-3.5 lg:w-4 lg:h-4"
          />
          <span>{notice.commentCount ?? 0}</span>
        </div>
      </div>
    </button>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, critical = false }) {
  return (
    <div
      className={`w-28 sm:w-32 lg:w-40 shrink-0 px-4 lg:px-5 py-3 lg:py-2 rounded-2xl flex flex-col justify-center items-start gap-1.5 lg:gap-2.5
        ${
          critical
            ? "bg-red-100/25 outline -outline-offset-1 outline-red-600/20"
            : "bg-neutral-50 shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05)] outline -outline-offset-1 outline-violet-950/20"
        }`}
    >
      <span
        className={`text-2xl sm:text-3xl font-bold leading-9 ${critical ? "text-error-8" : "text-secondary"}`}
      >
        {value}
      </span>
      <span
        className={`text-xs sm:text-sm font-medium capitalize ${critical ? "text-error-8" : "text-neutral-gray-8"}`}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Notice preview panel ─────────────────────────────────────────────────────
function NoticePreview({ notice, inModal = false }) {
  const [commentInput, setCommentInput] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyInput, setReplyInput] = useState("");
  const cat = notice ? CATEGORY[notice.type] : null;

  function handleReply(id) {
    setReplyingTo(id);
    setReplyInput("");
  }
  function handleReplySubmit() {
    setReplyingTo(null);
    setReplyInput("");
  }

  if (!notice) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-5 border-l border-neutral-gray-3 overflow-hidden pb-8">
        <img
          src={readingIllustration}
          alt=""
          className="w-72 h-72 object-contain"
        />
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-2xl font-medium text-neutral-gray-10">
            Deadline Preview
          </p>
          <p className="text-base text-neutral-gray-7">
            Click a deadline to see its details here
          </p>
        </div>
      </div>
    );
  }

  const body = notice.body;
  const hasAttachments = notice.attachments?.length > 0;
  const hasLinks = notice.links?.length > 0;
  const hasComments = notice.comments?.length > 0;
  const critical = notice.dueDate ? isDueSoon(notice.dueDate) : false;

  const contentCls = inModal
    ? "overflow-y-auto scrollbar-hide px-5 pt-6 pb-4 flex flex-col gap-5 max-h-[calc(85vh-5rem)]"
    : "flex-1 min-h-0 overflow-y-auto scrollbar-hide px-8 py-6 flex flex-col gap-8";

  return (
    <div
      className={
        inModal
          ? "flex flex-col"
          : "flex-1 border-l border-neutral-gray-3 overflow-hidden flex flex-col"
      }
    >
      {!inModal && (
        <div className="px-8 py-4 border-b border-neutral-gray-3">
          <h2 className="text-[15px] lg:text-base text-center font-medium text-neutral-gray-7">
            Preview
          </h2>
        </div>
      )}
      <div className={contentCls}>
        <div className="flex flex-col gap-5 items-start w-full">
          {/* Category pill + date */}
          <div className="w-full flex items-center justify-between flex-wrap gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs md:text-sm ${critical ? "bg-error-2 text-error-7" : "bg-blue-1 text-primary"}`}
            >
              <Icon icon={cat.icon} className="w-3.5 h-3.5" />
              {cat.label}
            </span>
            <span className="text-xs md:text-sm text-neutral-gray-6">
              {timeAgo(notice.date)}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold text-secondary max-w-[85%] leading-normal">
            {notice.title}
          </h2>

          {/* Author row */}
          <div className="flex items-center gap-3 justify-between w-full">
            {notice.authorAvatar ? (
              <img
                src={notice.authorAvatar}
                className="w-14 h-14 rounded-full object-cover shrink-0"
                alt=""
              />
            ) : (
              <div className="w-14 h-14 rounded-full text-neutral-gray-1 bg-linear-to-b from-blue-8 to-blue-7 flex items-center justify-center text-xl font-bold shrink-0">
                {initials(notice.author)}
              </div>
            )}
            <div className="flex flex-col gap-0.5">
              <p className="text-sm lg:text-base font-semibold text-secondary">
                {notice.author}
              </p>
              <p className="text-xs lg:text-sm text-neutral-gray-6 font-medium">
                {notice.authorRole}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-3 text-xs md:text-sm text-neutral-gray-6">
              {hasAttachments && (
                <span className="flex items-center gap-1">
                  <Icon
                    icon="iconamoon:attachment"
                    className="w-3.5 h-3.5 md:w-4 md:h-4"
                  />
                  {notice.attachments.length}
                </span>
              )}
              {hasLinks && (
                <span className="flex items-center gap-1">
                  <Icon
                    icon="solar:link-bold"
                    className="w-3.5 h-3.5 md:w-4 md:h-4"
                  />
                  {notice.links.length}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Icon
                  icon="iconamoon:comment"
                  className="w-3.5 h-3.5 md:w-4 md:h-4"
                />
                {notice.commentCount ?? 0}
              </span>
            </div>
          </div>
        </div>

        {/* Countdown badge */}
        {notice.dueDate && (
          <CountdownBadge dueDate={notice.dueDate} type={notice.type} />
        )}

        {/* Body */}
        <p className="text-sm text-neutral-gray-7 leading-[1.75] whitespace-pre-wrap max-w-[540px]">
          {body}
        </p>

        {/* Attachments */}
        {hasAttachments && (
          <div className="flex flex-col gap-3 md:gap-3.5">
            <p className="text-xs md:text-sm font-medium text-dashboard-heading">
              Attachments
            </p>
            <div className="flex flex-row flex-wrap gap-2">
              {notice.attachments.map((att) => {
                const ai = ATTACH_ICONS[att.type] || {
                  icon: "mdi:file-document-outline",
                };
                return (
                  <a
                    key={att.id}
                    href="#"
                    className="relative w-full md:w-[250px] h-14 pl-2 py-2 bg-zinc-100 rounded-[10px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] border border-neutral-gray-3 flex justify-between items-center gap-1.5 hover:bg-neutral-gray-3 transition-colors group"
                  >
                    <div className="flex items-center gap-1.5 w-full">
                      <div className="w-7 h-7 flex items-center justify-center shrink-0">
                        <Icon
                          icon={ai.icon}
                          className="w-7 h-7 text-neutral-gray-7"
                        />
                      </div>
                      <div className="flex flex-col gap-0.5 w-full">
                        <span className="text-xs font-medium text-secondary flex items-center max-w-[75%]">
                          <span className="truncate">
                            {splitFilename(att.name).base}
                          </span>
                          <span className="shrink-0">
                            {splitFilename(att.name).ext}
                          </span>
                        </span>
                        <span className="text-xs text-neutral-gray-6">
                          {att.size}
                        </span>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow-[0px_1px_2px_0px_rgba(10,13,18,0.10)] flex items-center justify-center shrink-0">
                      <Icon
                        icon="mage:download"
                        className="w-3.5 h-3.5 text-neutral-gray-7"
                      />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Related links */}
        {hasLinks && (
          <div className="flex flex-col gap-3 md:gap-3.5">
            <p className="text-xs md:text-sm font-medium text-dashboard-heading">
              Related Links
            </p>
            <div className="flex flex-row flex-wrap gap-1.5">
              {notice.links.map((lnk) => (
                <LinkCard key={lnk.id} lnk={lnk} />
              ))}
            </div>
          </div>
        )}

        {/* Comments */}
        <div className="flex flex-col gap-3 pt-1">
          <div className="flex items-center gap-2 text-dashboard-heading">
            <Icon
              icon="iconamoon:comment"
              className="w-3.5 h-3.5 md:w-4 md:h-4"
            />
            <p className="text-xs md:text-sm font-medium">
              Comments ({notice.commentCount ?? 0})
            </p>
          </div>
          {hasComments ? (
            <div className="flex flex-col gap-4">
              {notice.comments.map((c) => (
                <CommentBubble
                  key={c.id}
                  comment={c}
                  replyingTo={replyingTo}
                  onReply={handleReply}
                  replyInput={replyInput}
                  onReplyInputChange={setReplyInput}
                  onReplySubmit={handleReplySubmit}
                />
              ))}
            </div>
          ) : (
            <p className="text-xs md:text-sm text-neutral-gray-5">
              No comments yet.
            </p>
          )}
        </div>
      </div>

      {/* Comment input — pinned at bottom, outside the scroll area */}
      <div
        className={`shrink-0 flex items-center gap-2 border-t border-neutral-gray-3 ${inModal ? "px-5 py-3" : "px-8 py-4"}`}
      >
        <div className="w-7 h-7 rounded-full bg-blue-1 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
          Y
        </div>
        <div className="flex-1 flex items-center gap-2 px-3.5 py-2 rounded-full outline outline-1 outline-neutral-gray-4 focus-within:outline-primary transition-colors">
          <input
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Add a comment…"
            className="flex-1 bg-transparent text-xs text-neutral-gray-9 placeholder:text-neutral-gray-5 outline-none min-w-0"
          />
          <button
            disabled={!commentInput.trim()}
            className="shrink-0 disabled:opacity-40"
          >
            <Icon icon="mdi:send" className="w-4 h-4 text-primary" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── View filter dropdown (Upcoming / Past) ──────────────────────────────────
const VIEW_FILTERS = [
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past" },
];

function ViewFilterDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const activeLabel =
    VIEW_FILTERS.find((f) => f.value === value)?.label ?? "View";

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
        <span className="text-[13px] lg:text-sm whitespace-nowrap">{activeLabel}</span>
        <Icon
          icon={open ? "mdi:chevron-up" : "mdi:chevron-down"}
          className="w-3 h-3 lg:w-3.5 lg:h-3.5"
        />
      </button>

      {open && (
        <div className="flex flex-col p-2 absolute right-0 top-full mt-1.5 z-20 bg-white rounded-2xl shadow-[0px_4px_20px_0px_rgba(0,0,0,0.12)] outline-1 outline-neutral-gray-3 overflow-hidden min-w-40 lg:min-w-48">
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
          {VIEW_FILTERS.map((f) => (
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
export default function DeadlinesPage() {
  const { notices, loading } = useNotices();
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewFilter, setViewFilter] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  // Stable timestamp — initialised once on mount, fine for deadline bucketing
  const [now] = useState(Date.now);

  // Only show notices that have a dueDate
  const deadlines = useMemo(
    () => notices.filter((n) => !!n.dueDate),
    [notices],
  );

  const stats = useMemo(() => {
    const total = deadlines.filter((d) => new Date(d.dueDate) > now).length;
    const critical = deadlines.filter(
      (d) => getDaysLeft(d.dueDate) > 0 && getDaysLeft(d.dueDate) <= 3,
    ).length;
    const thisWeek = deadlines.filter(
      (d) => getDaysLeft(d.dueDate) > 3 && getDaysLeft(d.dueDate) <= 7,
    ).length;
    const later = deadlines.filter((d) => getDaysLeft(d.dueDate) > 7).length;
    const past = deadlines.filter((d) => new Date(d.dueDate) <= now).length;
    return { total, critical, thisWeek, later, past };
  }, [deadlines, now]);

  const filtered = useMemo(() => {
    let list =
      activeFilter === "all"
        ? deadlines
        : deadlines.filter((n) => n.type === activeFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.body?.toLowerCase().includes(q) ||
          n.author?.toLowerCase().includes(q),
      );
    }
    if (viewFilter === "upcoming") {
      return list
        .filter((n) => new Date(n.dueDate) > now)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 10);
    } else if (viewFilter === "past") {
      return list
        .filter((n) => new Date(n.dueDate) <= now)
        .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
        .slice(0, 10);
    } else {
      // none — show all, soonest first
      return list
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 20);
    }
  }, [deadlines, activeFilter, viewFilter, searchQuery, now]);

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
              Deadlines
            </h1>
            <p className="text-sm lg:text-base text-neutral-gray-8">
              Never miss a submission date or exam
            </p>
          </div>

          {/* Stats */}
          {!loading && (
            <div className="flex items-stretch gap-3 overflow-x-auto scrollbar-hide">
              <StatCard label="Upcoming" value={stats.total} />
              <StatCard
                label="Critical (< 3d)"
                value={stats.critical}
                critical
              />
              <StatCard label="This Week" value={stats.thisWeek} />
              <StatCard label="Later" value={stats.later} />
              <StatCard label="Past" value={stats.past} />
            </div>
          )}

          {/* Filter pills */}
          <FilterPills filters={FILTERS} active={activeFilter} onChange={setActiveFilter} />
        </div>

        {/* Search + view toggle — desktop */}
        <div
          className={`hidden lg:flex shrink-0 justify-between items-center gap-3 lg:gap-4`}
        >
          <div className="group flex-1 lg:max-w-70 xl:max-w-80 flex items-center justify-between pl-3 lg:pl-5 pr-1 lg:pr-1.5 py-1.5 rounded-full outline-[0.67px] outline-neutral-gray-5 focus-within:outline-secondary bg-white">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search deadlines..."
              className="bg-transparent text-xs lg:text-sm text-neutral-gray-9 placeholder:text-neutral-gray-6 outline-none flex-1 min-w-0"
            />
            <button className="cursor-pointer w-6 h-6 lg:w-8 lg:h-8 bg-secondary hover:bg-secondary/90 rounded-full flex items-center justify-center shrink-0">
              <Icon
                icon="lucide:search"
                className="w-3 h-3 lg:w-4 lg:h-4 text-white"
              />
            </button>
          </div>
          <ViewFilterDropdown value={viewFilter} onChange={setViewFilter} />
        </div>

        {/* Deadline list — scrollable */}
        <div
          className={`sticky top-0 z-10 lg:static lg:z-auto lg:flex-1 lg:min-h-0 flex flex-col gap-2.5 p-3.5 lg:p-0 ${mobileCard}`}
        >
          {/* Search + view toggle — mobile */}
          <div className="lg:hidden py-2.5 bg-white sticky top-0 z-5 shrink-0 flex justify-between items-center gap-3">
            <div className="group flex-1 flex items-center justify-between pl-3 pr-1 py-1.5 rounded-full outline-[0.67px] outline-neutral-gray-5 focus-within:outline-secondary bg-white">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search deadlines..."
                className="bg-transparent text-xs text-neutral-gray-9 placeholder:text-neutral-gray-6 outline-none flex-1 min-w-0"
              />
              <button className="cursor-pointer w-8 h-8 bg-secondary hover:bg-secondary/90 rounded-full flex items-center justify-center shrink-0">
                <Icon icon="lucide:search" className="w-4 h-4 text-white" />
              </button>
            </div>
            <ViewFilterDropdown value={viewFilter} onChange={setViewFilter} />
          </div>
          <div className="relative z-0 flex flex-col gap-2 lg:gap-2.5 lg:overflow-y-auto scrollbar-hide">
            {loading ? (
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-24 lg:h-32 rounded-2xl bg-neutral-gray-2 animate-pulse"
                />
              ))
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 lg:py-16 text-center">
                <Icon
                  icon="mdi:calendar-remove-outline"
                  className="w-16 h-16 lg:w-20 lg:h-20 text-neutral-gray-4"
                />
                <div className="flex flex-col items-center">
                  <p className="text-base lg:text-lg font-semibold text-secondary">
                    {viewFilter === "upcoming"
                      ? "No upcoming deadlines"
                      : viewFilter === "past"
                        ? "No past deadlines"
                        : "No deadlines found"}
                  </p>
                  <p className="text-sm lg:text-base text-neutral-gray-8">
                    {viewFilter === "upcoming"
                      ? "You're all caught up — nothing due soon"
                      : viewFilter === "past"
                        ? "No expired deadlines in this category"
                        : "Try a different type filter"}
                  </p>
                </div>
              </div>
            ) : (
              filtered.map((n) => (
                <DeadlineCard
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
          className="md:max-w-xl overflow-hidden p-0!"
          portalClassName="lg:hidden p-0! items-end md:items-center md:p-6!"
        >
          <NoticePreview notice={selectedNotice} inModal />
        </Modal>
      )}
    </div>
  );
}
