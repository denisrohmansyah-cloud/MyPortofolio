(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const menuToggle = $("#menuToggle");
  const siteNav = $("#siteNav");
  menuToggle?.addEventListener("click", () => {
    const open = siteNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });
  $$("#siteNav a").forEach(link => link.addEventListener("click", () => {
    siteNav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }));

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  // Show a styled fallback when local portfolio photos have not been copied to this repository yet.
  $$("img").forEach(img => {
    const markBroken = () => img.classList.add("broken-image");
    img.addEventListener("error", markBroken);
    if (img.complete && img.naturalWidth === 0) markBroken();
  });

  // Project filters.
  const filterButtons = $$(".filter-btn");
  const projectCards = $$(".project-card");
  filterButtons.forEach(button => button.addEventListener("click", () => {
    filterButtons.forEach(item => item.classList.toggle("active", item === button));
    const filter = button.dataset.filter;
    projectCards.forEach(card => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
    });
  }));

  // Synchronized gallery: swipe, arrows, dots, counter, and autoplay share one index.
  const galleryCleanups = [];
  $$(".swipe-gallery").forEach(gallery => {
    const track = $(".swipe-gallery-track", gallery);
    const slides = $$(".swipe-gallery-slide", gallery);
    const previous = $(".gallery-prev", gallery);
    const next = $(".gallery-next", gallery);
    const dots = $$(".gallery-dot", gallery);
    const counter = $(".gallery-counter", gallery);
    if (!track || slides.length < 2) return;

    let index = 0;
    let timer = null;
    let startX = 0;
    let lastScroll = 0;
    const delay = Math.max(2500, Number(gallery.dataset.autoplay) || 4500);

    const render = (nextIndex, behavior = "smooth") => {
      index = (nextIndex + slides.length) % slides.length;
      const targetLeft = slides[index].offsetLeft - slides[0].offsetLeft;
      track.scrollTo({ left: targetLeft, behavior });
      dots.forEach((dot, i) => {
        dot.classList.toggle("is-active", i === index);
        if (i === index) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
      if (counter) counter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    };
    const pause = () => { if (timer) window.clearInterval(timer); timer = null; };
    const start = () => {
      pause();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      timer = window.setInterval(() => render(index + 1), delay);
    };
    const restart = () => { pause(); start(); };

    previous?.addEventListener("click", () => { render(index - 1); restart(); });
    next?.addEventListener("click", () => { render(index + 1); restart(); });
    dots.forEach((dot, i) => dot.addEventListener("click", () => { render(i); restart(); }));
    track.addEventListener("touchstart", event => { startX = event.changedTouches[0].clientX; }, { passive: true });
    track.addEventListener("touchend", event => {
      const delta = event.changedTouches[0].clientX - startX;
      if (Math.abs(delta) > 40) { render(index + (delta < 0 ? 1 : -1)); restart(); }
    }, { passive: true });
    track.addEventListener("scroll", () => {
      if (Math.abs(track.scrollLeft - lastScroll) < 2) return;
      lastScroll = track.scrollLeft;
      const nearest = slides.reduce((best, slide, i) => {
        const distance = Math.abs(track.scrollLeft - (slide.offsetLeft - slides[0].offsetLeft));
        return distance < best.distance ? { index: i, distance } : best;
      }, { index: 0, distance: Infinity });
      if (nearest.index !== index) {
        index = nearest.index;
        dots.forEach((dot, i) => {
          dot.classList.toggle("is-active", i === index);
          if (i === index) dot.setAttribute("aria-current", "true");
          else dot.removeAttribute("aria-current");
        });
        if (counter) counter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
      }
    }, { passive: true });

    gallery.addEventListener("mouseenter", pause);
    gallery.addEventListener("mouseleave", start);
    gallery.addEventListener("focusin", pause);
    gallery.addEventListener("focusout", event => {
      if (!gallery.contains(event.relatedTarget)) start();
    });
    document.addEventListener("visibilitychange", () => document.hidden ? pause() : start());
    render(0, "auto");
    start();
    galleryCleanups.push(pause);
  });

  // Image lightbox.
  const lightbox = $("#lightbox");
  const lightboxImage = $("#lightboxImage");
  const lightboxCaption = $("#lightboxCaption");
  const closeButton = $("#lightboxClose");
  let lastFocused = null;
  const closeLightbox = () => {
    lightbox?.classList.remove("open");
    lightbox?.setAttribute("aria-hidden", "true");
    if (lightboxImage) { lightboxImage.src = ""; lightboxImage.alt = ""; }
    document.body.style.overflow = "";
    lastFocused?.focus?.();
  };
  $$("[data-lightbox]").forEach(button => button.addEventListener("click", () => {
    const source = button.dataset.lightbox;
    lastFocused = button;
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = source;
    lightboxImage.alt = button.dataset.alt || "Image preview";
    lightboxCaption.textContent = lightboxImage.alt;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeButton?.focus();
  }));
  closeButton?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", event => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && lightbox?.classList.contains("open")) closeLightbox();
  });

  // Scroll reveal, with a safe visible fallback for browsers without IntersectionObserver.
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    $$(".hero-copy, .hero-visual, .section-heading, .skill-card, .project-card, .achievement-card, .achievement-feature, .experience-card, .education-card, .cert-inline").forEach((element, index) => {
      element.classList.add("reveal");
      if (element.classList.contains("skill-card")) element.style.setProperty("--delay", `${(index % 4) * 70}ms`);
      observer.observe(element);
    });
  }
})();