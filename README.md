# Hagar Arafa, Portfolio

A static site: HTML, CSS and plain JavaScript. No build step, no frameworks.

## Upload and deploy
1. Replace the contents of your GitHub repository with this folder (keep `index.html` at the root).
2. Keep your own photo at `assets/hager-arafa.jpg`. It is not included here, so copy it from your current repository.
3. Vercel: import the repository, framework preset "Other", no build command, output directory `.`
4. If your site address or GitHub username changes, search `index.html` for `hager-arafa-portfolio.vercel.app` and `hegererefe111-debug` and update them.

## Files, in plain words
- `index.html` is the content and structure. Each `<section>` is one part of the page (hero, about, work, toolbox, path, contact). The `<svg>` block at the top holds your logo (the H and A joined by sine waves) and two arrows, reused across the page.
- `style.css` is the look. It starts with colour and size variables (the "tokens"), so changing a colour in one place changes it everywhere. The dark sections (toolbox is light; contact and footer are dark) simply redefine those same variables.
- `script.js` is the behaviour:
  - `initField` draws the moving contour map behind the hero and contact. It builds a height field from a few sine waves, then traces lines at fixed heights. It pauses when off-screen and shows one still frame if the visitor prefers reduced motion.
  - `initRows` makes project rows open and close, one at a time.
  - `initChrome` runs the menu, the left section ruler, the header shadow and the timeline progress.
  - `initReveals` fades items in as they scroll into view.
  - `initCopy` copies your email on click.
  - `initPortrait` shows your initials if the photo file is missing.
- `assets/` holds the favicon, CV (`Hagar-Arafa-CV.pdf`), social preview (`og.png`) and the self-hosted fonts (Latin Modern and Inter), so nothing loads from Google.

## Add a project
In `index.html`, find the comment `TO ADD A PROJECT`. Copy one `<li class="row">` block, change the title, text and the three flow boxes (source, process, output), and save.

## Check before publishing
- The Shoreline role wording matches your CV.
- The Toolbox SQL line (CTEs, window functions, stored procedures, triggers, transactions) is something you are comfortable discussing. It came from your old site, not your CV.
