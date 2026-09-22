(() => {
  "use strict";

  /* ------------------------------------------------------------
     Ano no rodapé
     ------------------------------------------------------------ */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------
     Header: blur/sombra ao rolar
     ------------------------------------------------------------ */
  const header = document.getElementById("siteHeader");
  const onScrollHeader = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ------------------------------------------------------------
     Menu mobile
     ------------------------------------------------------------ */
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const mobileNav = document.getElementById("mobileNav");

  const closeMobileNav = () => {
    if (!hamburgerBtn || !mobileNav) return;
    hamburgerBtn.setAttribute("aria-expanded", "false");
    hamburgerBtn.setAttribute("aria-label", "Abrir menu");
    mobileNav.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  if (hamburgerBtn && mobileNav) {
    hamburgerBtn.addEventListener("click", () => {
      const isOpen = mobileNav.classList.toggle("is-open");
      hamburgerBtn.setAttribute("aria-expanded", String(isOpen));
      hamburgerBtn.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMobileNav);
    });
  }

  /* ------------------------------------------------------------
     Reveal on scroll (IntersectionObserver)
     ------------------------------------------------------------ */
  const revealTargets = document.querySelectorAll(".reveal, .reveal-stagger");

  if ("IntersectionObserver" in window && revealTargets.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

  /* ------------------------------------------------------------
     Slider Antes / Depois (arrastável — mouse e touch)
     ------------------------------------------------------------ */
  const initBeforeAfterSlider = (slider) => {
    const afterLayer = slider.querySelector(".ba-slider__after");
    const handle = slider.querySelector(".ba-slider__handle");
    if (!afterLayer || !handle) return;

    let isDragging = false;

    const setPosition = (percent) => {
      const clamped = Math.min(100, Math.max(0, percent));
      afterLayer.style.clipPath = `inset(0 ${100 - clamped}% 0 0)`;
      handle.style.left = `${clamped}%`;
    };

    const percentFromClientX = (clientX) => {
      const rect = slider.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * 100;
    };

    const onPointerMove = (clientX) => {
      setPosition(percentFromClientX(clientX));
    };

    slider.addEventListener("pointerdown", (e) => {
      isDragging = true;
      slider.setPointerCapture(e.pointerId);
      onPointerMove(e.clientX);
    });

    slider.addEventListener("pointermove", (e) => {
      if (!isDragging) return;
      onPointerMove(e.clientX);
    });

    const stopDragging = (e) => {
      isDragging = false;
      if (e && e.pointerId !== undefined && slider.hasPointerCapture?.(e.pointerId)) {
        slider.releasePointerCapture(e.pointerId);
      }
    };
    slider.addEventListener("pointerup", stopDragging);
    slider.addEventListener("pointercancel", stopDragging);
    slider.addEventListener("pointerleave", () => { isDragging = false; });

    // Teclado: setas movem o handle quando focado
    handle.setAttribute("tabindex", "0");
    handle.setAttribute("role", "slider");
    handle.setAttribute("aria-label", "Comparar antes e depois");
    handle.setAttribute("aria-valuemin", "0");
    handle.setAttribute("aria-valuemax", "100");
    handle.setAttribute("aria-valuenow", "50");

    handle.addEventListener("keydown", (e) => {
      const current = parseFloat(handle.style.left) || 50;
      if (e.key === "ArrowLeft") {
        setPosition(current - 5);
        e.preventDefault();
      } else if (e.key === "ArrowRight") {
        setPosition(current + 5);
        e.preventDefault();
      }
    });

    setPosition(50);
  };

  document.querySelectorAll(".ba-slider").forEach(initBeforeAfterSlider);

  /* ------------------------------------------------------------
     Filtro de resultados (Facial / Corporal)
     ------------------------------------------------------------ */
  const resultTabs = document.querySelectorAll(".results__tab");
  const resultItems = document.querySelectorAll(".ba-slider[data-category]");

  resultTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const filter = tab.dataset.filter;

      resultTabs.forEach((t) => {
        t.classList.toggle("is-active", t === tab);
        t.setAttribute("aria-selected", String(t === tab));
      });

      resultItems.forEach((item) => {
        item.hidden = item.dataset.category !== filter;
      });
    });
  });

  /* ------------------------------------------------------------
     Fecha o menu mobile ao redimensionar para desktop
     ------------------------------------------------------------ */
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 900) closeMobileNav();
  });
})();
