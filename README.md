# dorm-sa-presentation-ga-1

Spider-Man Brand New Day themed General Assembly 1 (GA1) presentation deck and Plan of Activities for [NAME] Residence Hall.

## Features

- **Spider-Man Brand New Day Theme**: Red gradient halftone overlays, spider web graphics, comic callout cards, and meme panels.
- **Interactive HTML Presentation**: Built with pure HTML5, CSS3, and JavaScript (zero build step).
- **Mobile & Messenger Webview Responsive**: Built using `100dvh` units, fluid font scaling (`clamp()`), touch swipe gestures, and scrollable card containers.
- **Web Audio Sound Effects & BGM**: Built-in sound effects (web shooter swoosh, cheer, bell) and superhero background music synthesis loop.
- **QoL Features**:
  - Quick Slide Index Drawer (press `M` or click top `INDEX` button).
  - GA1 Date Voting Poll Modal.
  - Hero Icebreaker Game modal with YouTube launcher and soundboard.
  - Keyboard Navigation Help modal (`?`).
- **PowerPoint Deck Included**: Automatically generated 14-slide `.pptx` presentation (`dorm-sa-presentation-ga-1.pptx`).

## Live Demo (GitHub Pages)

Access the live web presentation here:
`https://kerwinarlan.github.io/dorm-sa-presentation-ga-1/`

## Project Structure

```
dorm-sa-presentation-ga-1/
├── index.html                 # Main presentation entry point
├── styles.css                 # Spider-Man styling & mobile responsive rules
├── script.js                 # Presentation navigation, Web Audio SFX & BGM
├── dorm-sa-presentation-ga-1.pptx # Generated PowerPoint presentation
├── generate_pptx.py          # Python script to build the PPTX deck
├── crop_staff_photos.py      # Python script to crop current staff photos
├── create_comic_assets.py    # Python script to generate comic panel assets
├── assets/
│   ├── current_staff/        # Original screenshot reference panels
│   ├── staff_photos/         # Cropped individual photos for team cards
│   └── memes/                # Comic panel crops & meme assets
└── README.md
```

## Local Development

Open `index.html` directly in a browser or start a local static server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000` in your web browser.
