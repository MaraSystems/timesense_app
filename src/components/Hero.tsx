import { Link } from "react-router-dom"
import { HiArrowRight, HiCalendar, HiClock, HiUserGroup, HiPlus } from "react-icons/hi"

interface HeroProps {
  isAuthenticated: boolean
}

export function Hero({ isAuthenticated }: HeroProps) {
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-[#F7F9FC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A1A1A] leading-tight">
              {isAuthenticated ? (
                <>
                  Welcome back to
                  <span className="text-[#0052FF]"> TimeSense</span>
                </>
              ) : (
                <>
                  Schedule Smarter with
                  <span className="text-[#0052FF]"> TimeSense</span>
                </>
              )}
            </h1>
            <p className="mt-6 text-lg text-[#6B7280] max-w-lg mx-auto md:mx-0">
              {isAuthenticated
                ? "Manage your calendars, view upcoming appointments, and stay organized with your schedule."
                : "Create calendars, book appointments, and manage your schedule with ease. Conflict-free scheduling for individuals and teams."}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/calendars"
                    className="inline-flex items-center justify-center gap-2 bg-[#0052FF] text-white px-6 py-3 rounded-lg hover:bg-[#0046E0] transition-colors font-medium"
                  >
                    View My Calendars
                    <HiArrowRight size={18} />
                  </Link>
                  <Link
                    to="/calendars/new"
                    className="inline-flex items-center justify-center gap-2 bg-white text-[#0052FF] px-6 py-3 rounded-lg border border-[#0052FF] hover:bg-[#F7F9FC] transition-colors font-medium"
                  >
                    <HiPlus size={18} />
                    Create Calendar
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center gap-2 bg-[#0052FF] text-white px-6 py-3 rounded-lg hover:bg-[#0046E0] transition-colors font-medium"
                  >
                    Get Started
                    <HiArrowRight size={18} />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center gap-2 bg-white text-[#0052FF] px-6 py-3 rounded-lg border border-[#0052FF] hover:bg-[#F7F9FC] transition-colors font-medium"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap gap-6 justify-center md:justify-start">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00C48C]"></div>
                <span className="text-sm text-[#6B7280]">Conflict Prevention</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00C48C]"></div>
                <span className="text-sm text-[#6B7280]">Recurring Appointments</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00C48C]"></div>
                <span className="text-sm text-[#6B7280]">Real-time Updates</span>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="hidden md:block">
            <div className="relative">
              {/* Main Card - Calendar Preview */}
              <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-sm text-[#6B7280]">April 2026</p>
                    <p className="text-2xl font-bold text-[#1A1A1A]">Your Schedule</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-[#0052FF]/10 flex items-center justify-center">
                    <HiCalendar className="w-5 h-5 text-[#0052FF]" />
                  </div>
                </div>

                {/* Appointments List */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-[#0052FF]/5 rounded-lg border-l-4 border-[#0052FF]">
                    <HiClock className="w-5 h-5 text-[#0052FF]" />
                    <div className="flex-1">
                      <p className="font-medium text-[#1A1A1A]">Team Standup</p>
                      <p className="text-sm text-[#6B7280]">9:00 AM - 9:30 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#00C48C]/5 rounded-lg border-l-4 border-[#00C48C]">
                    <HiUserGroup className="w-5 h-5 text-[#00C48C]" />
                    <div className="flex-1">
                      <p className="font-medium text-[#1A1A1A]">Client Meeting</p>
                      <p className="text-sm text-[#6B7280]">2:00 PM - 3:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#F7F9FC] rounded-lg border-l-4 border-[#6B7280]">
                    <HiCalendar className="w-5 h-5 text-[#6B7280]" />
                    <div className="flex-1">
                      <p className="font-medium text-[#1A1A1A]">Product Review</p>
                      <p className="text-sm text-[#6B7280]">4:30 PM - 5:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-[#00C48C] text-white px-4 py-2 rounded-lg shadow-md text-sm font-medium">
                No Conflicts
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}