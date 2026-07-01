# Repository Guidelines

## Project Structure

```
toast-blog/
├── index.html         # SPA entry (6 sections: Hero, Resume, Portfolio, Tutorials, Wiki, Roadmap)
├── main.js            # Core rendering, i18n, theme, scroll spy
├── style.css          # Global styles, CSS custom properties (light/dark)
├── admin.html         # Admin panel (inline JS in <script type="module">)
├── admin.js           # Admin helpers
├── doc.html           # Online docs (RuoYi-style)
├── data/              # ES modules: projects,tutorials,wiki,path; loader.js; i18n.js
├── public/            # Static assets served as-is
├── scripts/           # dev.sh,start.sh,stop.sh,auto-commit.sh
├── dist/              # Build output
├── doc/               # Design docs
├── DEVELOPMENT_PLAN.md
└── DEVELOPMENT_LOG.md
```

- `index.html` is the only Vite build entry. Other HTML files are copied to `dist/` via `scripts/postbuild.sh`.
- `data/loader.js` provides per-environment localStorage persistence with static file fallback.
- Admin logic lives **inline** in `admin.html`. `admin.js` is supplementary.

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server on port 5174, auto-clean port conflicts |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview build output |
| `bash scripts/start.sh` | Background persistent server |
| `bash scripts/stop.sh` | Stop background server |

## Coding Style

- **JS**: ES2020 modules, `const/let`, vanilla JS, no framework.
- **CSS**: BEM-like class names, custom properties for theming, 2-space indent.
- **Files**: `kebab-case.html`, `camelCase.js`.
- **Config keys**: `toast_blog_i18n_config_{env}`, `toast_blog_env_config_{env}` (env: dev/test/prod).
- **Backup**: create `.bak` before editing (e.g., `admin.html.bak`).

## Testing

Framework: Playwright. Run via `node -e` with inline scripts or in-app browser. Verify per-environment config isolation after changes. Screenshots captured as `test-*.png` at root.

## Commit Format

```
type: short description
```

Types: `feat`, `fix`, `chore`, `style`, `docs`, `refactor`. Imperative mood, lowercase. Optional scope: `fix(admin): saveConfig per-env`. Branch prefix: `codex/`.

## Security

Admin password hardcoded as `admin` (client-side only). Login session: 30min localStorage expiry. Per-environment data isolation via key prefix. Do not expose admin panel to the public internet.
