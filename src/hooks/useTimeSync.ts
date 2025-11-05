import { useState, useEffect } from 'react'
import type { TimeState } from '../types'
import { calculateISTTime, calculateLondonTime } from '../utils/timeConverter'

export const useTimeSync = () => {
  const [istTime, setIstTime] = useState<TimeState>({ 
    hours: 0, 
    minutes: 0, 
    seconds: 0, 
    period: 'AM', 
    date: new Date() 
  })
  const [londonTime, setLondonTime] = useState<TimeState>({ 
    hours: 0, 
    minutes: 0, 
    seconds: 0, 
    period: 'AM', 
    date: new Date() 
  })
  const [isAnimating, setIsAnimating] = useState(false)

  const updateTimes = () => {
    const now = new Date()
    setIstTime(calculateISTTime(now))
    setLondonTime(calculateLondonTime(now))
  }

  useEffect(() => {
    updateTimes()
    const interval = setInterval(() => {
      setIsAnimating(true)
      updateTimes()
      setTimeout(() => setIsAnimating(false), 500)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return { istTime, londonTime, isAnimating }
}

