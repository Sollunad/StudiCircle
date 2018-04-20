export interface Appointment {
  id?: number
  title: string
  description?: string
  location?: string
  startDate: string
  endDate?: string
  allDay?:boolean
  countCommits: number
  countRejections: number
  countInterested: number
}
