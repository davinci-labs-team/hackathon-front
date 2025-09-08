import { UserRole } from '@/types/roles'

declare global {
  interface SupabaseDecodedUser {
    sub: string
    email: string
    name: string
    role: UserRole
    session_id: string
    is_anonymous: boolean
    accessToken: string
  }
}

export {}
