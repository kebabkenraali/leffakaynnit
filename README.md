# Leffakäynnit – Finnkino Premium Visit Tracker

Leffakäynnit is a detailed PWA app for tracking the value you get from your Finnkino Premium subscription. Track visits, snack costs and compare the ticket book — all in a single-page, offline-capable app.

![Leffakäynnit](icon.svg)

## 🎬 Features

### Visit management
- **Manual entry**: Add visits one by one (date, movie, theater, snacks, other expenses, questionnaire-based rating, notes)
- **Movie name autocomplete**: Existing movie names are suggested while typing, and a known spelling is suggested / applied automatically so the same movie always has the same name (minor typos included)
- **Excel import**: Import directly from your Finnkino Premium tracking spreadsheet (`.xlsx`)
- **Edit & delete**: Click a visit to edit or delete it
- **Search**: Filter the visit list by movie name

### Calculations & analysis
- **Cost per movie visit now**: Annual fee divided by the number of visits — the top box also shows the most recently watched movie (date and visit number), total visits, and the treat goal status (movies remaining or "✓ Achieved" + snack budget per movie)
- **Snacks and other costs included**: (Annual fee + snacks + other expenses) / visits
- **Break-even indicator**: How many visits are needed for Premium to be cheaper than the ticket book
- **Treat goal**: How many movies you need to watch without snacks or other expenses for the average cost per visit (including all expenses) to fall below the ticket book price — and how many visits' worth of accumulated snacks have pushed the goal back. Once the goal is achieved, the app shows how much of the ticket book price is left as a snack budget for each visit
- **Treat budget for the rest of the season (v29)**: A dedicated card showing how much you can still spend on treats (and other costs) while the all-in average stays *below* the ticket book price at the end of the season. Both the total remaining budget and the per-visit amount are shown. The calculation subtracts snacks and other costs already spent and uses the 30-day pace forecast for the remaining visits; if no further visits are forecast, it applies to the next single visit. If there is no room left, the card says so explicitly
- **Snack impact in the add dialog (v18)**: When adding a visit, the dialog shows in real time how snacks affect things: the all-in average cost per visit after this visit, and how many visits' worth the snacks shift the treat goal
- **Monthly snack budget (v18)**: A monthly limit configurable in Settings and a meter showing this month's snack expenses relative to the limit
- **Savings vs. ticket books**: Comparison table in two ways — ticket only, and snacks and other expenses counted as Premium costs: expenses, €/visit, total and per-visit savings, and from which visit onward Premium pays off
- **Forecast**: Number of visits and €/visit at the end of the season at the pace of the last 30 days
- **Cumulative savings vs. ticket books**: Two lines by month (ticket only / snacks and other costs included), starting negative at the beginning of the season (annual fee) and crossing above zero at break-even
- **Monthly**: Visits-per-month bars and a table (visits, snacks, €/visit and savings at month end), including months with no visits
- **Snacks**: Total, how many visits they were bought on, and average purchase
- **Date check**: Visits dated in the future or outside the season are excluded from calculations and shown as a warning

### Movie statistics
- **Unique movies**: Number of distinct movies watched, how many were seen once vs. more than once, total repeat visits, average visits per movie and a top-3 list
- **Most watched movie**: The movie you have seen the most times
- **Most expensive movie**: The movie-ticket portions of visits with the same name + snacks combined
- **Ratings**: Each visit is rated by answering up to six questions (did you like it, was it a good use of time, length too short / right / too long, did you get bored, did you fall asleep, story). Questions use a 1–5 scale (or three choices for length); unanswered questions are ignored. The overall rating is the average of the answers on a 0–10 scale. The summary shows the average, a 0–10 distribution, per-question averages and best/worst movies (visits of the same movie averaged). Several different ratings for the same movie are intentional — each is a snapshot of that moment. Old 1–5 star ratings are converted automatically (1→0, 3→5, 5→10), stored permanently on first launch, and given matching questionnaire answers so question statistics work right away

