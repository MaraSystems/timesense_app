import { HiCalendar, HiClock, HiRefresh, HiShieldCheck } from "react-icons/hi"

const features = [
  {
    icon: HiCalendar,
    title: "Calendar Management",
    description: "Create multiple calendars for different purposes. Define available hours, working days, and slot durations.",
  },
  {
    icon: HiClock,
    title: "Easy Booking",
    description: "Book appointments with just a few clicks. View available slots and reserve your preferred time instantly.",
  },
  {
    icon: HiShieldCheck,
    title: "Conflict Prevention",
    description: "Automatic conflict detection ensures no double-bookings. Set calendars to allow or prevent overlapping appointments.",
  },
  {
    icon: HiRefresh,
    title: "Recurring Appointments",
    description: "Schedule appointments that repeat weekly or monthly. Perfect for regular meetings and standing appointments.",
  },
]

export function Features() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A]">
            Why Choose TimeSense?
          </h2>
          <p className="mt-4 text-lg text-[#6B7280] max-w-2xl mx-auto">
            Everything you need to manage your schedule efficiently and avoid scheduling conflicts.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-[#F7F9FC] rounded-xl hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-lg bg-[#0052FF]/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-[#0052FF]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
                {feature.title}
              </h3>
              <p className="text-[#6B7280]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}