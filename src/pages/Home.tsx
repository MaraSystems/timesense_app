import { Navbar } from "../components/Navbar"
import { Hero } from "../components/Hero"
import { Features } from "../components/Features"
import { Footer } from "../components/Footer"

export function Home() {
  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <Navbar />
      <main>
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  )
}