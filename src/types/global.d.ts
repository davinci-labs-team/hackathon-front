import { UserRole } from '@/types/roles'
import { UserDTO } from './user'

declare global {
  interface SupabaseDecodedUser extends UserDTO {
    supabaseUserId: string
    sub: string
    session_id: string
    is_anonymous: boolean
    accessToken: string
  }
}

export {}
