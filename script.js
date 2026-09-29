/* =========================================================
   HAGAR ARAFA — PORTFOLIO INTERACTIONS
========================================================= */

const projects = [
  {
    year: "2026",
    category: "PYTHON · SELENIUM · PANDAS",
    title: "Naukrigulf Data Engineer Job Scraper",

    summary:
      "A Selenium-based scraper that collects Data Engineer job listings from the first three result pages, opens each listing, extracts the full description, and writes the result to CSV.",

    problem:
      "Collect structured job information from a live job-search website across multiple result pages.",

    approach:
      "Navigate the result pages, extract listing fields, open each job URL for the full description, then assemble the collected records into a Pandas DataFrame and CSV.",

    tools:
      "Python · Selenium · undetected-chromedriver · Pandas",

    challenges:
      "Working with dynamic pages, pagination, individual listing pages, and keeping extracted data structured while navigating between pages.",

    result:
      "90 listings collected from the first three result pages. The CSV contains job title, company, location, experience, job URL, and description.",

    output:
      "naukrigulf_data_engineer.csv",

    links: {
      github: "https://github.com/hegererefe111-debug/naukrigulf-data-engineer-scraper",
      project: "https://github.com/hegererefe111-debug/naukrigulf-data-engineer-scraper"
    },

    screenshot: "assets/project-placeholder.svg",

    code: `jobs_data = extract_job_data(jobs)

extract_descriptions(
    driver,
    jobs_data,
    all_jobs
)

df = pd.DataFrame(all_jobs)
df.to_csv(
    "naukrigulf_data_engineer.csv",
    index=False
)`,

    pipeline: `
      <svg viewBox="0 0 720 170" role="img" aria-label="Project pipeline: search, extract, open listings, transform, CSV">
        <defs>
          <style>
            .p-box{fill:#20231e;stroke:#9eaa92;stroke-width:1}
            .p-text{fill:#f5f2e9;font:500 12px "DM Mono",monospace;letter-spacing:.5px}
            .p-line{stroke:#9eaa92;stroke-width:1.4}
          </style>
        </defs>
        <rect class="p-box" x="12" y="58" width="118" height="52"/>
        <text class="p-text" x="71" y="88" text-anchor="middle">SEARCH</text>

        <line class="p-line" x1="130" y1="84" x2="174" y2="84"/>
        <polygon fill="#9eaa92" points="174,84 166,79 166,89"/>

        <rect class="p-box" x="176" y="58" width="118" height="52"/>
        <text class="p-text" x="235" y="88" text-anchor="middle">EXTRACT</text>

        <line class="p-line" x1="294" y1="84" x2="338" y2="84"/>
        <polygon fill="#9eaa92" points="338,84 330,79 330,89"/>

        <rect class="p-box" x="340" y="58" width="118" height="52"/>
        <text class="p-text" x="399" y="82" text-anchor="middle">OPEN</text>
        <text class="p-text" x="399" y="98" text-anchor="middle">LISTINGS</text>

        <line class="p-line" x1="458" y1="84" x2="502" y2="84"/>
        <polygon fill="#9eaa92" points="502,84 494,79 494,89"/>

        <rect class="p-box" x="504" y="58" width="92" height="52"/>
        <text class="p-text" x="550" y="88" text-anchor="middle">CLEAN</text>

        <line class="p-line" x1="596" y1="84" x2="640" y2="84"/>
        <polygon fill="#9eaa92" points="640,84 632,79 632,89"/>

        <rect class="p-box" x="642" y="58" width="66" height="52"/>
        <text class="p-text" x="675" y="88" text-anchor="middle">CSV</text>
      </svg>
    `
  }
];

const projectList = document.querySelector("#project-list");

function renderProjects(items) {
  if (!projectList) return;

  projectList.innerHTML = items.map((project) => `
    <article class="project-card reveal">
      <div class="project-top">
        <span>${project.category}</span>
        <span>${project.year}</span>
      </div>

      <div class="project-body">

        <div class="project-copy">
          <h3>${project.title}</h3>

          <p>${project.summary}</p>

          <div class="project-links">
            <a class="project-link primary"
               href="${project.links.github}"
               target="_blank"
               rel="noopener noreferrer">
              GitHub <span aria-hidden="true">↗</span>
            </a>

            <a class="project-link"
               href="${project.links.project}"
               target="_blank"
               rel="noopener noreferrer">
              View Project <span aria-hidden="true">↗</span>
            </a>
          </div>

          <pre class="code-block"><code>${escapeHtml(project.code)}</code></pre>
        </div>

        <div>
          <div class="project-visual">
            <img src="${project.screenshot}" alt="Screenshot placeholder for ${project.title}" loading="lazy">
          </div>

          <div class="project-pipeline">
            ${project.pipeline}
          </div>

          <div class="project-details">
            <div class="detail">
              <h4>Problem</h4>
              <p>${project.problem}</p>
            </div>

            <div class="detail">
              <h4>Approach</h4>
              <p>${project.approach}</p>
            </div>

            <div class="detail">
              <h4>Tools</h4>
              <p>${project.tools}</p>
            </div>

            <div class="detail">
              <h4>Challenges</h4>
              <p>${project.challenges}</p>
            </div>

            <div class="detail">
              <h4>Result</h4>
              <p>${project.result}</p>
            </div>

            <div class="detail">
              <h4>Output</h4>
              <p>${project.output}</p>
            </div>
          </div>
        </div>

      </div>

      <div class="project-foot">
        <span>PROJECT CASE STUDY</span>
        <span>PYTHON / SELENIUM / PANDAS</span>
      </div>
    </article>
  `).join("");

  observeReveals();
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* ---------- Theme ---------- */

const themeToggle = document.querySelector(".theme-toggle");
const themeLabel = document.querySelector(".theme-label");
const root = document.documentElement;

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("hagar-theme", theme);

  const dark = theme === "dark";

  themeToggle?.setAttribute(
    "aria-label",
    dark ? "Switch to light mode" : "Switch to dark mode"
  );

  themeToggle?.setAttribute(
    "aria-pressed",
    String(dark)
  );

  if (themeLabel) {
    themeLabel.textContent = dark ? "Dark" : "Light";
  }
}

const storedTheme = localStorage.getItem("hagar-theme");

if (storedTheme) {
  setTheme(storedTheme);
} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  setTheme("dark");
}

themeToggle?.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

/* ---------- Reveal on scroll ---------- */

let revealObserver;

function observeReveals() {
  const items = document.querySelectorAll(".reveal:not(.visible)");

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("visible"));
    return;
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px"
      }
    );
  }

  items.forEach((item) => revealObserver.observe(item));
}

renderProjects(projects);
observeReveals();
