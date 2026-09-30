/* Hagar Arafa Portfolio — vanilla JS only. */

(() => {
  "use strict";

  const root = document.documentElement;
  const body = document.body;
  const topbar = document.getElementById("topbar");
  const themeToggle = document.getElementById("themeToggle");
  const projectList = document.getElementById("projectList");
  const projectCount = document.getElementById("projectCount");
  const progress = document.querySelector(".scroll-progress span");
  const spotlight = document.querySelector(".cursor-spotlight");
  const typedWord = document.getElementById("typedWord");
  const navLinks = [...document.querySelectorAll('.nav-row a[href^="#"]')];

  const projects = [
    {
      number: "01",
      year: "2026",
      category: "PYTHON · SELENIUM · PANDAS",
      title: "Naukrigulf",
      subtitle: "Data Engineer Job Scraper",
      description: "A Selenium-based scraper built to collect Data Engineer job listings from the first three Naukrigulf result pages, open individual listings, extract the full job description, and produce a structured CSV dataset.",
      problem: "Collect job-market records from the first three result pages and preserve the listing details in a structured dataset.",
      approach: "Search for Data Engineer listings, collect the first three result pages, open each listing, extract the full description, assemble the records, and export the final dataset as CSV.",
      tools: ["Python", "Selenium", "Pandas", "undetected-chromedriver"],
      challenges: "Handling dynamic pages, pagination, individual listing navigation, and keeping the extracted records consistent while the browser moves between result pages and job pages.",
      result: "The resulting CSV provides a structured dataset that can be inspected, filtered, and used as a starting point for further data processing or analysis.",
      stats: [
        ["90", "job listings"],
        ["03", "result pages"],
        ["06", "structured fields"]
      ],
      fields: ["job title", "company", "location", "experience", "job URL", "description"],
      output: "naukrigulf_data_engineer.csv",
      github: "https://github.com/hegererefe111-debug/naukrigulf-data-engineer-scraper",
      screenshot: "",
      code: `jobs = driver.find_elements(\n    "css selector",\n    "div.ng-box.srp-tuple"\n)\n\nfor job in jobs:\n    title = job.find_element(\n        "css selector", "p.designation-title"\n    ).text\n    # extract fields, open listing,\n    # then collect the full description`
    }
  ];

  function renderProjects() {
    if (!projectList) return;

    projectList.innerHTML = projects.map((project) => {
      const screenshotMarkup = project.screenshot?.trim()
        ? `
          <section class="project-detail">
            <h4>SCREENSHOT</h4>
            <div class="project-screenshot"><div><strong>PROJECT VISUAL</strong><span>${project.screenshot}</span></div></div>
          </section>`
        : "";

      return `
        <article class="project-card project-tilt reveal-child">
          <div class="project-top">
            <span>${project.category}</span>
            <span>${project.year}</span>
          </div>

          <div class="project-main">
            <div class="project-title">
              <span class="project-number">${project.number}</span>
              <h3>${project.title}<br><em>${project.subtitle}</em></h3>
            </div>
            <div class="project-description">
              <p>${project.description}</p>
              <div class="project-links">
                <a class="project-button primary magnetic" href="${project.github}" target="_blank" rel="noopener noreferrer">GitHub repository <span aria-hidden="true">↗</span></a>
              </div>
            </div>
          </div>

          <div class="project-grid" aria-label="Project summary">
            ${project.stats.map(([value, label]) => `<div class="project-stat"><strong>${value}</strong><span>${label}</span></div>`).join("")}
          </div>

          <div class="project-details">
            <section class="project-detail"><h4>PROBLEM</h4><p>${project.problem}</p></section>
            <section class="project-detail"><h4>APPROACH</h4><p>${project.approach}</p></section>
            <section class="project-detail"><h4>TOOLS</h4><div class="project-tools">${project.tools.map((tool) => `<span class="project-tag magnetic">${tool}</span>`).join("")}</div></section>
            <section class="project-detail"><h4>CHALLENGES</h4><p>${project.challenges}</p></section>
            <section class="project-detail"><h4>RESULT</h4><p>${project.result}</p></section>
            <section class="project-detail"><h4>FIELDS</h4><div class="project-tools">${project.fields.map((field) => `<span class="project-tag">${field}</span>`).join("")}</div></section>
            ${screenshotMarkup}
            <section class="project-detail">
              <h4>CODE</h4>
              <pre class="project-code"><code>${escapeHtml(project.code)}</code></pre>
            </section>
          </div>

          <div class="project-output">
            <span>OUTPUT</span>
            <strong>${project.output}</strong>
            <a href="${project.github}" target="_blank" rel="noopener noreferrer">VIEW PROJECT ↗</a>
          </div>
        </article>
      `;
    }).join("");

    if (projectCount) {
      projectCount.textContent = `${String(projects.length).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}`;
    }
  }

  function escapeHtml(value) {
    return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function loadTheme() {
    const saved = localStorage.getItem("hagar-theme");
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    const theme = saved || (prefersLight ? "light" : "dark");
    root.dataset.theme = theme;
    updateThemeButton(theme);
  }

  function updateThemeButton(theme) {
    if (!themeToggle) return;
    const light = theme === "light";
    themeToggle.setAttribute("aria-pressed", String(light));
    themeToggle.setAttribute("aria-label", light ? "Switch to dark mode" : "Switch to light mode");
    const label = themeToggle.querySelector(".theme-label");
    const icon = themeToggle.querySelector(".theme-icon");
    if (label) label.textContent = light ? "Dark" : "Light";
    if (icon) icon.textContent = light ? "☼" : "◐";
  }

  function setupTheme() {
    if (!themeToggle) return;
    themeToggle.addEventListener("click", () => {
      const next = root.dataset.theme === "light" ? "dark" : "light";
      root.dataset.theme = next;
      localStorage.setItem("hagar-theme", next);
      updateThemeButton(next);
    });
  }

  function setupIntro() {
    requestAnimationFrame(() => body.classList.add("loaded"));
  }

  function setupReveal() {
    const sections = document.querySelectorAll(".reveal-section");
    if (!("IntersectionObserver" in window)) {
      sections.forEach((section) => section.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -7% 0px" });

    sections.forEach((section) => observer.observe(section));
  }

  function setupProgress() {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const value = max > 0 ? window.scrollY / max : 0;
      if (progress) progress.style.transform = `scaleX(${Math.min(1, Math.max(0, value))})`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
  }

  function setupHeader() {
    if (!topbar) return;

    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastY;

      if (currentY <= 10) {
        topbar.classList.remove("nav-hidden");
      } else if (delta > 4 && currentY > 90) {
        topbar.classList.add("nav-hidden");
      } else if (delta < -4) {
        topbar.classList.remove("nav-hidden");
      }

      lastY = currentY;
      ticking = false;
    };

    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
  }

  function setupActiveNav() {
    const sections = navLinks
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
      });
    }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });

    sections.forEach((section) => observer.observe(section));
  }

  function setupTyping() {
    if (!typedWord) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const words = ["Python", "SQL", "Data Pipelines", "Clean Data"];
    if (reduced) {
      typedWord.textContent = words[0];
      return;
    }

    let index = 0;
    let deleting = false;
    let position = words[index].length;

    const tick = () => {
      const target = words[index];
      if (!deleting) {
        position += 1;
        typedWord.textContent = target.slice(0, position);
        if (position === target.length) {
          deleting = true;
          setTimeout(tick, 1050);
          return;
        }
      } else {
        position -= 1;
        typedWord.textContent = target.slice(0, position);
        if (position === 0) {
          deleting = false;
          index = (index + 1) % words.length;
          position = 0;
        }
      }
      setTimeout(tick, deleting ? 38 : 70);
    };

    typedWord.textContent = words[index];
    setTimeout(tick, 1150);
  }

  function setupImageFallback() {
    document.querySelectorAll(".image-fallback img").forEach((img) => {
      img.addEventListener("error", () => img.closest(".image-fallback")?.classList.add("is-broken"), { once: true });
    });
  }

  function setupPipelineMotion() {
    const visual = document.querySelector(".pipeline-visual");
    if (!visual) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const update = () => {
      visual.style.setProperty("--packet-travel-x", `${visual.clientWidth * 0.815}px`);
      visual.style.setProperty("--packet-travel-y", `${visual.clientHeight * 0.825}px`);
    };

    update();
    window.addEventListener("resize", update, { passive: true });
  }

  function setupSpotlight() {
    if (!spotlight || !window.matchMedia("(pointer: fine)").matches) return;
    window.addEventListener("pointermove", (event) => {
      spotlight.style.left = `${event.clientX}px`;
      spotlight.style.top = `${event.clientY}px`;
      spotlight.style.opacity = "1";
    }, { passive: true });
    document.addEventListener("mouseleave", () => { spotlight.style.opacity = "0"; });
  }

  function setupTilt() {
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.querySelectorAll(".project-tilt").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(1100px) rotateX(${(-y * 2.4).toFixed(2)}deg) rotateY(${(x * 2.8).toFixed(2)}deg)`;
      });
      card.addEventListener("pointerleave", () => { card.style.transform = "perspective(1100px) rotateX(0) rotateY(0)"; });
    });
  }

  function setupMagnetic() {
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.querySelectorAll(".magnetic").forEach((element) => {
      element.addEventListener("pointermove", (event) => {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        element.style.transform = `translate(${(x * 0.1).toFixed(2)}px, ${(y * 0.1).toFixed(2)}px)`;
      });
      element.addEventListener("pointerleave", () => { element.style.transform = "translate(0, 0)"; });
    });
  }

  renderProjects();
  loadTheme();
  setupTheme();
  setupIntro();
  setupReveal();
  setupProgress();
  setupHeader();
  setupActiveNav();
  setupTyping();
  setupImageFallback();
  setupPipelineMotion();
  setupSpotlight();
  setupTilt();
  setupMagnetic();
})();
