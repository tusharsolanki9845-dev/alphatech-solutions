/** AlphaTech Solutions — client enquiry and navigation interactions. */

const WHATSAPP_NUMBER = "916396015608" as const;
const WHATSAPP_BASE = `https://wa.me/${WHATSAPP_NUMBER}` as const;
const THEME_STORAGE_KEY = "alphatech-theme" as const;

document.documentElement.classList.add("js");

interface ServiceDetail {
  body: string;
  points: readonly string[];
}

const serviceDetails: Record<string, ServiceDetail> = {
  "Custom Website Development": {
    body: "A professional website designed around your business, customers, and goals. We agree on the pages and features together before work begins.",
    points: [
      "Business and company websites",
      "Agreed page list and custom design",
      "Mobile-friendly layouts and contact paths",
      "Clear handover and support options",
    ],
  },
  "Landing Pages": {
    body: "A clear, focused page for a product, service, campaign, event, or business launch — shaped around the message you want customers to act on.",
    points: [
      "Purpose-built page structure",
      "Lead forms and calls to action",
      "Brand-aligned visuals and content",
      "Works across phones and desktop screens",
    ],
  },
  "E-Commerce & Ordering": {
    body: "An online catalogue and ordering experience for shops, restaurants, and growing businesses. We plan the right checkout or enquiry flow for your customers.",
    points: [
      "Product, service, or menu catalogue",
      "Cart and order-request flow",
      "Payment or WhatsApp handoff options",
      "Scope and features agreed up front",
    ],
  },
  "Progressive Web Apps (PWA)": {
    body: "Custom web tools and installable mobile-first experiences, scoped to your workflow. We’ll first discuss the idea and recommend a practical approach.",
    points: [
      "Interactive tools and dashboards",
      "Installable progressive web apps",
      "Features planned around your workflow",
      "Written scope and quote before build",
    ],
  },
};

let lastFocusBeforeModal: HTMLElement | null = null;

function setTheme(theme: "light" | "dark"): void {
  const root = document.documentElement;
  const toggle = qs<HTMLButtonElement>("#themeToggle");
  const icon = qs<HTMLElement>(".theme-icon", toggle ?? document);
  root.dataset.theme = theme;
  if (icon) icon.textContent = theme === "dark" ? "☀" : "◐";
  toggle?.setAttribute("aria-pressed", String(theme === "dark"));
  toggle?.setAttribute("aria-label", theme === "dark" ? "Use light theme" : "Use black theme");
  toggle?.setAttribute("title", theme === "dark" ? "Use light theme" : "Use black theme");
}

function initThemeToggle(): void {
  const toggle = qs<HTMLButtonElement>("#themeToggle");
  if (!toggle) return;

  let storedTheme: string | null = null;
  try {
    storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    storedTheme = null;
  }
  setTheme(storedTheme === "dark" ? "dark" : "light");
  toggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // Theme still applies when storage is unavailable.
    }
  });
}

function qs<T extends Element = Element>(selector: string, root: ParentNode = document): T | null {
  return root.querySelector<T>(selector);
}

function qsa<T extends Element = Element>(selector: string, root: ParentNode = document): T[] {
  return Array.from(root.querySelectorAll<T>(selector));
}

function toggleMenu(): void {
  const nav = qs<HTMLElement>("#navLinks");
  const button = qs<HTMLButtonElement>("#menuBtn");
  if (!nav || !button) return;

  const isOpen = nav.classList.toggle("show");
  button.setAttribute("aria-expanded", String(isOpen));
  button.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  button.textContent = isOpen ? "×" : "☰";
}

function closeMenu(): void {
  const nav = qs<HTMLElement>("#navLinks");
  const button = qs<HTMLButtonElement>("#menuBtn");
  nav?.classList.remove("show");
  button?.setAttribute("aria-expanded", "false");
  button?.setAttribute("aria-label", "Open menu");
  if (button) button.textContent = "☰";
}

