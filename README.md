# IDX Property Search Application

A full-stack property search application built with React, Node.js/Express, and MySQL.

## Features

- Property search with filters (city, price, beds, baths)
- Paginated results
- Property detail pages
- Open house schedules
- Sort properties by price, date listed, or size
- Save favorite properties using localStorage

## Prerequisites

- Node.js 18+ and npm
- Docker Desktop
- Git
- Make (optional — provides convenience commands)

## Setup Instructions

### 1. Clone Repository
```bash
git clone <repository-url>
cd idx-internship
```

### 2. Start Database
```bash
docker run --name idx-mysql-local -p 3307:3306 \
  -e MYSQL_ROOT_PASSWORD=rootpass \
  -e MYSQL_DATABASE=rets \
  -d mysql:8.0

# Import data
docker exec -i idx-mysql-local mysql -uroot -prootpass rets < rets_property.sql
docker exec -i idx-mysql-local mysql -uroot -prootpass rets < rets_openhouse.sql
```

> **Note:** The container maps host port `3307` to MySQL's internal `3306`.  
> Set `DB_PORT=3307` in `backend/.env` to match.

### 3. Backend Setup
```bash
cd backend
npm install
cp .env.example .env  # Edit with your values
npm run dev
```

Backend runs on http://localhost:5000

### 4. Frontend Setup
```bash
cd frontend
npm install
npm start
```

Frontend runs on http://localhost:3000

---

## Makefile Shortcuts

A `Makefile` at the repo root provides convenience targets so you don't have to `cd` into each folder manually.

| Command | What it does |
|---------|-------------|
| `make install` | `npm install` in both `backend/` and `frontend/` |
| `make start` | Starts the backend and frontend concurrently |
| `make stop` | Kills all running Node processes |
| `make clean` | Removes `node_modules` from both projects |

```bash
# First-time setup
make install

# Start the full stack
make start

# Stop everything
make stop
```

---

## Running Tests

### Backend
```bash
cd backend
npm test               # run once
npm run test:watch     # watch mode
npm run test:coverage  # with coverage report
```

### Frontend
```bash
cd frontend
npm test                                        # watch mode
npm test -- --watchAll=false                    # run once and exit
npm test -- --coverage --watchAll=false         # with coverage report
```

---

## Project Structure

```
idx-internship/
├── Makefile
├── README.md
├── .github/
│   └── pull_request_template.md
├── backend/
│   ├── package.json
│   └── src/
│       ├── index.js
│       ├── db/
│       │   └── mysql.js
│       └── routes/
│           ├── properties.js
│           └── properties.test.js
└── frontend/
    ├── package.json
    └── src/
        ├── App.js
        ├── App.test.js
        ├── index.js
        ├── reportWebVitals.js
        ├── reportWebVitals.test.js
        ├── setupTests.js
        ├── api/
        │   ├── client.js
        │   └── client.test.js
        ├── components/
        │   ├── ErrorBoundary.js
        │   ├── ErrorBoundary.test.js
        │   ├── Pagination.js
        │   ├── Pagination.test.js
        │   ├── PropertyCard.js
        │   ├── PropertyCard.test.js
        │   ├── PropertyFilters.js
        │   └── PropertyFilters.test.js
        ├── hooks/
        │   ├── useFavorites.js
        │   └── useFavorites.test.js
        ├── pages/
        │   ├── ListingsPage.js
        │   ├── ListingsPage.test.js
        │   ├── PropertyDetailPage.js
        │   └── PropertyDetailPage.test.js
        └── utils/
            ├── PhotoUtils.js
            ├── PhotoUtils.test.js
            ├── api-helpers.js
            ├── api-helpers.test.js
            ├── propertyMapper.js
            └── propertyMapper.test.js
```

---

## API Endpoints

### `GET /api/properties`
Returns a paginated list of properties with optional filters.

**Query parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 20 | Results per page |
| `offset` | number | 0 | Pagination offset |
| `city` | string | — | Filter by city |
| `zipcode` | string | — | Filter by ZIP code |
| `minPrice` | number | — | Minimum list price |
| `maxPrice` | number | — | Maximum list price |
| `beds` | number | — | Minimum bedrooms |
| `baths` | number | — | Minimum bathrooms |
| `sortBy` | string | — | `price`, `date`, `size`, or `beds` |
| `sortOrder` | string | `DESC` | `ASC` or `DESC` |

```bash
GET /api/properties?city=Los%20Angeles&minPrice=500000&beds=3
```

### `GET /api/properties/:id`
Returns details for a single property.

### `GET /api/properties/:id/openhouses`
Returns the open house schedule for a property.

### `GET /api/health`
Returns `{ status: "ok", database: "connected" }` when the DB is reachable.

---

## Architecture Decisions

### Why Docker for MySQL?
- Consistent environment across developers
- Easy to start/stop without affecting the local machine
- Simple to reset and re-import data

### Why Pagination?
- Large dataset (1000+ properties) would be slow to load all at once
- Better user experience with smaller chunks
- Reduces backend load

### Why React Router?
- Clean URLs for property detail pages
- Browser back button works as expected
- Easy to add more pages in the future

---

## Known Issues / Future Improvements

- Add property image galleries
- Implement user authentication
- Add saved searches
- Mobile responsive design improvements

---

## Troubleshooting

**Backend won't start:**
- Check MySQL is running: `docker ps`
- Verify `.env` exists in `backend/` with the correct credentials
- Confirm `DB_PORT=3307` matches the Docker port mapping

**Frontend shows CORS errors:**
- Ensure the proxy is set in `frontend/package.json`
- Restart the React dev server

**Tests failing:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node version: `node --version` (should be 18+)

**Tests failing with "Cannot find module 'react-router-dom'":**
- Check there's no stray `node_modules` or `package.json` at the repo root — only `frontend/` and `backend/` should have their own.
  If there is, delete it: `rm -rf node_modules package.json package-lock.json`
- Then clean reinstall in the affected folder:
  `rm -rf node_modules package-lock.json && npm install --legacy-peer-deps`

**npm install fails with peer dependency errors:**
- This project uses React 19 with react-scripts 5, which expects React 18.
  Use `npm install --legacy-peer-deps` to bypass the peer check.

**IntelliJ Jest runner can't find react-scripts:**
- In Run → Edit Configurations, set "Jest package" to
  `frontend/node_modules/react-scripts` (not `node_modules/jest`).
- Or just run `npm test` from the terminal.

---

## Contributors

Xindi Chen — Initial development

## License

This project was created for educational purposes as part of the IDX Exchange internship program.
