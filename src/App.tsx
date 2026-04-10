import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { AuthProvider } from "./auth"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { Home } from "./pages/Home"
import { NotFound } from "./pages/NotFound"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { Calendars } from "./pages/Calendars"
import { CalendarView } from "./pages/CalendarView"
import { EditCalendar } from "./pages/EditCalendar"
import { NewCalendar } from "./pages/NewCalendar"
import { NewAppointment } from "./pages/NewAppointment"
import { Appointments } from "./pages/Appointments"
import { ViewAppointment } from "./pages/ViewAppointment"
import { EditAppointment } from "./pages/EditAppointment"
import { CalendarAppointments } from "./pages/CalendarAppointments"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/calendars"
              element={
                <ProtectedRoute>
                  <Calendars />
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendars/new"
              element={
                <ProtectedRoute>
                  <NewCalendar />
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendars/:id"
              element={
                <ProtectedRoute>
                  <CalendarView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendars/:id/edit"
              element={
                <ProtectedRoute>
                  <EditCalendar />
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendars/:id/appointments"
              element={
                <ProtectedRoute>
                  <CalendarAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments/new"
              element={
                <ProtectedRoute>
                  <NewAppointment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments"
              element={
                <ProtectedRoute>
                  <Appointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments/:id"
              element={
                <ProtectedRoute>
                  <ViewAppointment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments/:id/edit"
              element={
                <ProtectedRoute>
                  <EditAppointment />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </AuthProvider>
  )
}

export default App