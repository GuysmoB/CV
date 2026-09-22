# Remi Brauge CV

A static HTML/CSS reproduction of the original multi-page Word CV, with automated PDF generation via Puppeteer.

## Features

- **Word-to-HTML Conversion**: Recreates the original three-page visual layout in HTML
- **Multi-Page PDF Export**: Generates an A4 PDF that respects CSS page breaks
- **Image Support**: Copies static assets so the profile picture renders in both HTML and PDF output
- **Automated Build**: Gulp minifies HTML/CSS, copies assets, and Puppeteer exports the PDF

## Quick Start

```bash
npm install
npm run build
```

## Commands

| Command              | Description                                                 |
| -------------------- | ----------------------------------------------------------- |
| `npm run gulp-clean` | Delete minified files from dist folder                      |
| `npm run gulp-page`  | Minify HTML and output to dist                              |
| `npm run gulp-style` | Minify CSS and output to dist                               |
| `npm run gulp-asset` | Copy assets into dist                                       |
| `npm run pdf`        | Generate PDF from minified HTML                             |
| `npm run build`      | Run complete build pipeline (clean → minify → generate PDF) |

## Customization

1. Edit `index.html` to update content
2. Modify `style.css` to adjust the layout and page styling
3. Run `npm run build` to regenerate the HTML bundle and PDF

## Output

- **Minified files**: `dist/index.html`, `dist/style.css`, and `dist/asset/*`
- **PDF output**: `remi-brauge-cv.pdf`

## How It Works

The PDF generator uses Puppeteer to:

1. Launch a headless browser
2. Load the minified HTML from `dist`
3. Apply print CSS with fixed A4 pages
4. Export a multi-page PDF with background colors and images intact

## Tech Stack

- HTML5 & CSS3
- Gulp for build automation
- Puppeteer for dynamic PDF generation
- Express for local server during PDF generation
