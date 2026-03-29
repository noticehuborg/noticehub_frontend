export const CATEGORY = {
  assignment: { label: "Assignments", icon: "si:assignment-line" },
  general: { label: "General", icon: "material-symbols:info-outline-rounded" },
  exam: { label: "Exams", icon: "streamline-ultimate:pen-write" },
};

export const ATTACH_ICONS = {
  pdf: { icon: "bi:filetype-pdf" },
  image: { icon: "mage:image" },
  docx: { icon: "bi:filetype-docx" },
  doc: { icon: "bi:filetype-docx" },
  xlsx: { icon: "bi:filetype-xlsx" },
  xls: { icon: "bi:filetype-xlsx" },
  pptx: { icon: "bi:filetype-pptx" },
  txt: { icon: "bi:filetype-txt" },
  csv: { icon: "bi:filetype-csv" },
  zip: { icon: "bi:file-zip" },
  default: { icon: "basil:document-outline" },
};

/**
 * Resolves an attachment icon from a MIME type or simple extension key.
 * att.type from the backend is a MIME string like "image/jpeg", "application/pdf".
 */
export function getAttachIcon(mimeOrKey) {
  if (!mimeOrKey) return ATTACH_ICONS.default;

  const m = mimeOrKey.toLowerCase();

  // Direct key lookup (e.g. "pdf", "image")
  if (ATTACH_ICONS[m]) return ATTACH_ICONS[m];

  // MIME-type resolution
  if (m.startsWith("image/")) return ATTACH_ICONS.image;
  if (m === "application/pdf") return ATTACH_ICONS.pdf;
  if (
    m ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    m === "application/msword"
  )
    return ATTACH_ICONS.docx;
  if (
    m === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    m === "application/vnd.ms-excel"
  )
    return ATTACH_ICONS.xlsx;
  if (
    m ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
    m === "application/vnd.ms-powerpoint"
  )
    return ATTACH_ICONS.pptx;
  if (m === "text/csv") return ATTACH_ICONS.csv;
  if (m.startsWith("text/")) return ATTACH_ICONS.txt;
  if (m === "application/zip" || m === "application/x-zip-compressed")
    return ATTACH_ICONS.zip;

  // Extension fallback from filename-style keys
  const ext = m.split("/").pop().split(".").pop();
  return ATTACH_ICONS[ext] ?? ATTACH_ICONS.default;
}

export const DATE_FILTERS = [
  { value: "none", label: "Date", labelSelect: "--None--" },
  { value: "today", label: "Today", labelSelect: "Today" },
  { value: "yesterday", label: "Yesterday", labelSelect: "Yesterday" },
  { value: "last3", label: "Last 3 days", labelSelect: "Last 3 days" },
  { value: "thisweek", label: "This week", labelSelect: "This week" },
  { value: "lastweek", label: "Last week", labelSelect: "Last week" },
];
