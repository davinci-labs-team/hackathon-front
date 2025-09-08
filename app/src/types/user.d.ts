import { UserRole } from '@/types/roles'

export interface UserDTO {
  id: string
  name: string
  email: string
  role: UserRole
  school?: string
}