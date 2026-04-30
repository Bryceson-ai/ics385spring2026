# Copilot instructions for this repository

Purpose: Help AI coding agents be immediately productive editing this small static-site homework repo.

Quick overview
- Project type: static HTML/CSS pages under the [week2/hw2](week2/hw2) folder. The main files of interest are [week2/hw2/bio.html](week2/hw2/bio.html) and [week2/hw2/styles.css](week2/hw2/styles.css).
- No build system, no backend services. Editing is typically small, layout-and-style changes.

Key patterns and why
- Single-page layout sections: `.top-container`, `.middle-container`, `.bottom-container` are used to separate page areas — prefer editing these classes to adjust section spacing or backgrounds.
- Responsive/layout choices: widths are expressed in percentages (e.g. `.skill-row { width: 50%; }`) and a centered single-column design is used (`margin: auto`). Preserve percent-based sizing when changing layout to keep the page responsive.
- Component classes: image variants like `.code-img`, `.chilli-img` and utility classes like `.btn` implement visual details (floats, gradients, vendor prefixes). If adjusting images, check both the HTML and CSS to maintain float/margin interplay.
- Grid usage: `.parent` uses `display: grid` with `grid-template-columns: 0.5fr 1fr`. When adding content into `.parent`, follow this two-column fractional layout instead of adding manual floats.

Editing examples (from this repo)
- To change the main heading size, edit the `h1` rule in [week2/hw2/styles.css](week2/hw2/styles.css).
- To add a new call-to-action button matching site styling, add `<a class="btn" href="#">Label</a>` inside the desired section — the `.btn` CSS already provides gradient and hover states.
- To preview local changes quickly, run a lightweight local server from the [week2/hw2](week2/hw2) folder.

Preview / developer workflow
- Quick preview using Python (Windows):
```bash
cd week2/hw2
python -m http.server 8000
# then open http://localhost:8000/bio.html
```
- VS Code: Recommend using the Live Server extension (Open with Live Server) for instant reloads.

Conventions and small rules
- Keep class names as-is when possible; they are referenced directly in [week2/hw2/bio.html](week2/hw2/bio.html) and altering them requires HTML updates.
- Fonts: styles rely on Google fonts (`Merriweather`, `Montserrat`, `Sacramento`). If you remove or rename a font, also update the HTML head where those fonts are imported.
- Avoid removing vendor-prefixed gradient rules in `.btn` to maintain older browser behavior in classwork contexts.

Integration points / external deps
- None runtime-critical. The only external resources are font imports (Google Fonts) and image files referenced from [week2/hw2/bio.html](week2/hw2/bio.html).

Testing and linting
- There are no automated tests configured. For CSS checks, use a style linter locally if desired, but not required for simple edits.

PR guidance
- Small, focused PRs are preferred for this repo (one layout or styling change per PR).
- Include screenshots of the before/after where visual changes are involved.

If anything above is unclear or you want instructions expanded (e.g., adding a basic dev server script, adding an image folder, or adding tests/linting), tell me which part to expand.
