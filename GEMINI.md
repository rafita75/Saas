# Project Overview: SaaS Multi-tenant Platform

This project is a multi-tenant Software as a Service (SaaS) platform designed with a modular architecture. It allows multiple businesses (tenants) to operate independently on the same infrastructure, each with its own subdomain and isolated data.

## Architecture

The project is divided into two main parts:
- **Backend**: A Node.js/Express API with MongoDB (Mongoose).
- **Frontend**: A React application built with Vite and Tailwind CSS.

Both parts follow a **Core vs. Modules** architecture:
- `core/`: Contains the foundational logic (Authentication, Tenant management, Base middleware/components).
- `modules/`: (Planned/In-progress) Intended for specific business features that can be enabled per tenant.

## Technologies

### Backend
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Security**: JWT for authentication, Bcrypt for password hashing, Helmet for header security, and Express Rate Limit.
- **Multi-tenancy**: Subdomain-based tenant resolution (`tenant.domain.com`) or via `x-tenant-slug` header.

### Frontend
- **Framework**: React 19 (Vite)
- **Routing**: React Router DOM 7
- **Styling**: Tailwind CSS 4
- **State/Forms**: React Hook Form with Zod validation
- **API Client**: Axios

## Building and Running

### Prerequisites
- Node.js (Latest LTS recommended)
- MongoDB instance (Local or Atlas)

### Backend Setup
1. Navigate to the `backend` directory.
2. Install dependencies: `npm install`
3. Create a `.env` file based on the required configuration:
   - `MONGODB_URI`: Your MongoDB connection string.
   - `PORT`: Server port (default: 3000).
   - `JWT_SECRET`: Secret key for token signing.
4. Run in development: `npm run dev`
5. Run in production: `npm start`

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`
3. Run in development: `npm run dev` (Runs on `http://localhost:5173`)
4. Build for production: `npm run build`

## Development Conventions

### Multi-tenancy Logic
- The backend identifies tenants via the `tenantResolver` middleware.
- The `req.tenant` object is populated with the current business context.
- Frontend uses subdomains (e.g., `admin.localhost`) to distinguish between the main landing page and the tenant-specific dashboard.

### Routing
- **Main Domain**: Handles landing, login, and registration.
- **Admin Subdomain**: Handles onboarding (`/:slug/onboarding`) and the dashboard (`/:slug/dashboard`).

### Code Style
- Use ESM (ECMAScript Modules) in both backend and frontend.
- Backend routes should be registered in `src/core/routes/index.js`.
- Frontend components are organized by feature within `src/core` and `src/shared`.

## Key Files
- `backend/app.js`: Entry point for the Express API.
- `backend/src/core/middleware/tenant.middleware.js`: Core logic for tenant resolution.
- `frontend/src/App.jsx`: Main routing logic for the React application.
- `frontend/src/config/domains.js`: Domain configuration for different environments.
