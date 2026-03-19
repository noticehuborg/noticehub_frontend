import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }
    // Jump to top first so the page doesn't slide from the previous position,
    // then smoothly scroll to the target element after it renders.
    window.scrollTo({ top: 0, behavior: "instant" });
    const timeout = setTimeout(() => {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 80);
    return () => clearTimeout(timeout);
  }, [pathname, hash]);

  return null;
}
