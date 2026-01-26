# Jones County XC

A web application with a React frontend and Go backend.

## Project Structure

```
jones-county-xc/
├── frontend/     # React app (Vite + Tailwind CSS)
├── backend/      # Go HTTP server
├── docs/         # Documentation
└── README.md
```

## Frontend

The frontend is built with React, Vite, and Tailwind CSS.

### Running the frontend

```bash
cd frontend
npm install
npm run dev
```

The development server runs on http://localhost:5173

### Building for production

```bash
npm run build
```

## Backend

The backend is a Go HTTP server with basic API endpoints.

### Prerequisites

- Go 1.21 or later

### Running the backend

```bash
cd backend
go run main.go
```

The server runs on http://localhost:8080

### API Endpoints

- `GET /api/health` - Health check
- `GET /api/hello` - Hello message

## Development

Run both frontend and backend simultaneously for local development. The frontend runs on port 5173 and the backend on port 8080.
