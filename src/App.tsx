import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AuthProvider } from "./auth"
import { Home } from "./pages/Home"
import { NotFound } from "./pages/NotFound"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/calendars" element={<NotFound />} />
            <Route path="/calendars/new" element={<NotFound />} />
            <Route path="/calendars/:id" element={<NotFound />} />
            <Route path="/appointments" element={<NotFound />} />
            <Route path="/appointments/new" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App