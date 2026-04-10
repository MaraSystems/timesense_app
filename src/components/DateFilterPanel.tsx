import { useState } from "react"
import { HiFilter, HiX } from "react-icons/hi"
import { Button } from "./Button"
import { CalendarGrid } from "./CalendarGrid"
import { formatDate } from "../utils/calendar"

interface DateFilterPanelProps {
  liveAtFilter: string
  expireAtFilter: string
  onLiveAtChange: (date: string) => void
  onExpireAtChange: (date: string) => void
  onClear: () => void
}

export function DateFilterPanel({
  liveAtFilter,
  expireAtFilter,
  onLiveAtChange,
  onExpireAtChange,
  onClear,
}: DateFilterPanelProps) {
  const [showLiveAtPicker, setShowLiveAtPicker] = useState(false)
  const [showExpireAtPicker, setShowExpireAtPicker] = useState(false)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#E5EAF2] p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#1A1A1A]">Filter by Date Range</h3>
        {(liveAtFilter || expireAtFilter) && (
          <button
            onClick={onClear}
            className="text-sm text-[#6B7280] hover:text-[#0052FF] flex items-center gap-1"
          >
            <HiX className="w-4 h-4" />
            Clear filters
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-2">From Date</label>
          <div className="relative">
            <input
              type="text"
              readOnly
              value={liveAtFilter ? formatDate(liveAtFilter) : ""}
              onClick={() => setShowLiveAtPicker(!showLiveAtPicker)}
              placeholder="Select start date"
              className="w-full px-4 py-2.5 rounded-lg border border-[#E5EAF2] focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:border-transparent bg-white cursor-pointer"
            />
            {showLiveAtPicker && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-[#E5EAF2] p-4 z-10">
                <CalendarGrid
                  selectedDate={liveAtFilter}
                  onDateSelect={(date) => {
                    onLiveAtChange(date)
                    setShowLiveAtPicker(false)
                  }}
                  maxDate={expireAtFilter || undefined}
                />
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-2">To Date</label>
          <div className="relative">
            <input
              type="text"
              readOnly
              value={expireAtFilter ? formatDate(expireAtFilter) : ""}
              onClick={() => setShowExpireAtPicker(!showExpireAtPicker)}
              placeholder="Select end date"
              className="w-full px-4 py-2.5 rounded-lg border border-[#E5EAF2] focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:border-transparent bg-white cursor-pointer"
            />
            {showExpireAtPicker && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-[#E5EAF2] p-4 z-10">
                <CalendarGrid
                  selectedDate={expireAtFilter}
                  onDateSelect={(date) => {
                    onExpireAtChange(date)
                    setShowExpireAtPicker(false)
                  }}
                  minDate={liveAtFilter || undefined}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface FilterButtonProps {
  showFilters: boolean
  onToggle: () => void
  filterCount: number
}

export function FilterButton({ showFilters, onToggle, filterCount }: FilterButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={onToggle}
      className={showFilters ? "border-[#0052FF] text-[#0052FF]" : ""}
    >
      <HiFilter className="w-5 h-5 mr-2" />
      Filter
      {filterCount > 0 && (
        <span className="ml-2 bg-[#0052FF] text-white text-xs px-2 py-0.5 rounded-full">
          {filterCount}
        </span>
      )}
    </Button>
  )
}