# Sales-Revenue-Analysis — Sales & Revenue Dashboard

A production-ready dashboard based on the `manichandukore/Sales-Revenue-Analysis` repository. It monitors KPIs, analyzes revenue trends, and identifies top-performing products with interactive charts, filters, and data import from Excel/CSV sources.

## Features

- **KPI Cards** — Total Revenue, Orders, Avg Order Value, Units Sold, Active Reps with sparklines and trend indicators
- **Revenue Trend** — Area chart grouped by week / month / quarter / year
- **Top Products** — Horizontal bar chart switchable between revenue, orders, and units
- **Regional Analysis** — Pie chart and radar chart with breakdown bars
- **Rep Leaderboard** — Ranked performance board with progress bars
- **Category Donut** — Revenue share by product category
- **Interactive Filters** — Region, category, rep, and date range slicers
- **Data Table** — Sortable, paginated transaction log
- **File Import** — Drag & drop CSV / XLSX import
- **CSV Export** — One-click export of filtered data

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for production

```bash
npm run build
```

## Importing Your Own Data

Go to the **Import** tab and drag & drop a CSV or XLSX file. The expected columns are:

| Column    | Type   | Example           |
|-----------|--------|-------------------|
| date      | string | 2024-03-15        |
| product   | string | ProSuite          |
| category  | string | Software          |
| region    | string | North America     |
| rep       | string | Aria Chen         |
| qty       | number | 3                 |
| unitPrice | number | 4200              |
| discount  | number | 10 (percent)      |
| revenue   | number | 11340             |

Column names are case-insensitive and spaces are normalized to underscores.

## Tech Stack

- **React 18** + **Vite** — fast dev server and bundler
- **Recharts** — AreaChart, BarChart, PieChart, RadarChart
- **Tailwind CSS** — utility-first styling
- **PapaParse** — CSV parsing
- **SheetJS (xlsx)** — Excel file reading
- **Lucide React** — icons
- **date-fns** — date grouping utilities

## Project Structure

```
src/
├── components/
│   ├── KPICard.jsx          # Metric cards with sparklines
│   ├── FilterBar.jsx        # Global slicers
│   ├── RevenueTrendChart.jsx # Area chart
│   ├── TopProductsChart.jsx  # Horizontal bar chart
│   ├── RegionalChart.jsx     # Pie + radar
│   ├── CategoryChart.jsx     # Donut chart
│   ├── RepLeaderboard.jsx    # Ranked rep bars
│   ├── DataTable.jsx         # Sortable paginated table
│   └── FileImport.jsx        # Drag-drop importer
├── data/
│   └── sampleData.js         # 400-row generated dataset
├── utils/
│   └── dataUtils.js          # KPI computation, grouping, formatting
├── App.jsx                   # Main layout + tab router
├── main.jsx                  # Entry point
└── index.css                 # Global styles + animations
```
