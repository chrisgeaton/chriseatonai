# chriseatonai.com

My personal site, hand-built in plain HTML and CSS. No framework, no build step. Home to my writing, project case studies, and a set of free AI-personalized PM course builders.

**Live:** [chriseatonai.com](https://chriseatonai.com)

## Stack

- Static HTML and CSS (IBM Plex type, no framework, no bundler)
- Cloudflare Pages Functions for the course-generator API (`functions/api/`)
- Umami for privacy-friendly analytics
- RSS feed and sitemap maintained alongside each article

## Structure

- `index.html`: home (writing, projects, links)
- `writing/`: articles
- `courses.html` and `pm-*.html`: the PM curriculum builders
- `functions/api/generate.js`: serverless endpoint for course generation
- `feed.xml`, `sitemap.xml`: syndication and SEO

Built by hand. No templates were harmed.
