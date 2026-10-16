# devblog

A minimal blog built with Eleventy.

- `npm install` once, then `npm start` to preview at http://localhost:8080
- Add a post: create `posts/<slug>.md` with `title`, `date` and optional `summary` front matter
- Deploy: push to `main` on GitHub with Pages set to "GitHub Actions" (Settings, Pages)

If the repo is named `<username>.github.io`, or you use a custom domain, remove the `PATH_PREFIX` line from `.github/workflows/deploy.yml`.
