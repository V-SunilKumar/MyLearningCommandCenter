# DBA & Cloud Learning Command Center

A public GitHub Pages learning workspace for databases, cloud platforms, operating systems, automation, containers and DevOps.

## Dashboard preview — Phase 1

This first build reproduces the approved dashboard layout and adds initial browser-side interactions:

- Responsive dark dashboard with the reference mountain banner and sidebar treatment.
- Profile photograph stored locally in `assets/images/profile/sunil.png`.
- Technology cards for Oracle, PostgreSQL, MySQL, SQL Server, MongoDB, AWS, Azure, Google Cloud, OCI, Docker, Kubernetes, Linux, Shell, PowerShell, Python, Git, Terraform, Ansible and Jenkins.
- Vendor logo presentation refined in V1.1: the supplied brand-colour SVG marks are stored locally for PostgreSQL, MySQL, MongoDB, Docker, Kubernetes, Linux, Python, Git, Terraform, Ansible and Jenkins, with matching wordmark labels where the supplied artwork is a symbol-only mark. Google Cloud uses a multicolour SVG from the theSVG CDN. Oracle, SQL Server, AWS, Azure, OCI, Shell and PowerShell still use CDN-served brand marks pending final local asset verification. See `LOGO-SOURCES.md`.
- Cards navigate directly to a technology roadmap placeholder.
- Dashboard demo progress can be edited under Progress and is saved in browser localStorage.
- Theme toggle, profile menu, navigation, search and JSON export are included.

## Vendor logo status

The dashboard uses actual technology brand marks, not AI-generated approximations. Local SVGs supplied by the user are preserved unchanged. Some remaining logos still load from a CDN and require internet access; before final public release, we should complete the locally packaged official-logo set and verify each brand asset against its current brand guidance.

## Run locally

Double-click `start-dashboard.bat` on Windows. It starts the included Node.js static server and opens `http://localhost:8765`. Node.js is required. Alternatively, open `index.html` directly in a modern browser.

## Publish with GitHub Pages

1. Create a public GitHub repository.
2. Upload the complete contents of this folder to the repository root.
3. In repository Settings → Pages, choose Deploy from a branch, select `main` and `/ (root)`, then Save.

## Important scope notes

This is the first dashboard build, not the finished learning platform. Roadmap pages are intentionally placeholders until the technology-specific curricula are designed and approved. Browser localStorage is device/browser-specific and is not cross-device synchronization. Do not store passwords, secrets or private personal records in this public repository.


## V1.3 update
- Removed the old banner image that contained baked-in duplicate title and quotation text.
- Added a clean, text-free panoramic mountain banner. The title, slogan and quotation are now rendered once as HTML text.
- Added a desktop viewport-fit layout so the dashboard, cards and footer fit on one screen at typical desktop resolutions (including 1886×916). Smaller screens retain responsive scrolling.


## Version 1.4 — Owner-supplied SVG logo integration

This release integrates eight supplied SVG logos as local files: Oracle, MySQL, Microsoft SQL Server, AWS, Azure, Oracle Cloud, PowerShell and Python. These cards no longer depend on a logo CDN. See `LOGO-SOURCES.md` for the asset map and presentation notes.


## V1.5 logo refinement

- Uses the eight owner-supplied SVG logo assets as local project files.
- Removes duplicate text wordmarks beneath/in addition to the SVG artwork.
- Keeps logo backgrounds transparent so the approved dark navy theme remains unchanged.
- Normalizes logo display sizing and alignment across cards.
- Uses local Google Cloud SVG rather than a remote logo URL.
- Starts on `http://localhost:8770` to avoid colliding with earlier dashboard versions.
- Keeps the dashboard's existing screen-fit layout and profile/background assets.
