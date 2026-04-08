import { Link } from "react-router-dom"

export function Footer() {
  return (
    <footer className="bg-[#001F54] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                <span className="text-[#0052FF] font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-semibold">TimeSense</span>
            </div>
            <p className="text-white/70 text-sm">
              Simple, efficient scheduling for individuals and teams.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/70 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/calendars" className="text-white/70 hover:text-white transition-colors text-sm">
                  Calendars
                </Link>
              </li>
              <li>
                <Link to="/appointments" className="text-white/70 hover:text-white transition-colors text-sm">
                  Appointments
                </Link>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div>
            <h4 className="font-semibold mb-4">Actions</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/calendars/new" className="text-white/70 hover:text-white transition-colors text-sm">
                  Create Calendar
                </Link>
              </li>
              <li>
                <Link to="/appointments/new" className="text-white/70 hover:text-white transition-colors text-sm">
                  Book Appointment
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>support@timesense.com</li>
              <li>Mon - Fri, 9am - 6pm EST</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/50 text-sm">
          &copy; {new Date().getFullYear()} TimeSense. All rights reserved.
        </div>
      </div>
    </footer>
  )
}