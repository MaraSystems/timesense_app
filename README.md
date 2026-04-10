# TimeSense

TimeSense is a modern appointment scheduling application that enables users to create calendars and manage appointments with support for one-time and recurring bookings.

## Overview

TimeSense allows users to:
- Create and manage availability calendars
- Book one-time or recurring appointments (weekly/monthly)
- View appointment slots by month
- Manage appointments with edit and delete capabilities
- Share calendar links for easy booking

## Tech Stack

### Frontend
- **React 19** - UI framework with TypeScript
- **Vite** - Build tool and dev server
- **TailwindCSS v4** - Utility-first CSS framework
- **React Router v7** - Client-side routing
- **date-fns** - Date manipulation and formatting
- **React Icons** - Icon library
- **React Toastify** - Toast notifications

### API & Communication
- **gRPC-Web / Connect** - Protocol for API communication
- **@connectrpc/connect** - Connect client library
- **Protocol Buffers** - Data serialization

### Testing
- **Cypress** - End-to-end testing framework

## Project Structure

```
src/
├── auth/                    # Authentication context and logic
│   └── AuthContext.tsx
├── components/              # Reusable UI components
│   ├── AppointmentCard.tsx
│   ├── Button.tsx
│   ├── CalendarGrid.tsx
│   ├── Checkbox.tsx
│   ├── DateFilterPanel.tsx
│   ├── Delete.tsx
│   ├── Features.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── Input.tsx
│   ├── Loading.tsx
│   ├── Navbar.tsx
│   ├── PasswordInput.tsx
│   ├── ProtectedRoute.tsx
│   └── Select.tsx
├── gen/                     # Generated protobuf types
├── models/                  # Data models and transformations
│   ├── appointment.ts
│   ├── calendar.ts
│   └── user.ts
├── pages/                   # Route components
│   ├── Appointments.tsx
│   ├── CalendarAppointments.tsx
│   ├── CalendarView.tsx
│   ├── Calendars.tsx
│   ├── EditAppointment.tsx
│   ├── EditCalendar.tsx
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── NewAppointment.tsx
│   ├── NewCalendar.tsx
│   ├── NotFound.tsx
│   ├── Register.tsx
│   └── ViewAppointment.tsx
├── services/                 # API service layer
│   ├── api.ts
│   ├── appointment.service.ts
│   ├── calendar.service.ts
│   └── user.service.ts
├── utils/                   # Utility functions
│   ├── calendar.ts
│   └── share.ts
├── validator/               # Form validation
│   └── appointmentValidator.ts
├── App.tsx                  # Root component
└── main.tsx                 # Entry point
```

## Features

### Calendar Management
- Create calendars with customizable availability windows
- Define working days (weekday selection)
- Set slot durations (15, 30, 45, or 60 minutes)
- Set active period (live date to expire date)
- Edit and delete calendars
- Share calendar booking links

### Appointment Management
- Book one-time or recurring appointments
- Support for weekly and monthly recurrence
- Day selection for recurring appointments
- Month selection for annual patterns
- View appointment details with slot listings
- Edit and delete appointments
- Rebooking indicator when calendar changes invalidate appointments

### Slot Management
- Monthly paginated slot view
- Visual distinction between:
  - Past slots (muted with strikethrough)
  - Today's slots (highlighted)
  - Future slots (normal appearance)
  - Booked vs available slots

### Authentication
- User registration and login
- JWT token-based authentication
- Automatic logout on token expiration
- Protected routes

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

### Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8080
```

## API Architecture

The frontend communicates with a gRPC backend using the Connect protocol:

- **Transport**: gRPC-Web transport for browser compatibility
- **Interceptors**:
  - Auth interceptor: Attaches JWT token to requests
  - Logout interceptor: Handles 401 responses and triggers logout

## Design System

### Colors
- **Primary Blue**: `#0052FF`
- **Success Green**: `#10B981`
- **Warning Orange**: `#F59E0B`
- **Error Red**: `#FF4D4F`
- **Background**: `#F7F9FC`
- **Surface**: `#FFFFFF`
- **Border**: `#E5EAF2`

### Typography
- Primary text: `#1A1A1A`
- Secondary text: `#6B7280`
- Disabled text: `#9CA3AF`

### Components
- Rounded corners (12px for cards, 8px for inputs)
- Subtle shadows for depth
- Responsive grid layouts
- Toast notifications for user feedback

## Testing

Run Cypress tests:

```bash
# Interactive mode
npm run test:ui

# Headless mode
npm run test
```

## License

MIT