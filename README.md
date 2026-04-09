# IDX Property Search Application

A full-stack property search application built with React, Node.js/Express, and MySQL.

## Features

- Property search with filters (city, price, beds, baths)
- Paginated results
- Property detail pages
- Open house schedules
- Sort properties by price, date listed, or size
- Let users save favorite properties using localStorage

## Prerequisites

- Node.js 18+ and npm
- Docker Desktop
- Git

## Setup Instructions

### 1. Clone Repository
```bash
git clone <repository-url>
cd idx-internship
```

### 2. Start Database
```bash
docker run --name idx-mysql-local -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=rootpass \
  -e MYSQL_DATABASE=rets \
  -d mysql:8.0

# Import data
docker exec -i idx-mysql-local mysql -uroot -prootpass rets < rets_property.sql
docker exec -i idx-mysql-local mysql -uroot -prootpass rets < rets_openhouse.sql
```

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

## Running Tests

Backend tests:
```bash
cd backend
npm test
```

Frontend tests:
```bash
cd frontend
npm test                          # watch mode
npm test -- --watchAll=false      # run once and exit
npm test -- --coverage --watchAll=false   # with coverage report
```

## Project Structure

```
idx-internship/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   └── mysql.js
│   │   ├── routes/
│   │   │   └── properties.js
│   │   └── index.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   └── hooks/
│   └── package.json
└── README.md
```

## API Endpoints

### GET /api/properties
Returns paginated list of properties with optional filters.

Query parameters:
- `limit`: Number of results (default: 20)
- `offset`: Pagination offset (default: 0)
- `city`: Filter by city
- `zipcode`: Filter by ZIP code
- `minPrice`: Minimum price
- `maxPrice`: Maximum price
- `beds`: Minimum bedrooms
- `baths`: Minimum bathrooms

Example:
```bash
GET /api/properties?city=Los%20Angeles&minPrice=500000&beds=3
```

### GET /api/properties/:id
Returns details for a single property.

### GET /api/properties/:id/openhouses
Returns open house schedule for a property.

## Architecture Decisions

### Why Docker for MySQL?
- Consistent environment across developers
- Easy to start/stop without affecting local machine
- Simple to reset and reimport data

### Why Pagination?
- Large dataset (1000+ properties) would be slow to load all at once
- Better user experience with smaller chunks
- Reduces backend load

### Why React Router?
- Clean URLs for property detail pages
- Browser back button works as expected
- Easy to add more pages in future

## Known Issues / Future Improvements

- Add property image galleries
- Implement user authentication
- Add saved searches
- Mobile responsive design improvements

## Troubleshooting

**Backend won't start:**
- Check MySQL is running: `docker ps`
- Verify .env file exists with correct credentials

**Frontend shows CORS errors:**
- Ensure proxy is set in frontend/package.json
- Restart React dev server

**Tests failing:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node version: `node --version` (should be 18+)

**Tests failing with "Cannot find module 'react-router-dom'":**
- Check there's no stray `node_modules` or `package.json` at the repo
  root — only `frontend/` and `backend/` should have their own.
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

## Contributors

Xindi Chen - Initial development

## License

This project was created for educational purposes as part of the IDX Exchange internship program.