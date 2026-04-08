import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Home } from "./pages/Home"
import { NotFound } from "./pages/NotFound"

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calendars" element={<NotFound />} />
          <Route path="/calendars/new" element={<NotFound />} />
          <Route path="/calendars/:id" element={<NotFound />} />
          <Route path="/appointments" element={<NotFound />} />
          <Route path="/appointments/new" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