function showService(service: string): void {
  const modal = qs<HTMLElement>("#serviceModal");
  if (!modal) return;

  const detail = serviceDetails[service];
  const title = qs<HTMLElement>("#modalTitle", modal);
  const body = qs<HTMLElement>("#modalBody", modal);
  const list = qs<HTMLUListElement>("#modalList", modal);
  if (title) title.textContent = service;
  if (body) {
    body.textContent = detail?.body ?? "Tell us what you have in mind and we’ll scope the right solution together.";
  }
  if (list) {
    list.replaceChildren();
    for (const point of detail?.points ?? []) {
      const item = document.createElement("li");
      item.textContent = point;
      list.appendChild(item);
    }
  }

  lastFocusBeforeModal = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  modal.hidden = false;
  document.body.classList.add("modal-open");
  qs<HTMLButtonElement>(".close", modal)?.focus();
}

function closeModal(): void {
  const modal = qs<HTMLElement>("#serviceModal");
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  document.body.classList.remove("modal-open");
  lastFocusBeforeModal?.focus();
}

function submitForm(event: SubmitEvent): void {
  event.preventDefault();
  const form = event.currentTarget;
  if (!(form instanceof HTMLFormElement)) return;

  const name = qs<HTMLInputElement>("#name")?.value.trim() ?? "";
  const contact = qs<HTMLInputElement>("#email")?.value.trim() ?? "";
  const message = qs<HTMLTextAreaElement>("#message")?.value.trim() ?? "";
  const status = qs<HTMLElement>("#formStatus");

  if (!name || !contact || !message) {
    if (status) status.textContent = "Please add your name, contact details, and a short project description.";
    form.reportValidity();
    return;
  }

  const enquiry = [
    "Hi Tushar, I’d like to discuss a website project.",
    "",
    `Name: ${name}`,
    `Contact: ${contact}`,
    "Project details:",
    message,
  ].join("\n");
  const url = `${WHATSAPP_BASE}?text=${encodeURIComponent(enquiry)}`;
  const opened = window.open(url, "_blank", "noopener,noreferrer");
  if (status) {
    status.textContent = opened
      ? "WhatsApp opened with your project enquiry ready to send."
      : "If WhatsApp did not open, use the WhatsApp link beside this form.";
  }
}

function initProjectFilters(): void {
  const buttons = qsa<HTMLButtonElement>("[data-project-filter]");
  const cards = qsa<HTMLElement>(".project-card[data-category]");
  const count = qs<HTMLElement>("#projectCount");
  if (!buttons.length || !cards.length) return;

  for (const button of buttons) {
    button.addEventListener("click", () => {
      const filter = button.dataset.projectFilter ?? "all";
      let visibleCount = 0;

      for (const candidate of buttons) {
        const selected = candidate === button;
        candidate.classList.toggle("is-active", selected);
        candidate.setAttribute("aria-pressed", String(selected));
      }

      cards.forEach((card, index) => {
        const categories = (card.dataset.category ?? "").split(/\s+/);
        const matches = filter === "all" || categories.includes(filter);
        card.hidden = !matches;
        card.classList.remove("filter-enter");

        if (matches) {
          visibleCount += 1;
          card.classList.add("is-visible");
          card.style.setProperty("--enter-delay", `${Math.min(index * 35, 245)}ms`);
          void card.offsetWidth;
          card.classList.add("filter-enter");
        }
      });

      if (count) {
        count.textContent = filter === "all"
          ? `Showing all ${visibleCount} projects`
          : `Showing ${visibleCount} ${button.textContent?.trim().replace(/\s+\d+$/, "") ?? "matching"} projects`;
      }
    });
  }
}

function initReveal(): void {
  const elements = qsa<HTMLElement>(".reveal-up");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!elements.length) return;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

  elements.forEach((element) => observer.observe(element));
}

function initScrollEffects(): void {
  const progress = qs<HTMLElement>("#scrollProgress");
  const sections = qsa<HTMLElement>("main section[id]");
  const links = qsa<HTMLAnchorElement>(".nav-links a[href^='#']");
  let framePending = false;

  const update = (): void => {
    framePending = false;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const fraction = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    if (progress) progress.style.transform = `scaleX(${fraction})`;

    let current = sections[0]?.id ?? "";
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= 160) current = section.id;
    }
    for (const link of links) {
      const active = link.getAttribute("href") === `#${current}`;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
  };

  const scheduleUpdate = (): void => {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(update);
  };

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  update();
}

