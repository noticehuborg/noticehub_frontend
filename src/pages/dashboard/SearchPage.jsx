import { useState, useMemo, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useNotices } from "../../hooks/useNotices";
import Modal from "../../components/ui/Modal";
import DashNoticeCard from "../../components/dashboard/DashNoticeCard";
import NoticePreview from "../../components/dashboard/NoticePreview";
import FilterPills from "../../components/dashboard/FilterPills";

// ─── Config ───────────────────────────────────────────────────────────────────
const FILTERS = [
  { value: "all",        label: "All" },
  { value: "general",    label: "General" },
  { value: "assignment", label: "Assignments" },
  { value: "exam",       label: "Exams" },
];

// ─── Main page ────────────────────────────────────────────────────────────────
export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const inputRef = useRef(null);

  const { notices, loading } = useNotices();

  useEffect(() => { inputRef.current?.focus(); }, []);

  function handleChange(e) {
    setQuery(e.target.value);
    setSearchParams(e.target.value ? { q: e.target.value } : {});
  }

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    let list = notices.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.body.toLowerCase().includes(q) ||
        n.author?.toLowerCase().includes(q),
    );
    if (activeFilter !== "all") list = list.filter((n) => n.type === activeFilter);
    return list;
  }, [query, notices, activeFilter]);

  const hasQuery = query.trim().length > 0;

  const mobileCard =
    "bg-white rounded-[20px] shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10),0px_1px_3px_0px_rgba(0,0,0,0.10)] lg:bg-transparent lg:shadow-none lg:rounded-none";

  return (
    <div className="flex flex-col lg:flex-row gap-3 lg:gap-0 h-full">
      {/* ── Left column ── */}
      <div className="flex flex-col lg:min-h-0 gap-3 lg:gap-6 lg:w-1/2 lg:pr-8 h-full overflow-y-auto lg:overflow-visible scrollbar-hide">

        {/* Header card */}
        <div className={`shrink-0 flex flex-col gap-4 lg:gap-5 px-3.5 py-5 lg:p-0 ${mobileCard}`}>
          <div className="flex flex-col gap-1 lg:gap-2">
            <h1 className="text-xl lg:text-[32px] font-bold text-secondary leading-none">Search</h1>
            <p className="text-sm lg:text-base text-neutral-gray-8">Find announcements, deadlines, and more</p>
          </div>
          {/* Filter pills */}
          <FilterPills filters={FILTERS} active={activeFilter} onChange={setActiveFilter} />
        </div>

        {/* Search + results card */}
        <div className={`sticky top-0 z-10 lg:static lg:z-auto lg:flex-1 lg:min-h-0 flex flex-col gap-3 p-3.5 lg:p-0 ${mobileCard}`}>
          {/* Search bar */}
          <div className="py-2.5 lg:py-0 bg-white lg:bg-transparent sticky top-0 z-5 shrink-0">
            <div className="group flex-1 flex items-center justify-between pl-3 lg:pl-5 pr-1 lg:pr-1.5 py-1.5 rounded-full outline-[0.67px] outline-neutral-gray-5 focus-within:outline-secondary bg-white">
              <input
                ref={inputRef}
                value={query}
                onChange={handleChange}
                placeholder="Search announcements, deadlines..."
                className="bg-transparent text-xs lg:text-sm text-neutral-gray-9 placeholder:text-neutral-gray-6 outline-none flex-1 min-w-0"
              />
              {query && (
                <button onClick={() => { setQuery(""); setSearchParams({}); }}
                  className="shrink-0 w-6 h-6 flex items-center justify-center text-neutral-gray-5 hover:text-neutral-gray-8 mr-1"
                >
                  <Icon icon="mdi:close" className="w-4 h-4" />
                </button>
              )}
              <button className="cursor-pointer w-6 h-6 lg:w-8 lg:h-8 bg-secondary hover:bg-secondary/90 rounded-full flex items-center justify-center shrink-0">
                <Icon icon="lucide:search" className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Results count */}
          <p className="text-xs lg:text-sm font-medium text-primary shrink-0">
            Showing {hasQuery ? results.length : 0} result{results.length !== 1 ? "s" : ""}
          </p>

          {/* Results list */}
          <div className="relative z-0 flex flex-col gap-2 lg:gap-2.5 lg:overflow-y-auto scrollbar-hide">
            {loading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="h-24 lg:h-32 rounded-2xl bg-neutral-gray-2 animate-pulse" />
              ))
            ) : !hasQuery ? (
              <div className="flex flex-col items-center gap-4 py-16 lg:py-24 text-center">
                <Icon icon="lucide:search" className="w-16 h-16 lg:w-20 lg:h-20 text-neutral-gray-4" />
                <div className="flex flex-col items-center gap-1">
                  <p className="text-base lg:text-lg font-semibold text-secondary">Start Searching</p>
                  <p className="text-sm lg:text-base text-neutral-gray-8">Enter keywords to find announcements and more</p>
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-16 lg:py-24 text-center">
                <Icon icon="iconoir:info-empty" className="w-16 h-16 lg:w-20 lg:h-20 text-neutral-gray-4" />
                <div className="flex flex-col items-center gap-1">
                  <p className="text-base lg:text-lg font-semibold text-secondary">No results found</p>
                  <p className="text-sm lg:text-base text-neutral-gray-8">Try different keywords or check the spelling</p>
                </div>
              </div>
            ) : (
              results.map((n) => (
                <DashNoticeCard key={n.id} notice={n}
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
