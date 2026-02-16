/**
 * trackTS Info Page - Scroll Reveal Animations
 * Uses native Intersection Observer API (no dependencies)
 */
(function () {
  "use strict";

  // Replace 'no-js' class with 'js' to indicate JavaScript is enabled
  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");

  // Only initialize if animations are enabled
  if (!document.body.classList.contains("has-animations")) {
    // If no animations, make all reveal elements visible immediately
    document.querySelectorAll(".reveal, .reveal-scale").forEach((el) => {
      el.classList.add("revealed");
    });
    return;
  }

  /**
   * Initialize scroll reveal using Intersection Observer
   */
  function initScrollReveal() {
    const revealElements = document.querySelectorAll(".reveal, .reveal-scale");

    if (!revealElements.length) return;

    // Check for Intersection Observer support
    if (!("IntersectionObserver" in window)) {
      // Fallback: show all elements immediately
      revealElements.forEach((el) => el.classList.add("revealed"));
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.15,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          // Stop observing once revealed
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach((el) => observer.observe(el));
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initScrollReveal);
  } else {
    initScrollReveal();
  }
})();
