# radharamansethi.github.io

My personal portfolio and blog, live at **https://radharamansethi.github.io**.

It's hand-built with plain HTML, CSS and vanilla JavaScript. There's no framework and no build step, so GitHub Pages serves it as is.

## Features

- Animated aurora background, a cursor glow and spotlight hover effects on cards
- A typing headline and a terminal intro card that tilts as you move the mouse
- Light and dark themes that follow your system setting and remember your choice
- A command palette: press `Ctrl/⌘ + K` to jump anywhere
- A blog with tag filters, search, a table of contents, copy-code buttons and a reading progress bar
- An RSS feed, a sitemap, Open Graph previews and structured data for SEO
- Animations turn off when your system has "reduce motion" set
- A custom 404 page

## Structure

```
index.html              Home: hero, about, skills, projects, journey, latest posts, contact
blog/index.html         Blog listing with search and tag filters
blog/<slug>/index.html  Individual articles
assets/css/style.css    All styles (theme colours are CSS variables at the top)
assets/js/posts.js      Post metadata: the single source of truth for post cards
assets/js/main.js       Interactions (theme, palette, reveal, filters, ...)
assets/img/             Favicon and social preview image
feed.xml, sitemap.xml   RSS feed and sitemap
404.html                Not-found page
```

## Writing a new post

1. Copy an existing folder in `blog/`, rename it to your new slug and edit the article HTML.
2. Add an entry at the top of the list in `assets/js/posts.js`. It then appears on the home page, the blog listing, the "Keep reading" section and the command palette.
3. Add the post to `feed.xml` and `sitemap.xml`.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Contact

- Email: [rrsethi13112001@gmail.com](mailto:rrsethi13112001@gmail.com)
- LinkedIn: [Radharaman Sethi](https://www.linkedin.com/in/radharaman-sethi-53a3b1200/)
