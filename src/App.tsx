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
            <Route path="/appointments" element={<NotFound />} />
            <Route path="/appointments/new" element={<NotFound />} />
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