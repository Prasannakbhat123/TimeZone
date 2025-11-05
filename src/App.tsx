import { useState } from 'react'
import { Header } from './components/Header'
import { CustomTimeInput } from './components/CustomTimeInput'
import { TimeCard } from './components/TimeCard'
import { QuickReference } from './components/QuickReference'
import { useTimeSync } from './hooks/useTimeSync'
import { useCustomTime } from './hooks/useCustomTime'

function App() {
  const { istTime, londonTime, isAnimating } = useTimeSync()
  const { customTime, setCustomTime, customISTTime, customLondonTime, resetCustomTime } = useCustomTime()
  const [showCustomInput, setShowCustomInput] = useState(false)

  const handleCustomTimeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Conversion is handled automatically by useCustomTime hook
  }

  const handleResetCustomTime = () => {
    resetCustomTime()
    setShowCustomInput(false)
  }

  const currentISTTime = customISTTime || istTime
  const currentLondonTime = customLondonTime || londonTime

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-blue-50/40 to-gray-50 relative overflow-hidden">
      {/* Enhanced background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #1a1a1a 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Enhanced floating elements with gradients */}
      <div className="absolute top-10 left-5 w-64 h-64 sm:w-80 sm:h-96 bg-gradient-to-br from-orange-100/20 via-amber-100/15 to-yellow-100/10 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute bottom-10 right-5 w-80 h-80 sm:w-96 sm:h-[500px] bg-gradient-to-br from-blue-100/20 via-cyan-100/15 to-sky-100/10 rounded-full blur-3xl opacity-40"></div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8">
        <Header 
          onCustomTimeToggle={() => setShowCustomInput(!showCustomInput)}
          showCustomInput={showCustomInput}
        />

        {showCustomInput && (
          <CustomTimeInput
            customTime={customTime}
            setCustomTime={setCustomTime}
            onSubmit={handleCustomTimeSubmit}
            onReset={handleResetCustomTime}
          />
        )}

        {/* Main converter cards */}
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mb-4 sm:mb-6">
          <TimeCard
            time={currentISTTime}
            title="Indian Standard Time"
            timezone="UTC+5:30"
            flag="🇮🇳"
            isAnimating={isAnimating && !customTime}
          />
          <TimeCard
            time={currentLondonTime}
            title="London Time"
            timezone="UTC+0"
            flag="🇬🇧"
            isAnimating={isAnimating && !customTime}
          />
        </div>

        <QuickReference istTime={currentISTTime} londonTime={currentLondonTime} />

        {/* Footer */}
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-[10px] sm:text-xs text-gray-500 font-medium tracking-wide px-4">
            {customTime ? 'Custom time conversion' : 'Real-time synchronization • Updates every second'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
