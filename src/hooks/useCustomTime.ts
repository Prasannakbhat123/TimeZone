import { useState, useEffect } from 'react'
import type { CustomTime, TimeState } from '../types'
import { convertCustomTime } from '../utils/timeConverter'

export const useCustomTime = () => {
  const [customTime, setCustomTime] = useState<CustomTime | null>(null)
  const [customISTTime, setCustomISTTime] = useState<TimeState | null>(null)
  const [customLondonTime, setCustomLondonTime] = useState<TimeState | null>(null)

  useEffect(() => {
    if (customTime && customTime.date && customTime.time && customTime.sourceTimezone) {
      // Ensure both date and time are provided
      if (customTime.date.trim() && customTime.time.trim()) {
        const result = convertCustomTime(customTime.date, customTime.time, customTime.sourceTimezone)
        if (result) {
          setCustomISTTime(result.ist)
          setCustomLondonTime(result.london)
        } else {
          // Reset if conversion fails
          setCustomISTTime(null)
          setCustomLondonTime(null)
        }
      }
    } else {
      // Reset if any field is missing
      setCustomISTTime(null)
      setCustomLondonTime(null)
    }
  }, [customTime])

  const resetCustomTime = () => {
    setCustomTime(null)
    setCustomISTTime(null)
    setCustomLondonTime(null)
  }

  return {
    customTime,
    setCustomTime,
    customISTTime,
    customLondonTime,
    resetCustomTime
  }
}
