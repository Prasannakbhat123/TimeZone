import { getTimeDifference } from '../utils/timeConverter'

interface HeaderProps {
  onCustomTimeToggle: () => void
  showCustomInput: boolean
}

export const Header = ({ onCustomTimeToggle, showCustomInput }: HeaderProps) => {
  return (
    <div className="mb-4 sm:mb-5 md:mb-6 text-center w-full max-w-5xl">
      <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 flex-wrap">
        <div className="relative inline-block">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 tracking-tight relative z-10">
            Time Converter
          </h1>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-gray-100/30 blur-xl -z-10"></div>
        </div>
        <span className="text-gray-300 hidden sm:inline text-xl font-light">•</span>
        <p className="text-sm sm:text-base text-gray-600 font-medium">
          IST ↔ London
        </p>
      </div>
      <div className="flex items-center justify-center gap-2.5 sm:gap-3 flex-wrap">
        <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 bg-gradient-to-r from-white to-gray-50/50 backdrop-blur-sm rounded-full border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Diff</span>
          <span className="text-xs sm:text-sm font-bold text-gray-800">{getTimeDifference()}</span>
        </div>
        <button
          onClick={onCustomTimeToggle}
          className="px-4 sm:px-5 py-2 cursor-pointer bg-gradient-to-r from-white to-gray-50/50 backdrop-blur-sm rounded-full border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 text-xs sm:text-sm font-semibold text-gray-700 hover:text-gray-900"
        >
          {showCustomInput ? 'Hide' : 'Custom Time'}
        </button>
      </div>
    </div>
  )
}
