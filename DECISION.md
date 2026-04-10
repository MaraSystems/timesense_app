# Architecture Decision Records

This document records significant architectural and design decisions made during the development of TimeSense.

## Table of Contents

1. [gRPC-Web with Connect Protocol](#1-grpc-web-with-connect-protocol)
2. [React Context for Authentication](#2-react-context-for-authentication)
3. [TailwindCSS for Styling](#3-tailwindcss-for-styling)
4. [date-fns for Date Handling](#4-date-fns-for-date-handling)
5. [Slot-Based Time Selection](#5-slot-based-time-selection)
6. [Monthly Slot Pagination](#6-monthly-slot-pagination)
7. [Rebooking Flag for Invalidated Appointments](#7-rebooking-flag-for-invalidated-appointments)
8. [Model Layer for Data Transformation](#8-model-layer-for-data-transformation)
9. [Protected Route Component](#9-protected-route-component)
10. [Logout Interceptor Pattern](#10-logout-interceptor-pattern)

---

## 1. gRPC-Web with Connect Protocol

**Date**: Early Development

**Status**: Accepted

### Context
The application needs to communicate with a backend API that uses gRPC. The frontend runs in a browser environment where standard gRPC is not supported.

### Decision
We use **gRPC-Web with Connect protocol** (`@connectrpc/connect` and `@connectrpc/connect-web`) for browser-to-server communication.

### Rationale
- Connect protocol is designed for browser environments
- Supports streaming and unary RPCs
- Generates TypeScript types from protobuf definitions
- Simpler than traditional gRPC-Web with better TypeScript integration
- Interceptor support for auth token injection

### Consequences
- Requires protobuf code generation (`buf.gen.yaml`)
- All API calls return strongly-typed responses
- Error handling must account for gRPC status codes

---

## 2. React Context for Authentication

**Date**: Early Development

**Status**: Accepted

### Context
The application needs to manage user authentication state across multiple components and handle automatic logout on token expiration.

### Decision
We use **React Context** with `AuthProvider` and `useAuth` hook for authentication state management.

### Rationale
- Simple and lightweight for this use case
- No need for additional state management libraries
- Easy to integrate with protected routes
- Supports custom events for logout handling

### Consequences
- Auth state is stored in `localStorage` for persistence
- Custom `auth:logout` event triggers context update across components
- All protected routes wrapped in `<AuthProvider>`

---

## 3. TailwindCSS for Styling

**Date**: Early Development

**Status**: Accepted

### Context
The application needs a consistent design system with rapid UI development capabilities.

### Decision
We use **TailwindCSS v4** with inline utility classes for styling.

### Rationale
- Rapid prototyping with utility classes
- Consistent design tokens (colors, spacing)
- No separate CSS files to maintain
- Excellent integration with React components
- Built-in responsive utilities

### Consequences
- Long class strings in JSX (mitigated by component abstraction)
- Design tokens defined inline (colors like `#0052FF`, `#F7F9FC`)
- Consistent look across all pages

---

## 4. date-fns for Date Handling

**Date**: Early Development

**Status**: Accepted

### Context
The application heavily manipulates dates for calendar and appointment functionality, including time zone handling and formatting.

### Decision
We use **date-fns** for all date operations.

### Rationale
- Modular (import only needed functions)
- Immutable operations
- Excellent TypeScript support
- Comprehensive formatting options
- Handles edge cases (timezone, locale)

### Consequences
- Consistent date formatting across the app
- `format()`, `parseISO()`, `startOfMonth()`, `endOfMonth()` used extensively
- Weekday calculations use JavaScript standard (0 = Sunday)

---

## 5. Slot-Based Time Selection

**Date**: During Appointment Booking Development

**Status**: Accepted

### Context
Users need to select time slots when booking appointments. Initially, we considered allowing arbitrary time selection.

### Decision
We implemented **slot-based time selection** where users select from predefined slots based on the calendar's slot duration.

### Rationale
- Ensures appointments align with calendar availability
- Prevents overlapping bookings
- Simplifies time validation
- Calendar owner defines slot duration (15, 30, 45, or 60 minutes)
- Consistent experience across one-time and recurring appointments

### Consequences
- Time selection UI uses Select dropdowns with pre-calculated slots
- Recurring appointments use the same slot duration as one-time bookings
- Backend handles slot availability checking

---

## 6. Monthly Slot Pagination

**Date**: During Slot Display Development

**Status**: Accepted

### Context
Fetching all slots for an appointment's entire lifetime could result in large payloads and performance issues.

### Decision
We implemented **monthly pagination** for slot display using `liveAt` and `expireAt` query parameters.

### Rationale
- Reasonable chunk size for UI display
- Allows navigation between months
- Backend uses cursor-based pagination with `next` flag
- Frontend prevents navigation beyond appointment date range

### Consequences
- Month navigation with previous/next buttons
- Slots grouped by date within month view
- Visual distinction for past, today, and future slots

---

## 7. Rebooking Flag for Invalidated Appointments

**Date**: During Calendar Update Feature

**Status**: Accepted

### Context
When a calendar is updated (e.g., working days or hours changed), existing appointments may no longer align with the new availability schedule.

### Decision
We implemented a **`rebook` flag** on appointments that are invalidated by calendar updates.

### Rationale
- Clear visual indicator for users (red warning banner)
- Does not auto-cancel appointments
- Allows user to manually rebook or update
- Prevents silent data inconsistency

### Consequences
- Appointment cards show "Rebook required!" warning
- View appointment page has dedicated rebooking section
- Booker (appointment creator) can edit or delete

---

## 8. Model Layer for Data Transformation

**Date**: Early Development

**Status**: Accepted

### Context
Protobuf types from the generated code use BigInt for IDs and Timestamps for dates. The UI needs string IDs and ISO date strings.

### Decision
We created a **model layer** with `to*Display()` transformation functions.

### Rationale
- Clean separation between API types and UI types
- Centralized transformation logic
- Consistent handling of BigInt → string conversion
- Consistent handling of Timestamp → ISO string conversion

### Consequences
- All components use `*Display` types (e.g., `AppointmentDisplay`, `CalendarDisplay`)
- Services return transformed data
- Easy to debug data issues

---

## 9. Protected Route Component

**Date**: During Routing Implementation

**Status**: Accepted

### Context
Many routes require authentication. We need to redirect unauthenticated users to the login page.

### Decision
We created a **`ProtectedRoute`** wrapper component that checks authentication status.

### Rationale
- Declarative route protection
- Redirects to login with return URL preservation
- Shows loading state during auth check
- Reusable across all protected routes

### Consequences
- All protected routes wrapped in `<ProtectedRoute>`
- Clean route definitions in `App.tsx`
- Consistent auth behavior

---

## 10. Logout Interceptor Pattern

**Date**: During Auth Refinement

**Status**: Accepted

### Context
When the backend returns a 401 Unauthorized response, the client should automatically log out the user.

### Decision
We implemented a **logout interceptor** in the API client that listens for authentication errors.

### Rationale
- Centralized error handling
- Automatic cleanup of auth tokens
- Uses custom events to notify React context
- Prevents stale auth state

### Consequences
- Interceptor dispatches `auth:logout` event
- `AuthProvider` listens and updates state
- User redirected to login page
- LocalStorage cleared automatically

---

## Future Considerations

### State Management Library
If application state complexity grows, consider adding:
- React Query for server state caching
- Zustand for client state

### Real-time Updates
For appointment availability:
- WebSockets for live slot updates
- Optimistic UI updates for booking

### Internationalization
- Add i18n support for multiple languages
- Timezone-aware scheduling