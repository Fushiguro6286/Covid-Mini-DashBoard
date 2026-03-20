# COVID Stats Mini Dashboard

A sleek React dashboard built with Vite to display COVID-19 data by country and global summaries. This project fetches live API data and presents it using clean mobile-first UI components.

## 🚀 Highlights

- React + Vite setup (fast dev builds, HMR)
- Global and country-specific statistics
- Searchable country selector and table view
- Responsive cards with daily/total comparison
- Modular component architecture for quick extension

## 🧩 Project Structure

- `src/main.jsx`: app bootstrap
- `src/App.jsx`: main page logic + layout
- `src/component/GlobalSummary.jsx`: global case/death/recovery overview
- `src/component/CountrySelector.jsx`: dropdown or filter for country selection
- `src/component/StatsCard.jsx`: single statistic card UI
- `src/component/CardView.jsx`: quick metric cards
- `src/component/TableView.jsx`: country data table

## ⚙️ Get Started

1. Clone repository:

```bash
git clone https://github.com/YOUR-USERNAME/covid-stats-mini-dashboard.git
cd covid-stats-mini-dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Run development server:

```bash
npm run dev
```

4. Open in browser:

- `http://localhost:5173` (default Vite URL)

## 🧪 Available scripts

- `npm run dev`: run local development server
- `npm run build`: create production bundle
- `npm run preview`: preview built app locally
- `npm run lint`: run ESLint checks (if configured)

## 🌐 API and data source

This app uses a third-party COVID data endpoint (likely from a public API or JSON file). If you need to switch source:

- update request URL in data fetch module
- adapt response parsing in components

## 🧠 How it works

1. `App.jsx` fetches data on mount and stores it in state
2. `GlobalSummary` receives aggregated values (totalCases, totalDeaths, totalRecovered)
3. `CountrySelector` filters when user selects / types a country
4. `CardView` renders top-level metrics with delta + totals
5. `TableView` lists data for all countries with sorting options

## 🏗️ Architecture

- Data fetch layer: in `src/App.jsx` (or abstract to `src/api/` for future)
- UI components: in `src/component/` (stateless, presentational)
- Style: `App.css` + `index.css` (mobile-first, responsive grid)

## ✨ UI features

- statistic cards (cases, active, recovered, deaths)
- country selection with filtering support
- sortable and paginated table (if extended)
- mobile-optimized, card-first dashboard layout

## 🛠️ Customization ideas

- add charting (Recharts, Chart.js, ApexCharts)
- daily trends and 7-day moving averages
- region/contintent filters
- dark mode toggle and accessibility improvements

## 📄 License

MIT License

---

Made with React, Vite, and ❤️ for learning pandemic data visualization.
