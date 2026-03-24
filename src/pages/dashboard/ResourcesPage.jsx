import { useState, useMemo } from "react";
import { Icon } from "@iconify/react";

// ─── Config ───────────────────────────────────────────────────────────────────
const ICON_FILTER_DEFAULT =
  "brightness(0) saturate(100%) invert(55%) sepia(20%) saturate(600%) hue-rotate(195deg) brightness(100%) contrast(90%)";

const TABS = [
  {
    value: "telegram",
    label: "Telegram Channels",
    icon: "jam:telegram",
    action: "Join Channel",
    hoverFilter:
      "brightness(0) saturate(100%) invert(57%) sepia(60%) saturate(500%) hue-rotate(168deg) brightness(105%) contrast(95%)",
  },
  {
    value: "drive",
    label: "Google Drive",
    icon: "mingcute:drive-fill",
    hoverIcon: "logos:google-drive",
    action: "Open Folder",
    hoverFilter: "none",
  },
  {
    value: "youtube",
    label: "YouTube",
    icon: "qlementine-icons:youtube-fill-24",
    action: "Watch Playlist",
    hoverFilter:
      "brightness(0) saturate(100%) invert(18%) sepia(95%) saturate(3000%) hue-rotate(356deg) brightness(97%) contrast(95%)",
  },
];

// ─── Mock data ────────────────────────────────────────────────────────────────
const RESOURCES = {
  telegram: [
    {
      id: "t1",
      title: "CS3 – Data Structures & Algorithms",
      description: "Course materials, announcements and peer discussions",
      url: "#",
    },
    {
      id: "t2",
      title: "CSC 302 – Operating Systems",
      description: "OS concepts, assignments and study materials",
      url: "#",
    },
    {
      id: "t3",
      title: "CSM 342 – Networking Fundamentals",
      description: "Networking concepts, exam prep and resources",
      url: "#",
    },
    {
      id: "t4",
      title: "Mathematics for Computer Science",
      description: "Calculus, discrete math and linear algebra resources",
      url: "#",
    },
    {
      id: "t5",
      title: "IT 401 – Mobile App Development",
      description: "Android and iOS development resources and updates",
      url: "#",
    },
    {
      id: "t6",
      title: "Department General Announcements",
      description: "General news, events and notices from the department",
      url: "#",
    },
  ],
  drive: [
    {
      id: "d1",
      title: "CS3 – Data Structures & Algorithms",
      description: "Lecture slides, past questions and assignments",
      url: "#",
    },
    {
      id: "d2",
      title: "CSC 302 – Operating Systems",
      description: "Lab guides, project templates and reference material",
      url: "#",
    },
    {
      id: "d3",
      title: "Year 3 Semester 1 – All Courses",
      description: "Compiled course materials for the current semester",
      url: "#",
    },
    {
      id: "d4",
      title: "Past Examination Papers",
      description: "Past exam papers from 2018 to 2024",
      url: "#",
    },
    {
      id: "d5",
      title: "IT 401 – Mobile App Development",
      description: "Android Studio guides, APK templates and resources",
      url: "#",
    },
    {
      id: "d6",
      title: "Research & Reference Materials",
      description: "IEEE papers, textbooks and supplementary reading",
      url: "#",
    },
  ],
  youtube: [
    {
      id: "y1",
      title: "CS3 – Data Structures & Algorithms",
      description: "Video lectures on arrays, trees, graphs and algorithms",
      url: "#",
    },
    {
      id: "y2",
      title: "Operating Systems Explained",
      description: "Process management, memory and file systems",
      url: "#",
    },
    {
      id: "y3",
      title: "Computer Networking Full Course",
      description: "TCP/IP, DNS, routing and network security",
      url: "#",
    },
    {
      id: "y4",
      title: "Android App Development",
      description: "Kotlin tutorials from beginner to advanced level",
      url: "#",
    },
    {
      id: "y5",
      title: "Discrete Mathematics",
      description: "Logic, sets, relations, graph theory and proofs",
      url: "#",
    },
    {
      id: "y6",
      title: "Database Management Systems",
      description: "SQL, ER diagrams, normalization and transactions",
      url: "#",
    },
  ],
};

