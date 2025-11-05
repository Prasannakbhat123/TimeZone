import Clock from 'react-clock'
import 'react-clock/dist/Clock.css'

interface ClockDisplayProps {
  value: Date
  size?: number
}

export const ClockDisplay = ({ value, size = 100 }: ClockDisplayProps) => {
  return (
    <div className="flex justify-center items-center w-full">
      <Clock
        value={value}
        size={size}
        hourHandLength={size * 0.35}
        minuteHandLength={size * 0.5}
        secondHandLength={size * 0.45}
        hourHandWidth={2.5}
        minuteHandWidth={2}
        secondHandWidth={1}
        hourMarksWidth={1.5}
        hourMarksLength={size * 0.07}
        minuteMarksLength={size * 0.03}
        renderNumbers={true}
      />
    </div>
  )
}
