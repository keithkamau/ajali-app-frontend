<<<<<<< HEAD
# Ajali! Frontend

Ajali is a web application for reporting accidents and emergencies to the appropriate authorities and the general public. This is the React client that talks to the [Ajali! Backend API](https://github.com/keithkamau/ajali-web-app-backend).

## Tech Stack

- React 18
- Redux Toolkit (state management)
- React Router
- Vite (build tool / dev server)
- Axios (API calls, with automatic JWT refresh)
- React Hook Form + Yup (form validation)
-Leaflet + OpenStreetMap for incident location
- Tailwind CSS
- Jest + React Testing Library (tests)

## Project Structure

```
ajali-app-frontend/
├── src/
│   ├── api/              # Axios instance + API modules (auth, incidents, notifications)
│   ├── components/        # Reusable UI, grouped by feature (auth, incidents, admin, etc.)
│   ├── pages/              # Route-level pages (Dashboard, Login, IncidentDetail, Admin...)
│   ├── redux/              # Store + slices (auth, incidents, notifications, admin)
│   ├── styles/              # Global and auth-specific styles
│   ├── utils/                # Constants, formatters, validators
│   └── __tests__/            # Component and page tests
├── index.html
├── vite.config.js
└── package.json
```

## Prerequisites

- Node.js 18+
- npm
- The [backend API](https://github.com/keithkamau/ajali-web-app-backend) running locally (or a deployed URL)

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/keithkamau/ajali-app-frontend.git
cd ajali-app-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:8000/api
```

Point this at wherever your backend is running (defaults to `http://localhost:8000/api` if not set).

### 4. Run the development server

```bash
npm start
```

This starts Vite's dev server, by default at `http://localhost:5173`.

## Available Scripts

| Command | Description |
|---|---|
| `npm start` | Run the dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run the Jest test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with a coverage report |
| `npm run lint` | Lint the `src/` directory |

## Usage

1. Register an account and log in.
2. The dashboard shows recently reported incidents, plus counts of in-progress and resolved reports.
3. Report a new incident with a title, description, type, location (map picker or manual coordinates), and optional photos/videos.
4. Track the status of your reports and get notified as they're updated.
5. Admins have access to a separate dashboard for moderating incidents, updating statuses, and managing users.

## Contributors
=======
# AJALI PROJECT

Ajali is a web based application that is used to report any form iof accident and emergency that occurs to the appropriate authorities and also to the general public.

## Technologies used

Frontend

- React Js
- Redux Toolkit

Wireframes

- Figma

Testing Framework

- Jest
- Minitests

Database

- PostgreSQl

Backend

- python Flask

## Installation
The project is first cloned to you local machine and then npm install should be ran in order to install all the required dependencies in that folder.
Npm start is then inputted in the terminal to run the project locally.

## Usage
Once you enter the website, you will have to register an account and login to that same account to gain access to the web application.
The home page will show you the recently posted accidents and emergency reports. it will also show the total number of reports in progress and the ones
resolved. It is here where you can post any emergency that you have encountered.

## Contribution
>>>>>>> 1ce6bf9 (Updated README with project details)

- Keith Kamau
- Newton Mwangi
- Ian Kinoti
<<<<<<< HEAD
- John Kingoo
=======
- John King'oo

>>>>>>> 1ce6bf9 (Updated README with project details)