### Settings
- **Language**: Finnish (default) and English — switch by clicking the **flag image in the top-left corner** (US flag → English, Finnish flag → Suomi) or under **Settings → Kieli / Language**. The choice is saved automatically and applies to every UI text, chart label, date/number format, toast message and CSV export.
- **Subscription settings**: Annual fee, ticket book comparison price, season start date and end date
- **Annual fee payment date (v18)**: Optional — the savings chart's zero point shifts to the payment month (the average €/visit can thus be more accurate when the payment date and season start differ)
- **Monthly snack budget (v18)**: Monthly limit for snack expenses (€/month, 0 = no budget)
- **Season rollover helper (v18)**: When the season has ended, the Summary shows a card for shifting the season dates one year forward or for going to edit the settings
- **Default theater**: In the subscription settings; the Theater field of new visits is pre-filled with this
- **Backups**: Automatic daily saving to the phone's files, or on a computer to a selected folder (see [Backups](#-backups))

### Backups & data management
- **Download backup (.json)**: Save the full state (settings + visits)
- **Restore backup**: Import a previously downloaded `.json` file
- **Export CSV (for Excel)**: All visits in tabular form for Excel
- **Delete all visits**: Clear the visit database (settings are preserved)

### Technical features
- **PWA (Progressive Web App)**: Installable on phone/desktop, works offline
- **Service Worker**: Caches resources, so the app opens without a network connection
- **localStorage**: Data is stored in the browser, not on a server
- **File System Access API**: local folder (Chrome/Edge 86+)
- **Web Share API**: share menu on mobile devices (Save to OneDrive, Google Drive, etc.)
- **IndexedDB**: Persists the selected folder handle across app restarts
- **Calculation tests (v18)**: `tests.html` — browser-based test coverage for the calculations; no build pipeline, no dependencies

## 🚀 Getting started

### GitHub Pages (recommended)
1. Fork or clone this repository
2. Go to the repository's **Settings → Pages**
3. Select **Source: Deploy from a branch**, branch `gh-pages` (folder `/ (root)`)
4. The app is available at `https://<your-username>.github.io/leffakaynnit/`

### Local development
```bash
# Clone
git clone https://github.com/kebabkenraali/leffakaynnit.git
cd leffakaynnit

# Start a local server (opening index.html directly as a file won't run the service worker)
python -m http.server 8000
# OR
npx serve .
```

## 📊 Excel import – instructions

1. Go to the **Settings** tab
2. Select the file **Finnkino_Premium_Seuranta.xlsx** in the import field
3. The app automatically looks for a sheet with the columns:
   - **Päivä** (also Paiva/pvm/date)
   - **Elokuva** (elokuva)
   - **Herkut €** (herku/karkki)
   - Optional: **Teatteri/Sali**, **Muut kulut €** (muu), **Arvosana** (old 1–5 stars are converted to 0–10; a 0–10 value is imported as-is), **Muistio/Huomio**
4. Make sure the header row uses the correct names (accents don't matter). English headers are also supported (Date, Movie, Snacks €, Other costs €, Theater, Rating, Note), so a CSV exported by the app in English can be imported back
5. If visits already exist, the app asks: **OK** replaces the current visits, **Cancel** adds only the new ones (duplicates are identified by date + movie)

## 💾 Backups

Data is stored in the browser. Backups are ordinary files in the device's storage, not in the browser cache.

### Phone
- **Automatically save a backup to the phone once a day**: after a change, the app downloads `leffakaynnit-YYYY-MM-DD.json` and `.csv` to the Downloads folder, at most once a day.
- **Download backup** / **Export CSV**: opens the share menu, where the file can be saved wherever you like.
- If a backup is more than a week old, the app reminds you when you open it.

### Computer (Chrome/Edge)
**Choose folder** saves backups to the selected folder, e.g. `D:\OneDrive\...`, so OneDrive sync takes care of the rest. The folder is remembered, and the browser may ask for permission again.

### Restore
**Restore backup** reads a `.json` file and replaces the current data (confirmation is requested).

## 📁 File structure

```
leffakaynnit/
├── index.html        # Main UI
├── app.js            # All logic (calculations, storage, rendering, backups)
├── style.css         # Theme, responsiveness, dark/light mode
├── sw.js             # Service Worker (offline support, incl. Excel reader cache)
├── manifest.webmanifest  # PWA manifest
├── icon.svg          # App icon
├── flag-fi.svg       # Finnish flag image (language switcher)
├── flag-us.svg       # US flag image (language switcher)
├── tests.html        # Calculation tests (run in browser)
├── tests.js          # Test cases for app.js calculations
├── LICENSE           # MIT license
└── README.md         # This file
```

## 🔧 Developer guide

### Calculation tests
Open `tests.html` in a browser:

- the page runs `app.js`'s calculation functions with test cases and displays the results as a list
- the tests don't call the `save()` function, so nothing changes in the localStorage state
- new calculation changes need their own test case in the `tests.js` file

### Service Worker update
When publishing, bump the same number everywhere it appears: `sw.js`'s `CACHE` (`leffakaynnit-v30`), `index.html`'s `app.js?v=30` and `style.css?v=30`, and `tests.html`'s `style.css?v=30` and `tests.js?v=30` (also in `sw.js`'s `ASSETS` list), plus the `app.js?v=30` fetch in `tests.js`. The version number in the filename prevents GitHub Pages' 10-minute cache from combining new HTML with an old `app.js`.