function initHeroParallax(): void {
  const hero = qs<HTMLElement>(".hero");
  const browserCard = qs<HTMLElement>(".browser-card", hero ?? document);
  const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!hero || !hasFinePointer || reduceMotion) return;

  hero.addEventListener("pointermove", (event) => {
    const bounds = hero.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    hero.style.setProperty("--pointer-x", `${x * 100}%`);
    hero.style.setProperty("--pointer-y", `${y * 100}%`);
    browserCard?.style.setProperty("--hero-tilt-x", `${((x - 0.5) * 8).toFixed(2)}deg`);
    browserCard?.style.setProperty("--hero-tilt-y", `${((0.5 - y) * 7).toFixed(2)}deg`);
  });
  hero.addEventListener("pointerleave", () => {
    hero.style.removeProperty("--pointer-x");
    hero.style.removeProperty("--pointer-y");
    browserCard?.style.removeProperty("--hero-tilt-x");
    browserCard?.style.removeProperty("--hero-tilt-y");
  });
}

function initProjectTilt(): void {
  const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!hasFinePointer || reduceMotion) return;

  qsa<HTMLElement>(".project-card, .service-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse") return;
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      card.style.setProperty("--tilt-x", `${(x * 7).toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${(y * -7).toFixed(2)}deg`);
      card.style.setProperty("--art-x", `${(x * -9).toFixed(2)}px`);
      card.style.setProperty("--art-y", `${(y * -7).toFixed(2)}px`);
      card.style.setProperty("--shine-x", `${((x + 0.5) * 100).toFixed(1)}%`);
      card.style.setProperty("--shine-y", `${((y + 0.5) * 100).toFixed(1)}%`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.removeProperty("--tilt-x");
      card.style.removeProperty("--tilt-y");
      card.style.removeProperty("--art-x");
      card.style.removeProperty("--art-y");
      card.style.removeProperty("--shine-x");
      card.style.removeProperty("--shine-y");
    });
  });
}

function initDepthInteractions(): void {
  const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!hasFinePointer || reduceMotion) return;

  qsa<HTMLElement>(".button-primary, .contact-direct, .about-photo").forEach((element) => {
    element.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse") return;
      const bounds = element.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      element.style.setProperty("--depth-rotate-x", `${(y * -5).toFixed(2)}deg`);
      element.style.setProperty("--depth-rotate-y", `${(x * 5).toFixed(2)}deg`);
      element.style.setProperty("--depth-shine-x", `${((x + 0.5) * 100).toFixed(1)}%`);
      element.style.setProperty("--depth-shine-y", `${((y + 0.5) * 100).toFixed(1)}%`);
    });
    element.addEventListener("pointerleave", () => {
      element.style.removeProperty("--depth-rotate-x");
      element.style.removeProperty("--depth-rotate-y");
      element.style.removeProperty("--depth-shine-x");
      element.style.removeProperty("--depth-shine-y");
    });
  });
}

function bind(): void {
  initThemeToggle();
  qs<HTMLButtonElement>("#menuBtn")?.addEventListener("click", toggleMenu);
  qsa<HTMLAnchorElement>(".nav-links a").forEach((link) => link.addEventListener("click", closeMenu));
  qs<HTMLFormElement>("#quoteForm")?.addEventListener("submit", submitForm);

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const serviceButton = target.closest<HTMLElement>("[data-service]");
    if (serviceButton?.dataset.service) {
      showService(serviceButton.dataset.service);
      return;
    }
    if (target.closest(".close")) {
      closeModal();
      return;
    }
    const modal = qs<HTMLElement>("#serviceModal");
    if (modal && target === modal) closeModal();

    const formLink = target.closest<HTMLAnchorElement>(".modal-form-link");
    if (formLink) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    const modal = qs<HTMLElement>("#serviceModal");
    if (event.key === "Escape") {
      closeModal();
      closeMenu();
      return;
    }
    if (!modal || modal.hidden) return;
    if (event.key !== "Tab") return;

    const focusable = qsa<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])', modal)
      .filter((element) => element.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) closeMenu();
  });

  initProjectFilters();
  initReveal();
  initScrollEffects();
  initHeroParallax();
  initProjectTilt();
  initDepthInteractions();

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", () => {
      void navigator.serviceWorker.register("./sw.js").catch(() => undefined);
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bind, { once: true });
} else {
  bind();
}