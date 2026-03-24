export const CATEGORY = {
  assignment: { label: "Assignments", icon: "si:assignment-line" },
  general:    { label: "General",     icon: "material-symbols:info-outline-rounded" },
  exam:       { label: "Exams",       icon: "streamline-ultimate:pen-write" },
};

export const ATTACH_ICONS = {
  pdf:   { icon: "ph:file-pdf" },
  image: { icon: "mage:image" },
  docx:  { icon: "bi:filetype-docx" },
};

export const DATE_FILTERS = [
  { value: "none",     label: "Date",      labelSelect: "--None--"    },
  { value: "today",    label: "Today",     labelSelect: "Today"       },
  { value: "yesterday",label: "Yesterday", labelSelect: "Yesterday"   },
  { value: "last3",    label: "Last 3 days",labelSelect: "Last 3 days"},
  { value: "thisweek", label: "This week", labelSelect: "This week"   },
  { value: "lastweek", label: "Last week", labelSelect: "Last week"   },
];
