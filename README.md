# Gật Gù - React Application

A professional React application for driver drowsiness detection and monitoring.

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx          # Navigation bar with variants
│   │   ├── Footer.jsx          # Footer component
│   │   └── Sidebar.jsx         # Sidebar for driver dashboard
│   ├── ui/
│   │   ├── Button.jsx          # Reusable button component
│   │   ├── Card.jsx            # Card wrapper component
│   │   ├── Input.jsx           # Input field with icon support
│   │   └── Badge.jsx           # Status badge component
│   └── monitoring/
│       └── (future components)
├── pages/
│   ├── LandingPage.jsx         # Marketing homepage
│   ├── RegistrationStep1.jsx   # User registration
│   ├── VehicleSetup.jsx        # Vehicle setup (step 3)
│   ├── MonitoringDashboard.jsx # Real-time monitoring
│   └── DriverDashboard.jsx     # Driver statistics
├── styles/
│   └── index.css               # Global styles
├── App.jsx                     # Main app with routing
└── main.jsx                    # Entry point
```

## Tech Stack

- **React 18** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Build tool
- **Material Icons** - Icon library

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Routes

- `/` - Landing page
- `/registration` - Registration step 1
- `/vehicle-setup` - Vehicle setup (step 3)
- `/monitoring` - Monitoring dashboard
- `/driver-dashboard` - Driver dashboard

## Features

- ✅ Dark mode support
- ✅ Responsive design
- ✅ Reusable components
- ✅ Clean component structure
- ✅ Professional UI/UX
- ✅ No over-engineering
