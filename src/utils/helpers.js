// Shared utility functions used across dashboard pages

export function initials(name) {
  return name?.[0]?.toUpperCase() ?? "?";
}

export function timeAgo(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const h = Math.floor(diffMs / 3600000);
  if (h < 1) return "Just now";
  if (h < 24) return `${h}h ago`;
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
  });
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
