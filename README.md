# SFA Web Dashboard

React-based web dashboard for managing sales operations, customer relationships, and field team activities. Built as part of a portfolio Sales Force Automation (SFA) project.

## About

This is a portfolio project showcasing a field sales management system with integrated CRM capabilities. The dashboard provides managers and administrators with tools to monitor sales activities, manage customer interactions, approve journeys, and track visit metrics across distributed teams.

## Tech Stack

- **React 18** with Vite
- **Redux Toolkit** for state management (authentication)
- **React Router v6** for navigation
- **Axios** for API communication
- **Bootstrap 5** + custom utility classes for styling
- **SweetAlert2** for alerts and confirmations
- **Iconify** (@iconify/react) for icon management

## Features

- **Authentication** — Token-based login with session persistence
- **Dashboard** — Visit summary, monthly trends, KPI charts
- **Customer Management** — Outlet registry with multi-step approval workflow, interaction history
- **Visit Reports** — Paginated visit log with detailed modal view per visit
- **Journey Planning** — Create and approve sales routes with status tracking
- **User Management** — Company-scoped user list, role assignment with hierarchy system
- **CRM Interaction Log** — Global interaction tracking per outlet with filters and create/edit/delete actions

## Local Setup

### Requirements

- Node.js 18+
- Backend running at `http://localhost:8000`

### Installation

1. Clone the repository and navigate to the directory:
   ```bash
   cd sfa-frontend-web
   ```

2. Copy environment configuration:
   ```bash
   cp .env.example .env
   ```

3. Configure `.env`:
   ```
   VITE_API_URI=http://localhost:8000/api/v2
   VITE_STORAGE_URI=http://localhost:8000/storage
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

   Dashboard will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Authentication

The dashboard uses token-based authentication (Laravel Sanctum). Tokens are stored in browser `localStorage` and automatically included in API requests. Protected routes redirect unauthenticated users to the login page.

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URI` | Backend API base URL | `http://localhost:8000/api/v2` |
| `VITE_STORAGE_URI` | File storage base URL | `http://localhost:8000/storage` |

## Backend Integration

This dashboard requires the accompanying Laravel backend (`sfa-backend`) running with the API v2 endpoints at `/api/v2/*`. Refer to the backend repository for setup instructions.

## License

Portfolio project. Not intended for commercial use.
