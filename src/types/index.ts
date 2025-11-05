export type TimeState = {
  hours: number
  minutes: number
  seconds: number
  period: string
  date: Date
}

export type CustomTime = {
  date: string
  time: string
  sourceTimezone: 'IST' | 'London'
}
