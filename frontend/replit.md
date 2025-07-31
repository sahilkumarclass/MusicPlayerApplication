# Music Player Application

## Overview

This is a full-stack music streaming application built with React on the frontend and Express.js on the backend. The application allows users to register, authenticate, upload songs, create favorites, and stream music. It features an admin panel for content management and user administration.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React Context API for authentication and audio playback state
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with shadcn/ui components
- **UI Components**: Radix UI primitives with custom theming

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: In-memory storage with fallback support for PostgreSQL sessions
- **Authentication**: Simple session-based authentication (no external providers)
- **File Serving**: Static file serving for audio files and cover images

### Build System
- **Frontend Build**: Vite for development and production builds
- **Backend Build**: ESBuild for server-side bundling
- **Development**: Concurrent development server with hot module replacement

## Key Components

### Database Schema
- **Users Table**: Stores user credentials, roles (USER/ADMIN), and account status
- **Songs Table**: Stores song metadata including title, artist, album, genre, file URLs, and play counts
- **Favorites Table**: Junction table linking users to their favorite songs

### Authentication System
- Session-based authentication with role-based access control
- Support for both username and email login
- Admin role for content management and user administration

### Audio Playback System
- Custom audio context for managing playback state
- Support for play/pause, seeking, volume control, and playback modes
- Shuffle and repeat functionality
- Real-time progress tracking

### Admin Features
- Song upload and management
- User administration (activate/deactivate, delete users)
- Dashboard with system statistics
- Content moderation capabilities

## Data Flow

1. **User Authentication**: Users register/login through forms, sessions stored server-side
2. **Song Management**: Admins upload songs with metadata, files served statically
3. **Playback**: Audio context manages HTML5 audio element, tracks current song and state
4. **Favorites**: Users can add/remove favorites, stored in junction table
5. **Search**: Real-time search across song titles, artists, and albums

## External Dependencies

### Frontend Dependencies
- React ecosystem (React, React DOM, React Router via Wouter)
- TanStack Query for data fetching
- Radix UI for accessible components
- Tailwind CSS for styling
- Lucide React for icons

### Backend Dependencies
- Express.js for server framework
- Drizzle ORM with PostgreSQL adapter
- Neon Database serverless driver
- Connect-pg-simple for session storage
- Various Express middleware for parsing and security

### Development Dependencies
- Vite for frontend tooling
- TypeScript for type safety
- ESBuild for backend bundling
- PostCSS and Autoprefixer for CSS processing

## Deployment Strategy

### Production Build
- Frontend built to `dist/public` directory
- Backend bundled to `dist/index.js`
- Static assets served from built frontend

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Automatic database provisioning check in Drizzle config
- Support for both development and production environments

### Replit Integration
- Configured for Node.js 20 runtime
- PostgreSQL 16 module enabled
- Auto-scaling deployment target
- Port 5000 for development, port 80 for production

## Changelog
- June 23, 2025. Initial setup - Complete music player frontend with user/admin roles
- June 23, 2025. Removed mock API data, ready for Spring Boot backend integration
- June 23, 2025. Added Spring Boot API endpoints - health check, cache stats, rate limiting, song upload, user favorites
- June 23, 2025. Completed Spring Boot API integration - added all controller endpoints, fixed routing conflicts, removed welcome endpoint

## User Preferences

Preferred communication style: Simple, everyday language.