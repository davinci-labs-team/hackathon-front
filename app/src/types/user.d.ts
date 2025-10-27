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
  github?: SocialMediaDTO
  discord?: SocialMediaDTO 
  profilePicturePath?: string
  teamId?: string
}

export interface UserReducedDTO {
  id: string
  firstname: string
  lastname: string
  email: string
  role: Role
  school?: string | null
  favoriteSubjectId?: string | null
  teamId?: string | null
  team ? : {
    id: string
    name: string
  } | null
}

export interface SocialMediaDTO {
  id: string
  username: string
}