### Publishing
GitHub Pages publishes the `gh-pages` branch. Development is done on the `main` branch, and the release is the same commit in both:

```bash
git pull --ff-only origin main
git push origin main
git push origin main:gh-pages
```

- **Homepage**: `https://kebabkenraali.github.io/leffakaynnit/`
- Always fetch the latest version first (`git pull`) if the repo is edited with multiple tools or machines (e.g. Cline and Claude Code). Otherwise, a change pushed on top of an old version can undo earlier fixes.
- Do not use the `git push --force` command on the `main` or `gh-pages` branch.

## 📝 License

MIT License — free to use, modify and distribute. See [LICENSE](LICENSE).

## 💡 Development Ideas (Roadmap)

Status update of the roadmap after v18. Completed items are listed at the end.

### Completed in v18
- ✅ **Snack impact already in the add-visit dialog** – the dialog shows in real time how the visit's snacks and other purchases push the treat goal (per-visit all-in cost after this visit, and how many visits' worth the extras move the goal).
- ✅ **Monthly snack budget** – configurable monthly limit in Settings with a meter in the monthly stats (red when exceeded).
- ✅ **Season rollover helper** – when the season has ended, the Summary shows a card with a one-click "shift season one year forward" action or a shortcut to the settings.
- ✅ **Automated tests for the calculations** – browser-based test page `tests.html`/`tests.js` covering `computeVisits`, `computeSummary`, `monthStats`, the treat goal, the payment-date handling and date parsing (no build tools needed).
- ✅ **Excel reader working offline** – SheetJS is now cached by the service worker (fetched once, served from cache afterwards).
- ✅ **Annual fee payment date** – optional setting; the savings chart and monthly stats start from the payment month with zero savings before the payment.

### Still open
- **Forecast line in the savings chart** – attempted in v18, removed again in v19 after feedback: extending the axis to the season end compressed the real history into the far-left corner so the curves read "random". Parked until a presentation that keeps today's date at the right edge of the chart is designed (e.g. a hover tooltip instead of an axis extension).
- **Comparison of subscription options** (Premium vs. basic card vs. regular tickets) – requires reliable price data for the alternative ticket types; postponed until the comparison prices are defined.
- **Logging reminders** – browser notifications ("did you log your visit?") require a reliable trigger signal for when a visit happened but was not logged; postponed until a non-intrusive trigger is designed.
- **Multi-year history** – comparing seasons requires storing per-season snapshots (the current data model derives everything from a single configured season); design work needed.
- **Multiple user profiles** – shared subscriptions need a per-visit "who is here" field and per-person totals; nice-to-have, not yet scheduled.

## 🤝 Contributions

Pull requests are welcome! Suggest improvements or report bugs on the Issues tab.

---

## 🛠️ Tools and technologies

This app was developed using modern web technologies and AI-assisted development workflows:

### Development environment and tools
- **Cline (AI Coding Agent)** – code generation, refactoring, debugging and architectural design
- **Claude Code** – the first version of the app, overhaul of calculations and charts, bug fixes and testing
- **Visual Studio Code** – main development environment
- **Git & GitHub** – version control and GitHub Pages hosting
- **Chrome/Edge DevTools** – debugging, PWA testing, performance profiling

### Frontend technologies
- **Vanilla JavaScript (ES6+)** – no frameworks, lightweight and fast
- **HTML5 + CSS3** – semantic HTML, CSS Custom Properties (themes), Grid/Flexbox
- **Progressive Web App (PWA)** – `manifest.webmanifest`, Service Worker (`sw.js`)
- **File System Access API** – local folder (desktop only)
- **Web Share API** – share menu on mobile devices
- **IndexedDB** – stores the selected folder handle
- **localStorage** – local data store
- **SheetJS (xlsx)** – reading Excel files from a CDN

### Architecture
- **Single Page Application (SPA)** – no build tools or bundlers
- **Offline-first** – the Service Worker caches all static assets
- **Modular structure** – a single `app.js` with modular functions (calculations, storage, rendering, I/O)
- **State-driven rendering** – `state` object → `compute` → `render`

### Calculation model
- **Cumulative average cost** – `movieAt = annual fee / visits`, `totalAt = (annual fee + snacks + other expenses) / visits`
- **Savings** – ticket only: `visits × ticket book − annual fee`; snacks and other costs included: `visits × ticket book − (annual fee + snacks + other expenses)`
- **Counted visits** – only within the season and up to today; others are shown as a warning
- **Break-even analysis** – ticket only: `ceil(annual fee / ticket book price)`; with snacks, the first visit where savings turn positive (an estimate if not yet achieved)
- **Treat goal** – without new snacks or other expenses, the goal is reached at `floor((annual fee + accumulated snacks + other expenses) / ticket book) + 1` visits; the annual fee alone would require `ceil(annual fee / ticket book)` visits. Once the goal is met, the snack budget per visit = `ticket book − annual fee / visits`
- **Snack impact in the dialog** – baseline = currently counted visits and expenses (when editing, excluding that visit); predicted average cost = `(annual fee + accumulated snacks + other expenses + this visit's snacks and other expenses) / (visits + 1)`, goal shift = `snacks and other expenses / ticket book` visits' worth
- **Annual fee payment date** – when set and earlier than the season start, the monthly review starts from the payment month and savings are calculated from zero only after the payment; in the payment month, savings are recorded as `−annual fee`
- **Forecast** – the visit pace of the last 30 days extended to the end of the season (as a number), but the savings chart always draws only up to the current day, without a forecast
- **SVG charts** – a cumulative savings line and visits-per-month bars; €/visit and savings at month end

### Quality assurance
- **Error handling** – `try/catch` for all I/O operations, user-friendly toast messages
- **Graceful degradation** – not all browsers support the File System Access API → falls back to the Web Share API

---

## 👤 Author and AI assistance

**Developer**: [kebabkenraali](https://github.com/kebabkenraali)  
**AI assistance**: [Cline](https://cline.bot) and [Claude Code](https://claude.com/claude-code) — AI coding agents that have written and refactored code, designed the architecture, fixed bugs and documented features.

> *This project demonstrates how modern AI-assisted development speed combined with vanilla web technologies can produce a production-ready, offline-capable PWA app without complex build pipelines.*

---

**Version**: 2026.11 v30 (clearer menu, form and summary labels in Finnish and English, and the backup status now follows the selected language; treat budget for the rest of the season: remaining € total and €/visit that keep the all-in average below the ticket price, based on already-spent costs and the 30-day forecast; unique-movie statistics, questionnaire-based 0–10 ratings with automatic migration of old star ratings including generated questionnaire answers, silent movie-name unification; Finnish and English UI with a clickable flag image in the top-left corner and a language selector in Settings; top box: latest movie and treat goal; snack forecast in the dialog, monthly snack budget, season rollover helper, calculation tests, offline Excel import and payment date (v18–v21); savings chart without forecast (v19); treat goal and snack budget (v17); savings comparison with and without snacks, monthly charts, ratings, date check, daily backup)
