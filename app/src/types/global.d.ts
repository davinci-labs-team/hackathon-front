import { UserRole } from '@/types/roles'

declare global {
  interface SupabaseDecodedUser {
    sub: string
    email: string
    phone?: string
    role: UserRole
    session_id: string
    is_anonymous: boolean
  }
}

export {}
