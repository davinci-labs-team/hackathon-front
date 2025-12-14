import { UserRole } from '@/types/roles'

declare global {
  interface SupabaseDecodedUser {
    id: string
    supabaseUserId: string
    sub: string
    email: string
    firstname: string
    lastname: string
    role: UserRole
    session_id: string
    is_anonymous: boolean
    accessToken: string
    profilePicturePath?: string
    bio?: string
    interests?: string[]
    github?: SocialMediaDTO
    discord?: SocialMediaDTO
    teamId?: string
    favoriteSubjectId?: string
  }
}

export {}
