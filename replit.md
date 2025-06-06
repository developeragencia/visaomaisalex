# Visão+ Web Application

## Overview

Visão+ is a web application for an optical service provider with multiple franchises. It allows users to schedule eye consultations, make optical measurements, access membership benefits, and manage franchises. The application has three user types:
1. Clients - can schedule appointments, make optical measurements, and view their membership cards
2. Franchisees - can manage appointments, view analytics, and handle inventory
3. Administrators - can oversee all franchises and manage the platform

The application is built with a modern tech stack including React, Express, and Drizzle ORM, following a client-server architecture with a shared schema definition.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is built with React and follows a component-based architecture. It uses:

- **React** for UI rendering with functional components and hooks
- **Wouter** for client-side routing (lightweight alternative to React Router)
- **TanStack Query** for data fetching, caching, and state management
- **Shadcn UI** for component library and styling
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for animations
- **Progressive Web App (PWA)** capabilities with service workers

The application is responsive and works well on both mobile and desktop devices, with dedicated mobile navigation components.

### Backend Architecture

The backend is built with:

- **Express.js** for the API server
- **Drizzle ORM** for database access
- **Passport.js** for authentication
- **Session-based authentication** with PostgreSQL session store
- **Crypto** module for secure password hashing

The server follows a RESTful API design pattern and serves both the API endpoints and the static frontend assets in production.

### Data Flow

1. The client makes API requests to the server
2. The server authenticates the request using Passport.js and sessions
3. The server processes the request using the appropriate route handler
4. Database operations are performed using Drizzle ORM
5. The server returns the response to the client
6. React Query handles client-side caching and state updates

## Key Components

### Schema Definition

The database schema is defined in `shared/schema.ts` and includes:

- Users table: Stores user information and authentication details
- Franchises table: Stores information about optical store franchises
- Plans table: Defines membership plans and their benefits
- User Plans table: Manages the relationship between users and their plans
- Appointments table: Tracks scheduled appointments
- Measurements table: Stores optical measurement results
- Products and Inventory tables: Manage product catalog and availability

### Authentication System

- Uses Passport.js with a local strategy
- Session-based authentication with PostgreSQL session store
- Secure password hashing with scrypt
- User roles (client, franchisee, admin) determine access control

### Client Dashboard

- Displays plan usage statistics
- Shows upcoming appointments
- Provides quick access to key features like appointment scheduling and optical measurements

### Optical Measurement Feature

Allows users to:
- Take measurements using their device camera
- View measurement history
- Compare results over time

### Appointment System

- Schedule new appointments
- Select franchise locations
- Choose appointment types and time slots
- View and manage existing appointments

### Membership Management

- Display digital membership card
- Show membership benefits and usage
- Compare available plans

### Admin and Franchisee Dashboards

- Analytics and reporting
- User management
- Franchise approval workflows
- Inventory management

## External Dependencies

### Frontend Dependencies

- React ecosystem (react, react-dom)
- Styling: tailwindcss, shadcn/ui components
- Routing: wouter
- Data fetching: @tanstack/react-query
- Forms: react-hook-form, zod (validation)
- UI components: radix-ui components
- Animations: framer-motion
- Date handling: date-fns

### Backend Dependencies

- Express for server
- Drizzle ORM for database operations
- Passport.js for authentication
- Crypto for password hashing
- Session management: express-session, connect-pg-simple

### Database

- PostgreSQL database (via Neon serverless Postgres)
- Drizzle ORM for type-safe database operations
- Database connection through @neondatabase/serverless

## Deployment Strategy

The application is configured for deployment on Replit with:

1. **Development Mode**:
   - Uses vite's development server for hot module replacement
   - Runs with `npm run dev` command

2. **Production Build**:
   - Frontend: Vite builds static assets to `dist/public`
   - Backend: esbuild bundles the server code to `dist/index.js`
   - Combined with `npm run build` command

3. **Production Runtime**:
   - Serves static assets from the build directory
   - Runs the bundled server with `npm run start`

4. **Environment Variables**:
   - DATABASE_URL: Connection string for PostgreSQL database
   - SESSION_SECRET: Secret for session encryption
   - NODE_ENV: Environment setting (development/production)

## Progressive Web App (PWA) Features

The application is designed as a Progressive Web App with:
- Service worker for caching and offline support
- Web app manifest for installation capabilities
- Responsive design for all device sizes
- Custom icons and splash screens

## Next Steps for Development

1. Complete implementation of the appointment scheduling system
2. Finalize the optical measurement feature using device camera
3. Implement inventory management for franchisees
4. Add product catalog and e-commerce capabilities
5. Enhance analytics dashboards for admins and franchisees
6. Add notifications system for appointments and membership status