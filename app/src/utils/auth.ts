import { UserRole } from '@/types/roles'

export function getRole() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  return user.role || UserRole.PARTICIPANT
}

export function getTPrefix(role: UserRole): string {
  switch (role) {
    case UserRole.ORGANIZER:
      return 'organizer'
    case UserRole.JURY:
      return 'jury'
    case UserRole.PARTICIPANT:
      return 'participant'
    case UserRole.MENTOR:
      return 'mentor'
    default:
      return ''
  }
}
