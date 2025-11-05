import { toZonedTime, fromZonedTime } from 'date-fns-tz'
import type { TimeState } from '../types'

export const IST_OFFSET = 5.5 * 60 * 60 * 1000 // 5.5 hours in milliseconds
export const IST_TIMEZONE = 'Asia/Kolkata'
export const LONDON_TIMEZONE = 'Europe/London'

// Check if London is in BST (British Summer Time)
export const isLondonBST = (date: Date = new Date()): boolean => {
  const year = date.getFullYear()
  
  const marchLastSunday = new Date(year, 2, 31)
  marchLastSunday.setDate(31 - marchLastSunday.getDay())
  
  const octoberLastSunday = new Date(year, 9, 31)
  octoberLastSunday.setDate(31 - octoberLastSunday.getDay())
  
  return date >= marchLastSunday && date < octoberLastSunday
}

export const calculateISTTime = (now: Date): TimeState => {
  // Get IST time in UTC
  const istUTC = new Date(now.getTime() + IST_OFFSET)
  const istHours = istUTC.getUTCHours()
  const istMins = istUTC.getUTCMinutes()
  const istSecs = istUTC.getUTCSeconds()
  
  // Create a date object for clock display - use local time to represent IST time
  // The clock component reads local time, so we set local hours to match IST hours
  const istDisplayDate = new Date()
  istDisplayDate.setHours(istHours, istMins, istSecs, 0)
  
  const ist12Hour = istHours % 12 || 12
  const istPeriod = istHours >= 12 ? 'PM' : 'AM'
  
  return {
    hours: ist12Hour,
    minutes: istMins,
    seconds: istSecs,
    period: istPeriod,
    date: istDisplayDate
  }
}

export const calculateLondonTime = (now: Date): TimeState => {
  // Get London time in UTC
  const londonOffset = isLondonBST(now) ? 1 * 60 * 60 * 1000 : 0
  const londonUTC = new Date(now.getTime() + londonOffset)
  const londonHours = londonUTC.getUTCHours()
  const londonMins = londonUTC.getUTCMinutes()
  const londonSecs = londonUTC.getUTCSeconds()
  
  // Create a date object for clock display - use local time to represent London time
  const londonDisplayDate = new Date()
  londonDisplayDate.setHours(londonHours, londonMins, londonSecs, 0)
  
  const london12Hour = londonHours % 12 || 12
  const londonPeriod = londonHours >= 12 ? 'PM' : 'AM'
  
  return {
    hours: london12Hour,
    minutes: londonMins,
    seconds: londonSecs,
    period: londonPeriod,
    date: londonDisplayDate
  }
}

export const convertCustomTime = (dateString: string, timeString: string, sourceTimezone: 'IST' | 'London'): { ist: TimeState; london: TimeState } | null => {
  try {
    // Parse the date and time components
    const [year, month, day] = dateString.split('-').map(Number)
    const [hours, minutes] = timeString.split(':').map(Number)
    
    // Create a date object as if the time is in the source timezone
    const localDate = new Date(year, month - 1, day, hours, minutes, 0)
    
    let utcDate: Date
    let sourceTime: TimeState
    let targetTime: TimeState
    
    if (sourceTimezone === 'IST') {
      // Convert from IST timezone to UTC
      utcDate = fromZonedTime(localDate, IST_TIMEZONE)
      
      // For IST display, use the input time directly
      const ist12Hour = hours % 12 || 12
      const istPeriod = hours >= 12 ? 'PM' : 'AM'
      // Create date for clock - set local time to match IST time
      const istDisplayDate = new Date()
      istDisplayDate.setHours(hours, minutes, 0, 0)

      sourceTime = {
        hours: ist12Hour,
        minutes: minutes,
        seconds: 0,
        period: istPeriod,
        date: istDisplayDate
      }

      // Convert UTC to London timezone
      const londonZonedDate = toZonedTime(utcDate, LONDON_TIMEZONE)
      const londonHours = londonZonedDate.getHours()
      const londonMins = londonZonedDate.getMinutes()
      const londonSecs = londonZonedDate.getSeconds()
      const london12Hour = londonHours % 12 || 12
      const londonPeriod = londonHours >= 12 ? 'PM' : 'AM'
      
      // Create date for clock - set local time to match London time
      const londonDisplayDate = new Date()
      londonDisplayDate.setHours(londonHours, londonMins, londonSecs, 0)

      targetTime = {
        hours: london12Hour,
        minutes: londonMins,
        seconds: londonSecs,
        period: londonPeriod,
        date: londonDisplayDate
      }
    } else {
      // Convert from London timezone to UTC
      utcDate = fromZonedTime(localDate, LONDON_TIMEZONE)
      
      // For London display, use the input time directly
      const london12Hour = hours % 12 || 12
      const londonPeriod = hours >= 12 ? 'PM' : 'AM'
      // Create date for clock - set local time to match London time
      const londonDisplayDate = new Date()
      londonDisplayDate.setHours(hours, minutes, 0, 0)

      sourceTime = {
        hours: london12Hour,
        minutes: minutes,
        seconds: 0,
        period: londonPeriod,
        date: londonDisplayDate
      }

      // Convert UTC to IST timezone
      const istZonedDate = toZonedTime(utcDate, IST_TIMEZONE)
      const istHours = istZonedDate.getHours()
      const istMins = istZonedDate.getMinutes()
      const istSecs = istZonedDate.getSeconds()
      const ist12Hour = istHours % 12 || 12
      const istPeriod = istHours >= 12 ? 'PM' : 'AM'
      
      // Create date for clock - set local time to match IST time
      const istDisplayDate = new Date()
      istDisplayDate.setHours(istHours, istMins, istSecs, 0)

      targetTime = {
        hours: ist12Hour,
        minutes: istMins,
        seconds: istSecs,
        period: istPeriod,
        date: istDisplayDate
      }
    }

    return { 
      ist: sourceTimezone === 'IST' ? sourceTime : targetTime,
      london: sourceTimezone === 'London' ? sourceTime : targetTime
    }
  } catch (error) {
    console.error('Error converting time:', error)
    return null
  }
}

// Keep the old function for backward compatibility
export const convertCustomISTToLondon = (dateString: string, timeString: string): { ist: TimeState; london: TimeState } | null => {
  return convertCustomTime(dateString, timeString, 'IST')
}

export const getTimeDifference = (): string => {
  const londonOffset = isLondonBST() ? 1 * 60 * 60 * 1000 : 0
  const diff = (IST_OFFSET - londonOffset) / (1000 * 60 * 60)
  return `${diff > 0 ? '+' : ''}${diff.toFixed(1)} hours`
}

