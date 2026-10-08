/* ==========================================
   MEJAVI SECURITY HARDENING
========================================== */

(function () {
  "use strict";

  const BLANK_REL_VALUES = ["noopener", "noreferrer"];

  function normalizedHref(value) {
    return String(value || "")
      .trim()
      .replace(/[\u0000-\u001f\u007f\s]+/g, "");
  }

  function isDangerousHref(value) {
    return /^(?:javascript|vbscript|data):/i.test(normalizedHref(value));
  }

  function hardenLink(link) {
    if (!(link instanceof HTMLAnchorElement)) return;

    const href = link.getAttribute("href");
    if (href && isDangerousHref(href)) {
      link.removeAttribute("href");
      link.setAttribute("aria-disabled", "true");
    }

    if (link.target === "_blank") {
      const rel = new Set(
        String(link.getAttribute("rel") || "")
          .split(/\s+/)
          .filter(Boolean)
      );

      BLANK_REL_VALUES.forEach((value) => rel.add(value));
      link.setAttribute("rel", Array.from(rel).join(" "));
    }
  }

  function hardenLinks(root) {
    if (root?.matches?.("a")) hardenLink(root);
    root?.querySelectorAll?.("a").forEach(hardenLink);
  }

  function boot() {
    hardenLinks(document);

    if (!("MutationObserver" in window)) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) hardenLinks(node);
        });
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
