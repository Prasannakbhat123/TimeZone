import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import type { TimeState } from '../types'

export const formatTime = (time: TimeState): string => {
  return `${String(time.hours).padStart(2, '0')}:${String(time.minutes).padStart(2, '0')}:${String(time.seconds).padStart(2, '0')} ${time.period}`
}

export const formatDate = (date: Date): string => {
  return format(date, 'EEEE, MMMM d, yyyy')
}

export const getCurrentDateString = (): string => {
  const now = new Date()
  return format(now, 'yyyy-MM-dd')
}

export const getCurrentISTTimeString = (): string => {
  const now = new Date()
  const IST_OFFSET = 5.5 * 60 * 60 * 1000
  const istDate = new Date(now.getTime() + IST_OFFSET)
  return format(istDate, 'HH:mm')
}

export const getCurrentLondonTimeString = (): string => {
  const now = new Date()
  const londonDate = toZonedTime(now, 'Europe/London')
  return format(londonDate, 'HH:mm')
}
