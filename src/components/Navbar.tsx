import { useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-[#E5EAF2] z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0052FF] flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-xl font-semibold text-[#1A1A1A]">TimeSense</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "text-[#0052FF] font-medium" : "text-[#6B7280] hover:text-[#0052FF] transition-colors"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/calendars"
              className={({ isActive }) =>
                isActive ? "text-[#0052FF] font-medium" : "text-[#6B7280] hover:text-[#0052FF] transition-colors"
              }
            >
              Calendars
            </NavLink>
            <NavLink
              to="/appointments"
              className={({ isActive }) =>
                isActive ? "text-[#0052FF] font-medium" : "text-[#6B7280] hover:text-[#0052FF] transition-colors"
              }
            >
              Appointments
            </NavLink>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <NavLink
              to="/calendars/new"
              className="bg-[#0052FF] text-white px-4 py-2 rounded-lg hover:bg-[#0046E0] transition-colors"
            >
              Create Calendar
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            data-testid="mobile-menu-button"
            className="md:hidden p-2 text-[#6B7280]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div data-testid="mobile-menu" className="md:hidden py-4 border-t border-[#E5EAF2]">
            <div className="flex flex-col gap-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "text-[#0052FF] font-medium" : "text-[#6B7280] hover:text-[#0052FF] transition-colors"
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/calendars"
                className={({ isActive }) =>
                  isActive ? "text-[#0052FF] font-medium" : "text-[#6B7280] hover:text-[#0052FF] transition-colors"
                }
              >
                Calendars
              </NavLink>
              <NavLink
                to="/appointments"
                className={({ isActive }) =>
                  isActive ? "text-[#0052FF] font-medium" : "text-[#6B7280] hover:text-[#0052FF] transition-colors"
                }
              >
                Appointments
              </NavLink>
              <div className="flex flex-col gap-2 pt-4 border-t border-[#E5EAF2]">
                <NavLink to="/calendars/new" className="bg-[#0052FF] text-white px-4 py-2 rounded-lg hover:bg-[#0046E0] transition-colors w-full text-center">
                  Create Calendar
                </NavLink>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}