// ─── Resource card ────────────────────────────────────────────────────────────
function ResourceCard({ resource, tab }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="p-4 sm:p-5 lg:p-7 bg-linear-to-r from-zinc-100/20 to-violet-950/5 rounded-2xl shadow-[0px_1px_1px_0px_rgba(0,0,0,0.17)] border-b border-gray-200 flex items-center gap-4 lg:gap-6"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Icon */}
      <div className="p-2.5 lg:p-3.5 bg-blue-1 rounded-xl flex items-center justify-center shrink-0">
        <Icon
          icon={hovered && tab.hoverIcon ? tab.hoverIcon : tab.icon}
          className="w-6 h-6 lg:w-7 lg:h-7 transition-all duration-200"
          style={{
            filter:
              hovered && tab.hoverIcon
                ? "none"
                : hovered
                  ? tab.hoverFilter
                  : ICON_FILTER_DEFAULT,
          }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-3 lg:gap-5">
        <div className="flex flex-col gap-1 lg:gap-1.5">
          <p className="text-sm lg:text-base font-medium text-secondary leading-6 truncate">
            {resource.title}
          </p>
          <p className="text-xs lg:text-sm text-neutral-gray-8 leading-5 line-clamp-1">
            {resource.description}
          </p>
        </div>

        {/* Action button */}
        <a
          href={resource.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 self-end rounded-2xl px-2.5 py-1 text-primary text-[13px] md:text-sm font-medium hover:bg-blue-1 transition-colors"
        >
          {tab.action}
          <Icon icon="mynaui:external-link-solid" className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState("telegram");
  const [searchQuery, setSearchQuery] = useState("");

  const tab = TABS.find((t) => t.value === activeTab);

  const filtered = useMemo(() => {
    const list = RESOURCES[activeTab] ?? [];
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q),
    );
  }, [activeTab, searchQuery]);

  const mobileCard =
    "bg-white rounded-[20px] shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10),0px_1px_3px_0px_rgba(0,0,0,0.10)] lg:bg-transparent lg:shadow-none lg:rounded-none";

  return (
    <div className="flex flex-col lg:min-h-0 gap-3 lg:gap-6 h-full overflow-y-auto lg:overflow-visible scrollbar-hide">
      {/* ── Header card ── */}
      <div
        className={`shrink-0 flex flex-col gap-4 lg:gap-5 px-3.5 py-5 lg:p-0 ${mobileCard}`}
      >
        <div className="flex flex-col gap-1 lg:gap-2">
          <h1 className="text-xl lg:text-[32px] font-bold text-secondary leading-none">
            Resources
          </h1>
          <p className="text-sm lg:text-base text-neutral-gray-8">
            Course materials, channels and learning links
          </p>
        </div>

        {/* Tab navigation */}
        <div className="flex items-end gap-5  -mb-px">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => {
                setActiveTab(t.value);
                setSearchQuery("");
              }}
              className={`cursor-pointer flex items-center gap-1.5 lg:gap-2  py-2 lg:py-2.5 text-xs lg:text-sm font-medium transition-colors border-b-2
                ${
                  activeTab === t.value
                    ? "border-primary text-primary"
                    : "border-transparent text-neutral-gray-6 hover:text-neutral-gray-9 hover:border-neutral-gray-4"
                }`}
            >
              <Icon
                icon={t.icon}
                className="w-5 h-5 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 shrink-0"
              />
              <span className="hidden sm:block">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Search — desktop only ── */}
      <div className="hidden lg:flex shrink-0 items-center gap-3 mx-auto">
        <div className="group flex-1 lg:min-w-70 xl:min-w-100 flex items-center justify-between pl-3 lg:pl-5 pr-1 lg:pr-1.5 py-1.5 rounded-full outline-[0.67px] outline-neutral-gray-5 focus-within:outline-secondary bg-white">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources..."
            className="bg-transparent text-xs lg:text-sm text-neutral-gray-9 placeholder:text-neutral-gray-6 outline-none flex-1 min-w-0"
          />
          <button className="cursor-pointer w-6 h-6 lg:w-8 lg:h-8 bg-secondary hover:bg-secondary/90 rounded-full flex items-center justify-center shrink-0">
            <Icon
              icon="lucide:search"
              className="w-3 h-3 lg:w-4 lg:h-4 text-white"
            />
          </button>
        </div>
      </div>

      {/* ── Grid card (sticky on mobile) ── */}
      <div
        className={`sticky top-0 z-10 lg:static lg:z-auto lg:flex-1 lg:min-h-0 flex flex-col gap-2.5 p-3.5 lg:p-0 ${mobileCard}`}
      >
        {/* Mobile search */}
        <div className="lg:hidden py-2.5 bg-white sticky top-0 z-5 shrink-0 flex items-center gap-3">
          <div className="group flex-1 flex items-center justify-between pl-3 pr-1 py-1.5 rounded-full outline-[0.67px] outline-neutral-gray-5 focus-within:outline-secondary bg-white">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources..."
              className="bg-transparent text-xs text-neutral-gray-9 placeholder:text-neutral-gray-6 outline-none flex-1 min-w-0"
            />
            <button className="cursor-pointer w-8 h-8 bg-secondary hover:bg-secondary/90 rounded-full flex items-center justify-center shrink-0">
              <Icon icon="lucide:search" className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="relative z-0 lg:overflow-y-auto scrollbar-hide">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 lg:py-16 text-center">
              <Icon
                icon="mdi:folder-search-outline"
                className="w-16 h-16 lg:w-20 lg:h-20 text-neutral-gray-4"
              />
              <div className="flex flex-col items-center">
                <p className="text-base lg:text-lg font-semibold text-secondary">
                  No resources found
                </p>
                <p className="text-sm lg:text-base text-neutral-gray-8">
                  Try a different search term
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5 lg:gap-3 pb-6">
              {filtered.map((r) => (
                <ResourceCard key={r.id} resource={r} tab={tab} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
