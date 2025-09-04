import { UserRole } from '@/types/roles'

export function getRole(): UserRole {
  const authUser = JSON.parse(localStorage.getItem('authUser') || '{}')
  return authUser.role || UserRole.PARTICIPANT
}

export function getTPrefix(role: UserRole, userPlateform: boolean): string {
  switch (role.toLowerCase()) {
    case UserRole.ORGANIZER:
      return userPlateform ? 'participant' : 'organizer'
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
