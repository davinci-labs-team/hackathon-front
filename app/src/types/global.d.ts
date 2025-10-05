import { UserRole } from '@/types/roles'

declare global {
  interface SupabaseDecodedUser {
    id: string
    supabaseUserId: string
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
