import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { Icon } from "@iconify/react";
import { useAuth } from "../../hooks/useAuth";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { resourcesService, normalizeResource, normalizeAttachment } from "../../services/resources.service";

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
  {
    value: "file",
    label: "Files",
    icon: "mdi:file-document-outline",
    action: "Download",
    hoverFilter:
      "brightness(0) saturate(100%) invert(30%) sepia(80%) saturate(500%) hue-rotate(210deg) brightness(110%) contrast(90%)",
  },
];

const TYPE_LABELS = {
  telegram: "Telegram",
  drive: "Google Drive",
  youtube: "YouTube",
  file: "File",
};

const TYPE_ICONS = {
  telegram: "jam:telegram",
  drive: "mingcute:drive-fill",
  youtube: "qlementine-icons:youtube-fill-24",
  file: "mdi:file-document-outline",
};

// ─── Resource card (all-resources view) ──────────────────────────────────────
function ResourceCard({ resource, tab }) {
  const [hovered, setHovered] = useState(false);
  const href = resource.url || resource.fileUrl || "#";

  return (
    <div
      className="p-4 sm:p-5 lg:p-7 bg-linear-to-r from-zinc-100/20 to-violet-950/5 rounded-2xl shadow-[0px_1px_1px_0px_rgba(0,0,0,0.17)] border-b border-gray-200 flex items-center gap-4 lg:gap-6"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
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
      <div className="flex-1 min-w-0 flex flex-col gap-3 lg:gap-5">
        <div className="flex flex-col gap-1 lg:gap-1.5">
          <p className="text-sm lg:text-base font-medium text-secondary leading-6 truncate">
            {resource.title}
          </p>
          {resource.description && (
            <p className="text-xs lg:text-sm text-neutral-gray-8 leading-5 line-clamp-1">
              {resource.description}
            </p>
          )}
          {resource.author && (
            <span className="flex items-center gap-1 text-[11px] lg:text-xs text-neutral-gray-5 mt-0.5">
              <Icon icon="mdi:account-outline" className="w-3 h-3 lg:w-3.5 lg:h-3.5 shrink-0" />
              {resource.author}
            </span>
          )}
        </div>
        <a
          href={href}
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

// ─── My upload card ───────────────────────────────────────────────────────────
function UploadCard({ resource, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const href = resource.url || resource.fileUrl || null;

  return (
    <>
      <div className="group flex items-center gap-4 px-4 py-3.5 lg:px-5 lg:py-4 bg-white rounded-2xl border border-neutral-gray-3 hover:border-neutral-gray-4 transition-colors">
        <div className="p-2.5 bg-blue-1 rounded-xl shrink-0">
          <Icon
            icon={TYPE_ICONS[resource.type] || "mdi:link"}
            className="w-5 h-5 text-primary"
          />
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
          <p className="text-sm font-medium text-secondary truncate">{resource.title}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-neutral-gray-6 bg-neutral-gray-2 px-2 py-0.5 rounded-full">
              {TYPE_LABELS[resource.type] || resource.type}
            </span>
            {resource.description && (
              <span className="text-xs text-neutral-gray-5 truncate max-w-[200px]">
                {resource.description}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          {href && (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              title="Open"
              className="w-8 h-8 flex items-center justify-center rounded-full text-neutral-gray-5 hover:text-primary hover:bg-blue-1 transition-colors"
            >
              <Icon icon="mynaui:external-link-solid" className="w-4 h-4" />
            </a>
          )}
          <button
            onClick={() => onEdit(resource)}
            title="Edit"
            className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full text-neutral-gray-5 hover:text-primary hover:bg-blue-1 transition-colors"
          >
            <Icon icon="mdi:pencil-outline" className="w-4 h-4" />
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            title="Delete"
            className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full text-neutral-gray-5 hover:text-error-7 hover:bg-error-1 transition-colors"
          >
            <Icon icon="mdi:trash-can-outline" className="w-4 h-4" />
          </button>
        </div>
      </div>

      {confirmDelete && (
        <Modal onClose={() => setConfirmDelete(false)} className="max-w-sm" xIcon={false} dragHandle={false}>
          <div className="flex flex-col items-center gap-5 p-4">
            <div className="w-14 h-14 rounded-full bg-error-1 flex items-center justify-center">
              <Icon icon="mdi:trash-can-outline" className="w-7 h-7 text-error-8" />
            </div>
            <div className="flex flex-col items-center gap-1.5 text-center">
              <h3 className="text-base font-semibold text-neutral-gray-10">Delete this resource?</h3>
              <p className="text-sm text-neutral-gray-6">This action cannot be undone.</p>
            </div>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setConfirmDelete(false)}
                className="cursor-pointer flex-1 px-4 py-2.5 rounded-xl border border-neutral-gray-4 text-sm font-medium text-neutral-gray-8 hover:bg-neutral-gray-2 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { onDelete(resource.id); setConfirmDelete(false); }}
                className="cursor-pointer flex-1 px-4 py-2.5 rounded-xl bg-error-7 text-sm font-medium text-white hover:bg-error-8 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

// ─── Upload modal ─────────────────────────────────────────────────────────────
const UPLOAD_TYPES = [
  { value: "telegram", label: "Telegram", icon: "jam:telegram" },
  { value: "drive", label: "Google Drive", icon: "mingcute:drive-fill" },
  { value: "youtube", label: "YouTube", icon: "qlementine-icons:youtube-fill-24" },
  { value: "file", label: "File Upload", icon: "mdi:file-document-outline" },
];

// Ensures a URL has a scheme; prepends https:// if missing
function normalizeUrl(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function UploadModal({ onClose, onSuccess, isLecturer, courses = [], resource = null }) {
  const isEdit = !!resource;
  const [form, setForm] = useState({
    type:        resource?.type        ?? "telegram",
    title:       resource?.title       ?? "",
    description: resource?.description ?? "",
    url:         resource?.url         ?? "",
    courseId:    resource?.courseId    ?? "",
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  async function handleSubmit() {
    setError("");
    if (!form.title.trim()) return setError("Title is required.");
    if (form.type !== "file" && !form.url.trim()) return setError("URL is required.");
    if (form.type === "file" && !isEdit && !file) return setError("Please select a file to upload.");
    if (isLecturer && !form.courseId) return setError("Please select a course.");

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title.trim());
      fd.append("type", form.type);
      if (form.description.trim()) fd.append("description", form.description.trim());
      if (form.type === "file") {
        if (file) fd.append("file", file);
      } else {
        fd.append("url", normalizeUrl(form.url));
      }
      if (isLecturer && form.courseId) fd.append("course_id", form.courseId);

      if (isEdit) {
        await resourcesService.update(resource.id, fd);
      } else {
        await resourcesService.create(fd);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || (isEdit ? "Update failed. Please try again." : "Upload failed. Please try again."));
    } finally {
      setUploading(false);
    }
  }

  return (
    <Modal onClose={onClose} className="max-w-lg" dragHandle={false}>
      <div className="flex flex-col gap-6 p-1">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-secondary">{isEdit ? "Edit Resource" : "Upload Resource"}</h2>
          <p className="text-sm text-neutral-gray-6">{isEdit ? "Update your resource details" : "Share a link or file with your students"}</p>
        </div>

        {/* Type selector */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-secondary">Type</p>
          <div className="flex items-center gap-2 flex-wrap">
            {UPLOAD_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => { set("type", t.value); setFile(null); set("url", ""); }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-colors border
                  ${form.type === t.value
                    ? "bg-primary text-blue-1 border-primary"
                    : "border-neutral-gray-5 text-neutral-gray-6 hover:bg-neutral-gray-2"
                  }`}
              >
                <Icon icon={t.icon} className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Course selector — lecturer only */}
        {isLecturer && (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-secondary">
              Course <span className="text-error-7">*</span>
            </p>
            {courses.length === 0 ? (
              <p className="text-sm text-neutral-gray-5 italic">No courses assigned.</p>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                {courses.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => set("courseId", c.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-colors border
                      ${form.courseId === c.id
                        ? "bg-primary text-blue-1 border-primary"
                        : "border-neutral-gray-5 text-neutral-gray-6 hover:bg-neutral-gray-2"
                      }`}
                  >
                    <span className="font-semibold">{c.code}</span>
                    <span className="hidden sm:inline">— {c.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Title */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-secondary">Title <span className="text-error-7">*</span></p>
          <Input
            placeholder="e.g. CS3 – Data Structures & Algorithms"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-secondary">Description <span className="text-neutral-gray-5 font-normal">(optional)</span></p>
          <Input
            placeholder="Brief description of this resource"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </div>

        {/* URL or File */}
        {form.type === "file" ? (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-secondary">
              File {isEdit ? <span className="text-neutral-gray-5 font-normal">(leave blank to keep current)</span> : <span className="text-error-7">*</span>}
            </p>
            {/* Show current file name in edit mode */}
            {isEdit && resource.fileName && !file && (
              <div className="flex items-center gap-2 px-3 py-2 bg-neutral-gray-2 rounded-xl text-sm text-neutral-gray-7">
                <Icon icon="mdi:file-document-outline" className="w-4 h-4 shrink-0" />
                <span className="truncate">{resource.fileName}</span>
                <span className="text-xs text-neutral-gray-5 shrink-0">(current)</span>
              </div>
            )}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-5 bg-zinc-100 rounded-2xl flex flex-col items-center gap-2 cursor-pointer hover:bg-zinc-200 transition-colors"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='16' ry='16' stroke='%23a1a1aa' stroke-width='2' stroke-dasharray='5%2c 12' stroke-linecap='square'/%3e%3c/svg%3e")`,
              }}
            >
              <Icon icon="lucide:upload" className="w-7 h-7 text-neutral-gray-7" />
              {file ? (
                <p className="text-sm text-secondary font-medium">{file.name}</p>
              ) : (
                <p className="text-sm text-neutral-gray-6 text-center">
                  {isEdit ? "Click to replace file" : "Click to browse"} — PDF, DOCX, JPG, PNG up to 10MB
                </p>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-secondary">URL <span className="text-error-7">*</span></p>
            <Input
              placeholder="https://..."
              value={form.url}
              onChange={(e) => set("url", e.target.value)}
            />
          </div>
        )}

        {error && <p className="text-sm text-error-8">{error}</p>}

        <div className="flex gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={uploading}
            className="flex-1 font-medium rounded-[10px]! px-4! py-2.5!"
          >
            {uploading ? (isEdit ? "Saving…" : "Uploading…") : (isEdit ? "Save Changes" : "Upload")}
          </Button>
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-2.5 rounded-[10px] text-sm font-medium text-neutral-gray-8 hover:bg-neutral-gray-2 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ResourcesPage() {
  const { user } = useAuth();
  const isLecturer = user?.role === "lecturer";
  const canUpload = user?.role === "course_rep" || isLecturer;

  // Lecturers go straight to their uploads; others default to all resources
  const [view, setView] = useState(isLecturer ? "my" : "all");

  // All-resources state
  const [resources, setResources] = useState([]);
  const [loadingAll, setLoadingAll] = useState(false);
  const [activeTab, setActiveTab] = useState("telegram");
  const [searchQuery, setSearchQuery] = useState("");

  // My-uploads state
  const [myUploads, setMyUploads] = useState([]);
  const [loadingMine, setLoadingMine] = useState(false);

  // Upload / edit modal
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null); // resource being edited

  const fetchAll = useCallback(async () => {
    setLoadingAll(true);
    try {
      if (activeTab === 'file') {
        // Merge user-uploaded files + announcement attachments into one list
        const [resourcesRes, attachmentsRes] = await Promise.allSettled([
          resourcesService.getAll({ type: 'file' }),
          resourcesService.getAttachments(),
        ]);

        const uploadedFiles = resourcesRes.status === 'fulfilled'
          ? (resourcesRes.value.data?.data ?? []).map(normalizeResource)
          : [];

        const attachmentFiles = attachmentsRes.status === 'fulfilled'
          ? (attachmentsRes.value.data?.data?.attachments ?? []).map(normalizeAttachment)
          : [];

        // Sort merged list by date, newest first
        const merged = [...uploadedFiles, ...attachmentFiles].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setResources(merged);
      } else {
        const { data } = await resourcesService.getAll({ type: activeTab });
        setResources((data?.data ?? []).map(normalizeResource));
      }
    } catch {
      setResources([]);
    } finally {
      setLoadingAll(false);
    }
  }, [activeTab]);

  const fetchMine = useCallback(async () => {
    setLoadingMine(true);
    try {
      const { data } = await resourcesService.getMine();
      setMyUploads((data?.data ?? []).map(normalizeResource));
    } catch {
      setMyUploads([]);
    } finally {
      setLoadingMine(false);
    }
  }, []);

  useEffect(() => {
    if (view === "all") fetchAll();
  }, [view, fetchAll]);

  useEffect(() => {
    if (view === "my") fetchMine();
  }, [view, fetchMine]);

  async function handleDelete(id) {
    setMyUploads((prev) => prev.filter((r) => r.id !== id));
    try {
      await resourcesService.delete(id);
    } catch {
      fetchMine();
    }
  }

  function handleEditClick(resource) {
    setEditingResource(resource);
    setUploadOpen(true);
  }

  function handleModalClose() {
    setUploadOpen(false);
    setEditingResource(null);
  }

  const tab = TABS.find((t) => t.value === activeTab);

  const filteredAll = useMemo(() => {
    if (!searchQuery.trim()) return resources;
    const q = searchQuery.toLowerCase();
    return resources.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q),
    );
  }, [resources, searchQuery]);

  const filteredMine = useMemo(() => {
    if (!searchQuery.trim()) return myUploads;
    const q = searchQuery.toLowerCase();
    return myUploads.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q),
    );
  }, [myUploads, searchQuery]);

  const mobileCard =
    "bg-white rounded-[20px] shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10),0px_1px_3px_0px_rgba(0,0,0,0.10)] lg:bg-transparent lg:shadow-none lg:rounded-none";

  return (
    <div className="flex flex-col lg:min-h-0 gap-3 lg:gap-6 h-full overflow-y-auto lg:overflow-visible scrollbar-hide">

      {/* ── Header ── */}
      <div className={`shrink-0 flex flex-col gap-4 lg:gap-5 px-3.5 py-5 lg:p-0 ${mobileCard}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1 lg:gap-2">
            {view === "my" && !isLecturer && (
              <button
                onClick={() => { setView("all"); setSearchQuery(""); }}
                className="cursor-pointer flex items-center gap-1 text-neutral-gray-6 hover:text-neutral-gray-9 transition-colors w-fit mb-1"
              >
                <Icon icon="ci:chevron-left" className="w-4 h-4" />
                <span className="text-sm">All Resources</span>
              </button>
            )}
            <h1 className="text-xl lg:text-[32px] font-bold text-secondary leading-none">
              {view === "my" ? "My Uploads" : "Resources"}
            </h1>
            <p className="text-sm lg:text-base text-neutral-gray-8">
              {view === "my"
                ? "Manage resources you've shared with students"
                : "Course materials, channels and learning links"}
            </p>
          </div>

          {/* Right-side actions */}
          <div className="flex items-center gap-2 shrink-0 mt-1 lg:mt-2">
            {canUpload && view === "my" && !loadingMine && myUploads.length > 0 && (
              <Button
                variant="primary"
                size="md"
                onClick={() => setUploadOpen(true)}
                className="rounded-full! xsm:rounded-xl! sm:px-4! p-2.25! sm:py-2.5!"
              >
                <Icon icon="lucide:plus" className="w-4.5 h-4.5" />
                <span className="hidden xsm:flex text-sm">Upload New</span>
              </Button>
            )}
            {canUpload && view === "all" && (
              <button
                onClick={() => { setView("my"); setSearchQuery(""); }}
                className="cursor-pointer flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-neutral-gray-4 text-sm font-medium text-neutral-gray-7 hover:bg-neutral-gray-2 transition-colors"
              >
                <Icon icon="mdi:cloud-upload-outline" className="w-4 h-4" />
                My Uploads
              </button>
            )}
          </div>
        </div>

        {/* Tab navigation — only in 'all' view */}
        {view === "all" && (
          <div className="flex items-end gap-5 -mb-px">
            {TABS.map((t) => (
              <button
                key={t.value}
                onClick={() => { setActiveTab(t.value); setSearchQuery(""); }}
                className={`cursor-pointer flex items-center gap-1.5 lg:gap-2 py-2 lg:py-2.5 text-xs lg:text-sm font-medium transition-colors border-b-2
                  ${activeTab === t.value
                    ? "border-primary text-primary"
                    : "border-transparent text-neutral-gray-6 hover:text-neutral-gray-9 hover:border-neutral-gray-4"
                  }`}
              >
                <Icon icon={t.icon} className="w-5 h-5 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 shrink-0" />
                <span className="hidden sm:block">{t.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Search — desktop only ── */}
      <div className="hidden lg:flex shrink-0 items-center gap-3 mx-auto">
        <div className="group flex-1 lg:min-w-70 xl:min-w-100 flex items-center justify-between pl-3 lg:pl-5 pr-1 lg:pr-1.5 py-1.5 rounded-full outline-[0.67px] outline-neutral-gray-5 focus-within:outline-secondary bg-white">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={view === "my" ? "Search your uploads..." : "Search resources..."}
            className="bg-transparent text-xs lg:text-sm text-neutral-gray-9 placeholder:text-neutral-gray-6 outline-none flex-1 min-w-0"
          />
          <button className="cursor-pointer w-6 h-6 lg:w-8 lg:h-8 bg-secondary hover:bg-secondary/90 rounded-full flex items-center justify-center shrink-0">
            <Icon icon="lucide:search" className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div className={`sticky top-0 z-10 lg:static lg:z-auto lg:flex-1 lg:min-h-0 flex flex-col gap-2.5 p-3.5 lg:p-0 ${mobileCard}`}>
        {/* Mobile search */}
        <div className="lg:hidden py-2.5 bg-white sticky top-0 z-5 shrink-0 flex items-center gap-3">
          <div className="group flex-1 flex items-center justify-between pl-3 pr-1 py-1.5 rounded-full outline-[0.67px] outline-neutral-gray-5 focus-within:outline-secondary bg-white">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={view === "my" ? "Search your uploads..." : "Search resources..."}
              className="bg-transparent text-xs text-neutral-gray-9 placeholder:text-neutral-gray-6 outline-none flex-1 min-w-0"
            />
            <button className="cursor-pointer w-8 h-8 bg-secondary hover:bg-secondary/90 rounded-full flex items-center justify-center shrink-0">
              <Icon icon="lucide:search" className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        <div className="relative z-0 lg:overflow-y-auto scrollbar-hide">
          {/* ── All resources grid ── */}
          {view === "all" && (
            loadingAll ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5 lg:gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-28 rounded-2xl bg-neutral-gray-2 animate-pulse" />
                ))}
              </div>
            ) : filteredAll.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 lg:py-16 text-center">
                <Icon icon="mdi:folder-search-outline" className="w-16 h-16 lg:w-20 lg:h-20 text-neutral-gray-4" />
                <div className="flex flex-col items-center">
                  <p className="text-base lg:text-lg font-semibold text-secondary">No resources found</p>
                  <p className="text-sm lg:text-base text-neutral-gray-8">
                    {searchQuery ? "Try a different search term" : "No resources have been added yet"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5 lg:gap-3 pb-6">
                {filteredAll.map((r) => (
                  <ResourceCard key={r.id} resource={r} tab={tab} />
                ))}
              </div>
            )
          )}

          {/* ── My uploads list ── */}
          {view === "my" && (
            loadingMine ? (
              <div className="flex flex-col gap-2.5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 rounded-2xl bg-neutral-gray-2 animate-pulse" />
                ))}
              </div>
            ) : filteredMine.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-12 lg:py-16 text-center">
                <Icon icon="mdi:cloud-upload-outline" className="w-16 h-16 lg:w-20 lg:h-20 text-neutral-gray-4" />
                <div className="flex flex-col items-center gap-1.5">
                  <p className="text-base lg:text-lg font-semibold text-secondary">No uploads yet</p>
                  <p className="text-sm lg:text-base text-neutral-gray-8">
                    {searchQuery ? "Try a different search term" : "Upload your first resource to get started"}
                  </p>
                </div>
                {!searchQuery && (
                  <Button variant="primary" size="sm" onClick={() => setUploadOpen(true)} className="rounded-xl! px-5! py-2.5!">
                    <Icon icon="lucide:plus" className="w-4 h-4" />
                    Upload Resource
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 pb-6">
                {filteredMine.map((r) => (
                  <UploadCard key={r.id} resource={r} onEdit={handleEditClick} onDelete={handleDelete} />
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* ── Upload / Edit modal ── */}
      {uploadOpen && (
        <UploadModal
          onClose={handleModalClose}
          onSuccess={fetchMine}
          isLecturer={isLecturer}
          courses={user?.courses ?? []}
          resource={editingResource}
        />
      )}
    </div>
  );
}
