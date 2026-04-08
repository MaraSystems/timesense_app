import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { HiOutlineMenu, HiOutlineX, HiOutlineLogout, HiOutlineUser } from "react-icons/hi"
import { useAuth } from "../auth"

interface NavbarProps {
  isAuthenticated: boolean
}

export function Navbar({ isAuthenticated }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
    setIsMenuOpen(false)
  }

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
            {isAuthenticated && (
              <>
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
              </>
            )}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 text-[#6B7280]">
                  <HiOutlineUser className="w-5 h-5" />
                  <span className="text-sm">{user?.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-[#6B7280] hover:text-[#0052FF] transition-colors"
                >
                  <HiOutlineLogout className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="text-[#6B7280] hover:text-[#0052FF] transition-colors font-medium"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="bg-[#0052FF] text-white px-4 py-2 rounded-lg hover:bg-[#0046E0] transition-colors"
                >
                  Get Started
                </NavLink>
              </>
            )}
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
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  isActive ? "text-[#0052FF] font-medium" : "text-[#6B7280] hover:text-[#0052FF] transition-colors"
                }
              >
                Home
              </NavLink>
              {isAuthenticated && (
                <>
                  <NavLink
                    to="/calendars"
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      isActive ? "text-[#0052FF] font-medium" : "text-[#6B7280] hover:text-[#0052FF] transition-colors"
                    }
                  >
                    Calendars
                  </NavLink>
                  <NavLink
                    to="/appointments"
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      isActive ? "text-[#0052FF] font-medium" : "text-[#6B7280] hover:text-[#0052FF] transition-colors"
                    }
                  >
                    Appointments
                  </NavLink>
                </>
              )}
              <div className="flex flex-col gap-2 pt-4 border-t border-[#E5EAF2]">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-2 text-[#6B7280] px-2">
                      <HiOutlineUser className="w-5 h-5" />
                      <span className="text-sm">{user?.email}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 text-[#6B7280] hover:text-[#0052FF] transition-colors"
                    >
                      <HiOutlineLogout className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-[#6B7280] hover:text-[#0052FF] transition-colors font-medium text-center"
                    >
                      Login
                    </NavLink>
                    <NavLink
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="bg-[#0052FF] text-white px-4 py-2 rounded-lg hover:bg-[#0046E0] transition-colors w-full text-center"
                    >
                      Get Started
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}