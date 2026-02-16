(function () {
  const docElement = document.documentElement;

  // Replace 'no-js' class with 'js' to indicate JavaScript is enabled
  docElement.classList.remove("no-js");
  docElement.classList.add("js");

  // Initialize scroll reveal animations if the page has animations enabled
  if (document.body.classList.contains("has-animations")) {
    const sr = (window.sr = ScrollReveal());

    // Reveal hero section elements
    sr.reveal(".hero-title, .hero-paragraph, .newsletter-header, .newsletter-form", {
      duration: 1000,
      distance: "40px",
      easing: "cubic-bezier(0.5, -0.01, 0, 1.005)",
      origin: "bottom",
      interval: 150,
    });

    // Reveal bubble decorations and browser mockup
    sr.reveal(".bubble-3, .bubble-4, .hero-browser-inner, .bubble-1, .bubble-2", {
      duration: 1000,
      scale: 0.95,
      easing: "cubic-bezier(0.5, -0.01, 0, 1.005)",
      interval: 150,
    });

    // Reveal feature cards
    sr.reveal(".feature", {
      duration: 600,
      distance: "40px",
      easing: "cubic-bezier(0.5, -0.01, 0, 1.005)",
      interval: 100,
      origin: "bottom",
      viewFactor: 0.5,
    });
  }
})();
