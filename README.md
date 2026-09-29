# Hagar Arafa — Junior Data Engineer Portfolio

A production-ready static portfolio built with plain HTML, CSS, and JavaScript.

## Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Google Fonts
- No framework
- No build step
- No external JavaScript dependencies

## Structure

```text
hagar-arafa-portfolio/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    ├── photo.jpg
    ├── cv.pdf
    ├── favicon.svg
    └── project-placeholder.svg
```

## GitHub Pages deployment

1. Create a GitHub repository, for example:
   `hagar-arafa-portfolio`
2. Upload all files and folders in this project.
3. Open the repository on GitHub.
4. Go to **Settings → Pages**.
5. Under **Build and deployment**, choose:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/ (root)**
6. Save.
7. GitHub will provide the published Pages URL.

Because this site has no build step, GitHub Pages can serve `index.html` directly.

## Before publishing

Replace these placeholders:

- LinkedIn URL in `index.html`
- GitHub profile URL in `index.html`
- `projects[0].links.github` in `script.js`
- `projects[0].links.project` in `script.js`
- `assets/project-placeholder.svg` with a real project screenshot if available

The CV and portrait are already wired to:

- `assets/cv.pdf`
- `assets/photo.jpg`

## Adding another project

Open `script.js` and add another object to the `projects` array.

Each project supports:

- year
- category
- title
- summary
- problem
- approach
- tools
- challenges
- result
- output
- links
- screenshot
- code
- inline pipeline SVG

No HTML project-card duplication is required.

## Final QA

Before publishing:

- Check the page at 360px width.
- Check the page at 768px width.
- Check the page at 1440px width.
- Replace all placeholder links.
- Test the CV download.
- Test email.
- Test GitHub and LinkedIn.
- Test light/dark mode.
- Test keyboard navigation.
- Run Lighthouse and check Accessibility, Performance, Best Practices, and SEO.
- Confirm there are no console errors.
