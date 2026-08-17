/* =========================================================================
   ANANYA — Fiber & Crochet Artist | Editorial Portfolio
   script.js
   -------------------------------------------------------------------------
   Dependency-free. Modules:
     A. Lightbox modal  — opens a full-screen preview from a gallery piece,
                          mirroring its photo/placeholder and reading details
                          from the piece's data-* attributes.
     B. Scroll reveal   — fades sections in as they enter the viewport.
     C. Hero parallax   — a whisper of drift on the fixed photograph.
     D. Footer year.
   ========================================================================= */
(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    initLightbox();
    initReveal();
    initParallax();
    initTopbar();
    wireContact();
    stampYear();
  });

  /* -----------------------------------------------------------------------
     Topbar — add .is-scrolled once the cream sheet rises under the bar, so
     the nav switches from light (over photo) to dark (over cream).
     ----------------------------------------------------------------------- */
  function initTopbar() {
    var bar = document.querySelector(".topbar");
    if (!bar) return;
    var ticking = false;
    function update() {
      // switch a little before the hero fully leaves the viewport
      var trigger = window.innerHeight * 0.82;
      bar.classList.toggle("is-scrolled", (window.scrollY || 0) > trigger);
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* -----------------------------------------------------------------------
     A. LIGHTBOX MODAL
     ----------------------------------------------------------------------- */
  function initLightbox() {
    var modal = document.getElementById("lightbox");
    if (!modal) return;

    var els = {
      media:  document.getElementById("lb-media"),
      title:  document.getElementById("lb-title"),
      yarn:   document.getElementById("lb-yarn"),
      stitch: document.getElementById("lb-stitch"),
      story:  document.getElementById("lb-story"),
    };

    var pieces = Array.prototype.slice.call(document.querySelectorAll(".piece"));
    var lastFocused = null;

    function open(piece) {
      lastFocused = piece;

      els.title.textContent  = piece.getAttribute("data-title")  || "Untitled piece";
      els.yarn.textContent   = piece.getAttribute("data-yarn")   || "—";
      els.stitch.textContent = piece.getAttribute("data-stitch") || "—";
      els.story.textContent  = piece.getAttribute("data-story")  || "";

      // Mirror the piece's swatch + real photo (if present) into the modal
      var swatch = piece.getAttribute("data-swatch") || "a";
      els.media.style.setProperty("--lb-swatch", "var(--sw-" + swatch + ")");
      // The card face uses --photo; a card may override the enlarged view via data-lb-photo
      var lbOverride = piece.getAttribute("data-lb-photo");
      var photo = lbOverride ? "url('" + lbOverride + "')" : piece.style.getPropertyValue("--photo");
      els.media.style.setProperty("--lb-photo", photo && photo.trim() ? photo : "none");
      // Carry any per-piece vertical crop nudge into the enlarged view
      var photoY = piece.style.getPropertyValue("--photo-y");
      els.media.style.setProperty("--lb-photo-y", photoY && photoY.trim() ? photoY : "center");

      modal.hidden = false;
      document.body.style.overflow = "hidden";
      var closeBtn = modal.querySelector(".lightbox__close");
      if (closeBtn) closeBtn.focus();
    }

    function close() {
      modal.hidden = true;
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
      lastFocused = null;
    }

    pieces.forEach(function (piece) {
      piece.addEventListener("click", function () { open(piece); });
    });

    modal.querySelectorAll("[data-close]").forEach(function (el) {
      el.addEventListener("click", close);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.hidden) close();
    });
  }

  /* -----------------------------------------------------------------------
     B. SCROLL REVEAL
     ----------------------------------------------------------------------- */
  function initReveal() {
    var items = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (!("IntersectionObserver" in window) || !items.length) {
      items.forEach(function (i) { i.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (i) { io.observe(i); });
  }

  /* -----------------------------------------------------------------------
     C. HERO PARALLAX — a subtle vertical drift on the fixed photograph.
     Uses requestAnimationFrame; respects reduced-motion.
     ----------------------------------------------------------------------- */
  function initParallax() {
    var photo = document.querySelector(".backdrop__photo");
    if (!photo) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var ticking = false;
    function update() {
      var y = window.scrollY || window.pageYOffset;
      // gentle: 4% of scroll, capped
      var shift = Math.min(y * 0.04, 60);
      photo.style.transform = "scale(1.05) translateY(" + shift + "px)";
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* -----------------------------------------------------------------------
     D. Footer year
     ----------------------------------------------------------------------- */
  function stampYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* -----------------------------------------------------------------------
     E. Contact email — assembled at runtime from base64 parts so the raw
        HTML never contains a plaintext address for spam crawlers to harvest.
     ----------------------------------------------------------------------- */
  function wireContact() {
    var els = document.querySelectorAll("[data-contact]");
    if (!els.length) return;
    try {
      var addr = atob("YW5hbmRhbmFueWE0") + "@" + atob("aWNsb3VkLmNvbQ==");
      var href = "mailto:" + addr;
      Array.prototype.forEach.call(els, function (el) {
        var subj = el.getAttribute("data-subject");
        el.setAttribute("href", href + (subj ? "?subject=" + encodeURIComponent(subj) : ""));
      });
    } catch (e) { /* no-op */ }
  }
})();
