# Courier & Parcel Management System - Frontend

This is the frontend for the Courier & Parcel Management System, built with Next.js (App Router), TypeScript, Tailwind CSS, Redux Toolkit, and Axios. It provides a responsive UI for customers, agents, and admins to manage parcels, track deliveries in real-time, and view analytics.

## Features

- **Authentication**: Register/login with role-based access (customer, agent, admin).
- **Parcel Management**: Book parcels, view booking history, and track parcels in real-time (via Google Maps API).
- **Real-Time Updates**: Socket.IO for live parcel status updates.
- **Theme Toggling**: Light/dark mode support using Redux and Tailwind CSS.
- **Responsive UI**: Tailwind CSS for a polished, mobile-first design.
- **API Integration**: Axios for communication with the backend (`/api/health`, etc.).
- **Testing**: Jest and React Testing Library for unit and UI tests.

## Tech Stack

- **Next.js**: React framework with App Router for server-side rendering and static generation.
- **TypeScript**: Strict typing for robust code.
- **Tailwind CSS**: Utility-first CSS for responsive and themed UI.
- **Redux Toolkit**: State management for auth and theme.
- **Axios**: HTTP client for API calls.
- **Socket.IO**: Real-time updates (to be implemented).
- **Jest/React Testing Library**: Unit and UI testing.

## Prerequisites

- Node.js (>=18.x)
- Backend server running (e.g., at `http://localhost:5000`)

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone <frontend-repo-url>
   cd c_pms-frontend
   ```
