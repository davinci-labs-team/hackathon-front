import { UserRole } from "./roles"
import { TeamStatus } from "./team_status"

export interface TeamDTO {
  id: string
  name: string
  description?: string
  themeId: string
  subjectId: string
  status: TeamStatus
  createdAt: string
  members: UserPreviewDTO[]
  juries: UserPreviewDTO[]
  mentors: UserPreviewDTO[]
}

export interface TeamFormDTO {
  name: string
  themeId: string
  subjectId: string
  memberIds: string[]
  mentorIds?: string[]
  juryIds?: string[]
}


export interface UserPreviewDTO {
  id: string
  firstname: string
  lastname: string
  school: string
  role: UserRole
}