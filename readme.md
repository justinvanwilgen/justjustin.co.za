# justjustin.co.za

Static personal homepage for Justin van Wilgen, built with plain HTML, CSS, JavaScript, and a small shell-based production build pipeline.

The site is designed as a developer profile with sections for about, experience, personal projects, skills, and contact details. It uses local technology icons, a typewriter headline animation, dynamic experience durations, and simple scroll reveal behavior.

## Tech Stack

- HTML, CSS, and JavaScript
- jQuery for small DOM interactions
- Local SVG technology icons from `assets/icons/`
- `terser` for JavaScript minification
- `clean-css-cli` for CSS minification
- Playwright for browser smoke testing
- `lftp` deployment via FTP

## Project Structure

```text
.
├── assets/icons/          # Local SVG icons used by the skills and tag UI
├── css/                   # Source stylesheets
├── js/                    # Source scripts
├── tests/                 # Playwright browser smoke tests
├── build.sh               # Production build script
├── index.html             # Source HTML page
├── package.json           # Scripts and development dependencies
└── pnpm-lock.yaml         # Locked pnpm dependency versions
```

The generated production output is written to `dist/`.

## Getting Started

Install dependencies:

```bash
pnpm install
```

Build the production site:

```bash
pnpm run build
```

The build script:

- removes and recreates `dist/`
- copies static assets into `dist/assets/`
- minifies JavaScript and CSS
- adds short content hashes to generated asset filenames
- rewrites `index.html` to reference the hashed files
- changes the production base path from `/` to `/frontpage/`

## Local Development

For quick edits, open `index.html` directly in a browser or serve the repository root with any static file server.

Example:

```bash
python3 -m http.server 8080
```

Then visit:

```text
http://127.0.0.1:8080/
```

## Testing

Run the full test workflow:

```bash
pnpm test
```

This builds the site and then runs the Playwright smoke test against the generated `dist/` output.

Run only the browser smoke test, assuming `dist/` already exists:

```bash
pnpm run test:browser
```

The smoke test starts a temporary static server, loads `/frontpage/`, scrolls through the page, and checks for JavaScript errors, console errors, and missing resources.

## Deployment

Deployment is configured through the `deploy` script:

```bash
pnpm run deploy
```

The script expects FTP credentials in a local `.env` file:

```env
FTP_HOST=example.com
FTP_USER=username
FTP_PASSWORD=password
```

Deployment builds the site and mirrors the contents of `dist/` to the configured FTP host using `lftp`.

## Notes

- Source files live in `index.html`, `css/`, `js/`, and `assets/`.
- Do not edit generated files in `dist/`; they are replaced on every build.
- If a new technology tag needs an icon, add the SVG to `assets/icons/` and update the mapping in `js/tech-icons.js`.