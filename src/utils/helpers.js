// Shared utility functions used across dashboard pages

export function initials(name) {
  return name?.[0]?.toUpperCase() ?? "?";
}

export function timeAgo(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "";

  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 5) return `${diffDay} days ago`;

  // Same year → "Sat, Feb 28"; different year → "Sat, Feb 28 2025"
  const opts = { weekday: "short", month: "short", day: "numeric" };
  if (d.getFullYear() !== now.getFullYear()) opts.year = "numeric";
  return d.toLocaleDateString("en-US", opts);
}

export function isRecent(dateString) {
  return Date.now() - new Date(dateString).getTime() < 24 * 3600000;
}

export function splitFilename(name) {
  const dot = name.lastIndexOf(".");
  if (dot <= 0) return { base: name, ext: "" };
  return { base: name.slice(0, dot), ext: name.slice(dot) };
}

export function matchesDate(dateStr, filter) {
  if (filter === "none") return true;
  const d = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  switch (filter) {
    case "today": return d >= today;
    case "yesterday": {
      const yest = new Date(today);
      yest.setDate(today.getDate() - 1);
      return d >= yest && d < today;
    }
    case "last3": {
      const l3 = new Date(today);
      l3.setDate(today.getDate() - 3);
      return d >= l3;
    }
    case "thisweek": {
      const ws = new Date(today);
      ws.setDate(today.getDate() - today.getDay());
      return d >= ws;
    }
    case "lastweek": {
      const thisWS = new Date(today);
      thisWS.setDate(today.getDate() - today.getDay());
      const lastWS = new Date(thisWS);
      lastWS.setDate(thisWS.getDate() - 7);
      return d >= lastWS && d < thisWS;
    }
    default: return true;
  }
}
