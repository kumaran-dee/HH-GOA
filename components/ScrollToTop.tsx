"use client";

import { useEffect } from "react";

export default function ScrollToTop() {
  useEffect(() => {
    // Disable automatic browser scroll restoration on refresh/load
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }

      // Scroll to absolute top immediately on page load / refresh
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });

      // Handle beforeunload to ensure top position before refresh finishes
      const handleBeforeUnload = () => {
        window.scrollTo(0, 0);
      };

      // Handle pagehide and load
      const handlePageShow = (e: PageTransitionEvent) => {
        if (e.persisted) {
          window.scrollTo(0, 0);
        }
      };

      window.addEventListener("beforeunload", handleBeforeUnload);
      window.addEventListener("pageshow", handlePageShow);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        window.removeEventListener("pageshow", handlePageShow);
      };
    }
  }, []);

  return null;
}
