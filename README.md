# MySales — Web Dashboard

React-based management dashboard for MySales, a Field Sales CRM (SFA + CRM) for FMCG/distribution companies. Gives managers and administrators a centralized view of field operations, customer relationships, and team performance.

## System Overview

MySales is a three-repo portfolio project: a Laravel REST API backend, this React web dashboard for managers, and a React Native iOS app for field sales staff. The dashboard consumes the backend API (`/api/v2/`) with Sanctum token authentication and covers the full management workflow — from approving customer registrations and journey plans to reviewing individual visit records and tracking follow-up commitments with field staff.

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | React 18 + Vite |
| State Management | Redux Toolkit |
| Routing | React Router v6 |
| HTTP Client | Axios |
| UI / Styling | Bootstrap 5 + custom utility classes |
| Alerts | SweetAlert2 |
| Icons | Iconify (`@iconify/react`) |

## Feature Overview

**Dashboard & Reporting**
- KPI summary cards: total visits, active customers, pending approvals
- Monthly visit trend charts
- Visit log with paginated results and a per-visit detail modal (stocks, selling out, pre-orders, competitor data)
- Excel export for visit reports

**Customer Management**
- Outlet registry with multi-step registration approval workflow (salesman → supervisor → manager)
- Interaction history tab per customer in the detail modal
- One-click access to the Customer 360 page from the customer table

**Journey Planning**
- Create and view sales route plans
- Approval workflow with status tracking (pending / approved / rejected / completed)

**User & Role Management**
- Company-scoped user list — managers only see users within their company subtree and descendant roles
- Inline role assignment with hierarchy enforcement (cannot assign a role equal to or above your own)
- Add new user form with company and role selection

**CRM Section**
The CRM section is the primary differentiator from a standard SFA system:

- **Interaction Logs** — Full log of every customer interaction: visit notes, objections raised, follow-up dates, and resolution status. Filterable by status, date range, and customer name. Create, edit, and delete actions with role-based authorization.
- **Customer 360** — A dedicated page per outlet aggregating all available data in one view: customer profile, pre-order summary, last 20 visits with drill-down, and complete interaction history.
- **Follow-up Reminder** — A consolidated view of all open interaction logs with a `follow_up_date` on or before today. Color-coded rows: red for overdue, yellow for due today. Clicking a row navigates to the Customer 360 page. Follow-ups are automatically closed when the salesman checks in at that outlet.

## Local Setup

### Requirements

- Node.js 18+
- Backend (`sfa-backend`) running at `http://localhost:8000`

### Installation

```bash
git clone https://github.com/Jovfrinn/sfa-frontend-web.git
cd sfa-frontend-web

cp .env.example .env
```

Edit `.env`:

```
VITE_API_URI=http://localhost:8000/api/v2
VITE_STORAGE_URI=http://localhost:8000/storage
```

```bash
npm install
npm run dev
# Dashboard available at http://localhost:5173
```

### Build for Production

```bash
npm run build
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URI` | Backend API base URL | `http://localhost:8000/api/v2` |
| `VITE_STORAGE_URI` | File storage base URL | `http://localhost:8000/storage` |

Note: the variable names are `VITE_API_URI` and `VITE_STORAGE_URI` — not `VITE_API_URL` or `VITE_STORAGE_URL`.

## Authentication

Login uses username + password. On success, the backend returns a Sanctum Bearer token which is stored in browser `localStorage`. All subsequent API requests attach the token automatically via an Axios request interceptor. Protected routes redirect unauthenticated users to the login page.

## Project Structure

```
src/
├── components/
│   ├── crm/              # InteractionLogModal, InteractionLogTable,
│   │                     # InteractionLogList, Customer360VisitList
│   ├── customer/         # CustomerTable, CustomerModalDetail
│   └── ...               # Shared layout, form, and UI components
├── pages/
│   ├── crm/              # InteractionLogPage, Customer360Page, FollowUpPage
│   ├── master/           # CustomerPage, UserManagementPage
│   ├── report/           # VisitReportPage
│   └── ...
├── routes/
│   └── appRoutes.jsx     # Route definitions
├── redux/                # Auth slice (Redux Toolkit)
└── config/               # API base URL helpers
```

## Key Routes

| Path | Description |
|------|-------------|
| `/` | Login |
| `/dashboard` | KPI summary and charts |
| `/master/customers` | Customer/outlet management |
| `/master/users` | User management with role assignment |
| `/report/visits` | Paginated visit log |
| `/crm/interaction-logs` | Full interaction log with filters |
| `/crm/customer/:id` | Customer 360 page |
| `/crm/follow-up` | Follow-up reminder list |
| `/journey-plan` | Journey plan management |

## Screenshots

Screenshots of the dashboard, CRM section, and Customer 360 page are available in the project portfolio documentation.

## Related Repositories

- [sfa-backend](https://github.com/Jovfrinn/sfa-backend) — Laravel REST API (required dependency)
- [sfa-frontend-mobile](https://github.com/Jovfrinn/sfa-frontend-mobile) — React Native iOS app for field sales staff

## License

Portfolio project. Not intended for commercial use.
