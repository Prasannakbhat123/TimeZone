import type { TimeState } from '../types'
import { getTimeDifference } from '../utils/timeConverter'

interface QuickReferenceProps {
  istTime: TimeState
  londonTime: TimeState
}

export const QuickReference = ({ istTime, londonTime }: QuickReferenceProps) => {
  return (
    <div className="w-full max-w-3xl bg-white/90 backdrop-blur-md rounded-xl p-4 sm:p-5 md:p-6 border border-gray-200/80 shadow-md hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 tracking-tight">Quick Reference</h3>
          <p className="text-xs text-gray-600 font-medium">
            IST is {getTimeDifference()} ahead of London
          </p>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="text-center bg-gradient-to-br from-orange-50/60 to-amber-50/40 rounded-lg px-4 py-2.5 border border-orange-200/40 shadow-sm">
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {istTime.hours}:{String(istTime.minutes).padStart(2, '0')}
            </div>
            <div className="text-[10px] sm:text-xs text-orange-600 font-bold uppercase tracking-wider">IST</div>
          </div>
          <div className="text-xl sm:text-2xl text-gray-300 font-light">↔</div>
          <div className="text-center bg-gradient-to-br from-blue-50/60 to-cyan-50/40 rounded-lg px-4 py-2.5 border border-blue-200/40 shadow-sm">
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {londonTime.hours}:{String(londonTime.minutes).padStart(2, '0')}
            </div>
            <div className="text-[10px] sm:text-xs text-blue-600 font-bold uppercase tracking-wider">London</div>
          </div>
        </div>
      </div>
    </div>
  )
}
