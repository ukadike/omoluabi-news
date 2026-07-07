# Deployment

## How it ships

`.github/workflows/deploy.yml` runs on every push to `main`:

1. Checks out the repo.
2. `actions/configure-pages` + `actions/upload-pages-artifact` (uploads
   the repo root as-is — no Jekyll build; see `docs/ARCHITECTURE.md` for
   why).
3. `actions/deploy-pages` publishes it.

## One-time repo setup (manual, not automatable from here)

1. Repo → **Settings → Pages**.
2. **Source: GitHub Actions** (not "Deploy from a branch" — this build
   doesn't use a `gh-pages` branch).
3. HTTPS is on by default for `github.io` domains.
4. Custom domain (optional): add a `CNAME` file at the repo root and set it
   in the same Settings → Pages screen.

Once that's set, every push to `main` redeploys automatically. Live URL:
`https://ukadike.github.io/omoluabi-news/`.

## Before merging to main

Run locally first:

```bash
python3 -m http.server 8000
# open http://localhost:8000/index.html
```

Click through the homepage, the feed, and the one story. Check the browser
console is empty. Then run what CI runs:

```bash
npx html-validate 'index.html' 'news/index.html' 'news/**/index.html'
npx stylelint --config .stylelintrc.json '_css/**/*.css'
for f in _data/*.json; do python3 -m json.tool "$f" > /dev/null; done
```

## Adding a story

See `docs/CONTRIBUTING.md`.
