import { useAuth } from "../auth"
import { Navbar } from "../components/Navbar"
import { Hero } from "../components/Hero"
import { Features } from "../components/Features"
import { Footer } from "../components/Footer"

export function Home() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <Navbar isAuthenticated={isAuthenticated} />
      <main>
        <Hero isAuthenticated={isAuthenticated} />
        <Features />
      </main>
      <Footer />
    </div>
  )
}