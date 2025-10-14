import { UserRole } from '@/types/roles'

export interface UserDTO {
  id: string
  firstname: string
  lastname: string
  email: string
  role: UserRole
  school?: string
  invitationSent?: boolean
  bio?: string
  interests?: string[]
  linkedin?: string
  github?: string
  discord?: string 
  profilePicturePath?: string
}
