import { UserRole } from "./roles"
import { TeamStatus } from "./team_status"

export interface TeamDTO {
  id: string
  name: string
  description?: string
  subjectId: string
  status: TeamStatus
  createdAt: string
  members: UserPreviewDTO[]
  juries: UserPreviewDTO[]
  mentors: UserPreviewDTO[]
}

export interface UserPreviewDTO {
  id: string
  firstname: string
  lastname: string
  school: string
  role: UserRole
}