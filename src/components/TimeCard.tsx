import type { TimeState } from '../types'
import { ClockDisplay } from './ClockDisplay'
import { formatTime, formatDate } from '../utils/dateFormatters'
import { isLondonBST } from '../utils/timeConverter'

interface TimeCardProps {
  time: TimeState
  title: string
  timezone: string
  flag: string
  isAnimating?: boolean
}

export const TimeCard = ({ time, title, timezone, flag, isAnimating = false }: TimeCardProps) => {
  const isBST = title === 'London Time' ? isLondonBST(time.date) : false
  const timezoneDisplay = title === 'London Time' 
    ? (isBST ? 'BST (UTC+1)' : 'GMT (UTC+0)')
    : timezone
  
  // Different accent colors for IST and London
  const accentColor = title === 'Indian Standard Time' 
    ? 'from-orange-50/50 via-amber-50/30 to-yellow-50/40'
    : 'from-blue-50/50 via-cyan-50/30 to-sky-50/40'
  
  const borderAccent = title === 'Indian Standard Time'
    ? 'border-orange-200/40'
    : 'border-blue-200/40'

  return (
    <div className="group relative">
      {/* Enhanced glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${accentColor} rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      
      <div className={`relative bg-white/98 backdrop-blur-md rounded-xl p-5 sm:p-6 md:p-7 border border-gray-200/80 ${borderAccent} shadow-md hover:shadow-xl transition-all duration-300 hover:border-gray-300/90 hover:-translate-y-0.5`}>
        {/* Header with accent */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 tracking-tight truncate">{title}</h2>
              <div className={`w-2 h-2 rounded-full ${title === 'Indian Standard Time' ? 'bg-orange-400' : 'bg-blue-400'} shadow-sm`}></div>
            </div>
            <p className="text-xs text-gray-500 font-medium">{timezoneDisplay}</p>
          </div>
          <div className="text-2xl opacity-70 shrink-0 ml-3 transform group-hover:scale-110 transition-transform duration-300">{flag}</div>
        </div>

        {/* Clock with enhanced styling */}
        <div className="mb-5 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white rounded-full blur-md opacity-60"></div>
            <div className="relative">
              <ClockDisplay value={time.date} size={90} />
            </div>
          </div>
        </div>
        
        {/* Time Display - Centered and properly styled */}
        <div className="mb-5 text-center">
          <div className="inline-block bg-gradient-to-br from-gray-50 to-white rounded-xl px-4 py-3 border border-gray-200/60 shadow-sm">
            <div 
              className={`text-4xl sm:text-5xl md:text-6xl font-semibold text-gray-900 mb-1 transition-all duration-300 ${isAnimating ? 'opacity-80' : 'opacity-100'}`} 
              style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em', lineHeight: '1.2' }}
            >
              {String(time.hours).padStart(2, '0')}
              <span className={`mx-1 ${title === 'Indian Standard Time' ? 'text-orange-400' : 'text-blue-400'}`}>:</span>
              {String(time.minutes).padStart(2, '0')}
              <span className={`mx-1 ${title === 'Indian Standard Time' ? 'text-orange-400' : 'text-blue-400'}`}>:</span>
              <span className="text-3xl sm:text-4xl md:text-5xl text-gray-400 font-normal">{String(time.seconds).padStart(2, '0')}</span>
            </div>
            <div className={`text-base sm:text-lg font-semibold ${title === 'Indian Standard Time' ? 'text-orange-500' : 'text-blue-500'} mt-1`}>
              {time.period}
            </div>
          </div>
        </div>

        {/* Date & Full Time with better styling */}
        <div className="pt-4 border-t border-gray-200/70 space-y-3">
          <div className="bg-gradient-to-r from-gray-50/70 to-transparent rounded-lg p-2.5 -mx-1 border-l-2 border-gray-200/50">
            <p className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Date
            </p>
            <p className="text-xs sm:text-sm font-medium text-gray-700 leading-tight">
              {formatDate(time.date)}
            </p>
          </div>
          <div className="bg-gradient-to-r from-gray-50/70 to-transparent rounded-lg p-2.5 -mx-1 border-l-2 border-gray-200/50">
            <p className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Full Time
            </p>
            <p className="text-sm sm:text-base font-medium text-gray-700 tracking-wide" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {formatTime(time)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
