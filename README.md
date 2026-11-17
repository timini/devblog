# Tim's Software Factory

Source for [timini.github.io/devblog](https://timini.github.io/devblog/), built with Eleventy.

- `npm install` once, then `npm start` to preview at http://localhost:8080
- Add a post: create `posts/<slug>.md` with `title`, `date`, `kind`, `status` and optional `summary` front matter
- Deploy: push to `main` on GitHub with Pages set to "GitHub Actions" (Settings -> Pages)

If the repo is named `<username>.github.io`, or you use a custom domain, remove the `PATH_PREFIX` line from `.github/workflows/deploy.yml`.
