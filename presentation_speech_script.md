# Presentation Speech Script
## IDX Property Search — Final Presentation
*Xindi Chen · IDX Exchange Internship Program*

---

### Slide 1 — Title

Hi everyone, my name is Xindi Chen, and today I'll be presenting the IDX Property Search application — a full-stack real estate listing app I built as part of the IDX Exchange internship program.

The project is built on four main technologies: React on the frontend, Node.js with Express on the backend, MySQL for the database, and Docker to containerize the database locally. Over the next few minutes I'll walk you through what it does, how it's built, and what I learned along the way.

---

### Slide 2 — Project Overview

So, what exactly did I build? IDX Property Search is a web app that lets users browse, filter, sort, and save real estate listings from a MySQL database — no account or login required.

The database holds over a thousand properties. Users can narrow those down using nine different search filters and sort options. And as you'll see later, the entire codebase is backed by a hundred percent test coverage across all modules, both frontend and backend.

The driving motivation was simple: build something that mirrors what a real IDX search product does, while learning the full development lifecycle end to end.

---

### Slide 3 — Tech Stack

Let me quickly run through the stack. On the frontend I used React 19 with React Router v6 for navigation, and custom hooks for managing state and side effects.

The backend is a Node.js Express server exposing a REST API, with CORS middleware and environment-based config through dotenv. The database is MySQL 8.0, accessed through a mysql2 connection pool with parameterized queries to guard against SQL injection. And MySQL itself runs in a Docker container, which keeps the database setup consistent regardless of what machine you're developing on.

---

### Slide 4 — Architecture

Here's how the pieces connect. The React app runs on port 3000 and talks to the Express API on port 5000 through a proxy configured in the frontend's package.json. That means in development you never deal with CORS issues — all API calls go through `/api/*` and CRA forwards them automatically.

Express routes handle everything under `/api/properties`, and each route goes through input validation before touching the database. The mysql2 pool manages up to ten concurrent connections to the Docker container on port 3307.

On the frontend, state is managed with useState and useEffect hooks. The favorites feature uses a custom `useFavorites` hook that persists to localStorage, so your saved properties survive a page refresh. A Makefile at the repo root ties everything together with simple commands for install, start, and stop.

---

### Slide 5 — Key Features

The app has six main features. Search and filter lets users narrow listings by city, ZIP code, price range, beds, and baths — all applied in a single API call.

Results come back paginated at twenty per page, with a smart page number component that shows ellipses when there are a lot of pages. Each listing links to a property detail page showing the full photo, specs, description, and the open house schedule — which is fetched in parallel so neither request blocks the other.

Users can also sort by price, date listed, square footage, or number of beds, in either ascending or descending order. And the favorites heart button saves properties to localStorage, so no login is needed at all.

---

### Slide 6 — Frontend Testing

Testing was a big focus of this project. The frontend has 155 tests across 13 test suites, all using Jest and React Testing Library.

Every module is covered — the API client, utility functions like the photo parser and property mapper, the useFavorites hook, all four components, both pages, and the App routing. The coverage is 100% across statements, branches, functions, and lines.

A few interesting challenges came up which I'll get to in a moment — but the short version is that achieving true 100% branch coverage forced me to think carefully about every possible code path, including ones that can't actually be triggered through the UI.

---

### Slide 7 — Backend Testing

The backend follows the same standard. There's one test file — `properties.test.js` — with 31 tests across three describe blocks, one for each API endpoint.

The suite covers input validation — things like non-integer limits, out-of-range offsets, and invalid filter values. It covers all five filter types, all four sort fields, and both sort directions. It also covers every error response: 400 for bad input, 404 for missing records, and 500 for unexpected database errors.

The database is mocked using Jest's mock system, so the tests run entirely in memory with no Docker or MySQL dependency. That makes them fast and reliable in any environment. And just like the frontend — 100% statement, branch, function, and line coverage.

---

### Slide 8 — Challenges & Solutions

There were four main challenges I want to highlight.

First, a Docker port conflict. Port 3306 was already occupied on my machine by a MySQL instance from a school project, so I remapped the container to 3307 on the host and updated the backend `.env` accordingly.

Second, React 19 peer dependency errors. The `react-scripts` package expects React 18, so installing normally threw errors. The fix was using `--legacy-peer-deps` to bypass the peer check without downgrading React.

Third, dead-code branch coverage. The disabled-button guards in the Pagination component and a null-guard in the property detail page are genuinely unreachable through the UI — React checks the fiber prop, not the DOM attribute, so removing the disabled attribute in tests doesn't reach the else branch. I used Istanbul's `/* istanbul ignore */` annotation with a comment explaining why.

And fourth, the `reportWebVitals` dynamic import doesn't resolve in a jsdom test environment, so I excluded that file from the coverage report via `collectCoverageFrom` in the Jest config, while still testing its behavioral branches.

---

### Slide 9 — What I Learned

This project taught me a few things I couldn't have learned from a tutorial alone.

Full-stack integration is harder than it looks — each layer has its own config requirements, and getting the proxy, the CORS settings, the environment variables, and the Docker port mapping all working together takes real attention to detail.

Test-driven thinking changed how I write code. When you're aiming for 100% branch coverage you think differently about every if-statement and every default value. You write cleaner, more intentional code.

Environment isolation with Docker and `.env` files solved a real problem for me — it's what made the project easy to share and reproduce. And building pagination, sorting, and filtering on the backend gave me hands-on experience with query param validation and safe SQL patterns that I'll carry into every API I write from now on.

---

### Slide 10 — Future Improvements

If I were to keep building this out, there are six areas I'd focus on.

User authentication would let favorites and saved searches live server-side instead of in localStorage. Advanced search could add map-based polygon filtering and school district lookup. Image galleries would give property detail pages a proper photo carousel.

A mobile-first redesign would make the filters and navigation touch-friendly. Real-time updates via WebSocket or polling would surface new listings and price changes without a full page refresh. And a CI/CD pipeline with GitHub Actions would automate test runs and deployment on every merge to main.

---

### Slide 11 — Thank You / Q&A

That wraps up the IDX Property Search project. The full source code is available on GitHub at CSUSC-CChen/idx-property-search.

This has been a genuinely valuable experience — building something end to end, dealing with real integration problems, and learning how production-grade testing actually works. I'm grateful for the opportunity and happy to answer any questions you have.

---

*Total estimated time: ~8–10 minutes at a comfortable speaking pace.*
*Tip: pause briefly after each slide transition before starting the next section.*
