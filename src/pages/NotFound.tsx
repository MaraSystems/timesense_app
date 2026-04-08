import { Link } from "react-router-dom"
import { HiHome, HiArrowLeft } from "react-icons/hi"

export function NotFound() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-[120px] md:text-[160px] font-bold text-[#0052FF] leading-none">
            404
          </div>
          <div className="w-24 h-1 bg-[#0052FF] mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Message */}
        <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-4">
          Page Not Found
        </h1>
        <p className="text-[#6B7280] mb-8">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-[#0052FF] text-white px-6 py-3 rounded-lg hover:bg-[#0046E0] transition-colors font-medium"
          >
            <HiHome size={18} />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 bg-white text-[#0052FF] px-6 py-3 rounded-lg border border-[#0052FF] hover:bg-[#F7F9FC] transition-colors font-medium"
          >
            <HiArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}