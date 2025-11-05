import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { CustomTime } from '../types'
import { getCurrentDateString, getCurrentISTTimeString, getCurrentLondonTimeString } from '../utils/dateFormatters'

interface CustomTimeInputProps {
  customTime: CustomTime | null
  setCustomTime: (time: CustomTime | null) => void
  onSubmit: (e: React.FormEvent) => void
  onReset: () => void
}

export const CustomTimeInput = ({ customTime, setCustomTime, onSubmit, onReset }: CustomTimeInputProps) => {
  const [sourceTimezone, setSourceTimezone] = useState<'IST' | 'London'>(customTime?.sourceTimezone || 'IST')
  const [localDate, setLocalDate] = useState(customTime?.date || getCurrentDateString())
  const [localTime, setLocalTime] = useState(
    customTime?.time || (sourceTimezone === 'IST' ? getCurrentISTTimeString() : getCurrentLondonTimeString())
  )
  const [isTimezoneDropdownOpen, setIsTimezoneDropdownOpen] = useState(false)
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false)
  const timezoneDropdownRef = useRef<HTMLDivElement>(null)
  const timeDropdownRef = useRef<HTMLDivElement>(null)
  const timezoneButtonRef = useRef<HTMLButtonElement>(null)
  const timeButtonRef = useRef<HTMLInputElement>(null)
  const [timezoneDropdownPosition, setTimezoneDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
  const [timeDropdownPosition, setTimeDropdownPosition] = useState({ top: 0, left: 0, width: 0 })

  // Update time when timezone changes
  useEffect(() => {
    if (!customTime) {
      setLocalTime(sourceTimezone === 'IST' ? getCurrentISTTimeString() : getCurrentLondonTimeString())
    }
  }, [sourceTimezone, customTime])

  // Update dropdown positions when opened
  useEffect(() => {
    if (isTimezoneDropdownOpen && timezoneButtonRef.current) {
      const updatePosition = () => {
        if (timezoneButtonRef.current) {
          const rect = timezoneButtonRef.current.getBoundingClientRect()
          setTimezoneDropdownPosition({
            top: rect.bottom + 4,
            left: rect.left,
            width: rect.width
          })
        }
      }
      updatePosition()
      window.addEventListener('scroll', updatePosition, true)
      window.addEventListener('resize', updatePosition)
      return () => {
        window.removeEventListener('scroll', updatePosition, true)
        window.removeEventListener('resize', updatePosition)
      }
    }
  }, [isTimezoneDropdownOpen])

  useEffect(() => {
    if (isTimeDropdownOpen && timeButtonRef.current) {
      const updatePosition = () => {
        if (timeButtonRef.current) {
          const rect = timeButtonRef.current.getBoundingClientRect()
          setTimeDropdownPosition({
            top: rect.bottom + 4,
            left: rect.left,
            width: rect.width
          })
        }
      }
      updatePosition()
      window.addEventListener('scroll', updatePosition, true)
      window.addEventListener('resize', updatePosition)
      return () => {
        window.removeEventListener('scroll', updatePosition, true)
        window.removeEventListener('resize', updatePosition)
      }
    }
  }, [isTimeDropdownOpen])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (isTimezoneDropdownOpen && timezoneButtonRef.current && !timezoneButtonRef.current.contains(target) && 
          timezoneDropdownRef.current && !timezoneDropdownRef.current.contains(target)) {
        setIsTimezoneDropdownOpen(false)
      }
      if (isTimeDropdownOpen && timeButtonRef.current && !timeButtonRef.current.contains(target) && 
          timeDropdownRef.current && !timeDropdownRef.current.contains(target)) {
        setIsTimeDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isTimezoneDropdownOpen, isTimeDropdownOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCustomTime({ date: localDate, time: localTime, sourceTimezone })
    onSubmit(e)
  }

  const handleReset = () => {
    setLocalDate(getCurrentDateString())
    setSourceTimezone('IST')
    setLocalTime(getCurrentISTTimeString())
    onReset()
  }

  const timezoneOptions = [
    { value: 'IST' as const, label: 'Indian Standard Time (IST)', flag: '🇮🇳' },
    { value: 'London' as const, label: 'London Time (GMT/BST)', flag: '🇬🇧' }
  ]

  const selectedTimezone = timezoneOptions.find(opt => opt.value === sourceTimezone)

  // Generate time options for dropdown
  const generateTimeOptions = () => {
    const options = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
        const displayTime = `${hour % 12 || 12}:${String(minute).padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`
        options.push({ value: timeString, label: displayTime })
      }
    }
    return options
  }

  const timeOptions = generateTimeOptions()

  return (
    <div className="w-full max-w-3xl mb-3 sm:mb-4 md:mb-6">
      <div className="bg-white/95 backdrop-blur-md rounded-xl p-4 sm:p-5 md:p-6 border border-gray-200/80 shadow-md hover:shadow-lg transition-all duration-300">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Custom Timezone Dropdown */}
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
              Convert From
            </label>
            <button
              type="button"
              ref={timezoneButtonRef}
              onClick={() => setIsTimezoneDropdownOpen(!isTimezoneDropdownOpen)}
              className={`w-full px-4 py-2.5 bg-gradient-to-br from-gray-50 to-white border border-gray-200/80 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300/50 focus:border-blue-400 transition-all duration-200 shadow-sm cursor-pointer flex items-center justify-between ${
                isTimezoneDropdownOpen ? 'ring-2 ring-blue-300/50 border-blue-400' : ''
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-base">{selectedTimezone?.flag}</span>
                <span className="font-medium">{selectedTimezone?.label}</span>
              </span>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isTimezoneDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isTimezoneDropdownOpen && createPortal(
              <div 
                ref={timezoneDropdownRef}
                className="fixed z-[9999] bg-white/95 backdrop-blur-md border border-gray-200/80 rounded-lg shadow-lg overflow-hidden max-h-48 overflow-y-auto"
                style={{
                  top: `${timezoneDropdownPosition.top}px`,
                  left: `${timezoneDropdownPosition.left}px`,
                  width: `${timezoneDropdownPosition.width}px`
                }}
              >
                {timezoneOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSourceTimezone(option.value)
                      setIsTimezoneDropdownOpen(false)
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors duration-150 flex items-center gap-2 ${
                      sourceTimezone === option.value ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <span className="text-base">{option.flag}</span>
                    <span className="font-medium text-gray-900 flex-1">{option.label}</span>
                    {sourceTimezone === option.value && (
                      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>,
              document.body
            )}
          </div>

          {/* Date and Time Inputs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Date ({sourceTimezone})
              </label>
              <input
                type="date"
                value={localDate}
                onChange={(e) => setLocalDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-gradient-to-br from-gray-50 to-white border border-gray-200/80 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300/50 focus:border-blue-400 transition-all duration-200 shadow-sm"
                required
              />
            </div>
            <div className="flex-1 relative">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Time ({sourceTimezone})
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={localTime}
                  onChange={(e) => setLocalTime(e.target.value)}
                  ref={timeButtonRef}
                  className={`w-full px-4 py-2.5 pr-10 bg-gradient-to-br from-gray-50 to-white border border-gray-200/80 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300/50 focus:border-blue-400 transition-all duration-200 shadow-sm ${
                    isTimeDropdownOpen ? 'ring-2 ring-blue-300/50 border-blue-400' : ''
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded transition-colors duration-150"
                  aria-label="Open time dropdown"
                >
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isTimeDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              
              {isTimeDropdownOpen && createPortal(
                <div 
                  ref={timeDropdownRef}
                  className="fixed z-[9999] bg-white/95 backdrop-blur-md border border-gray-200/80 rounded-lg shadow-lg overflow-hidden max-h-64 overflow-y-auto"
                  style={{
                    top: `${timeDropdownPosition.top}px`,
                    left: `${timeDropdownPosition.left}px`,
                    width: `${timeDropdownPosition.width}px`
                  }}
                >
                  {timeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setLocalTime(option.value)
                        setIsTimeDropdownOpen(false)
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors duration-150 flex items-center justify-between ${
                        localTime === option.value ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <span className="font-medium text-gray-900">{option.label}</span>
                      {localTime === option.value && (
                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>,
                document.body
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg text-sm font-semibold hover:from-gray-800 hover:to-gray-700 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02]"
            >
              Convert
            </button>
            {(customTime || localDate !== getCurrentDateString() || localTime !== (sourceTimezone === 'IST' ? getCurrentISTTimeString() : getCurrentLondonTimeString()) || sourceTimezone !== 'IST') && (
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2.5 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 rounded-lg text-sm font-semibold hover:from-gray-200 hover:to-gray-100 transition-all duration-200 border border-gray-200/80 shadow-sm hover:shadow"
              >
                Reset
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
