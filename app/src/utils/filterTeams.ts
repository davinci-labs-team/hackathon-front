import type { TeamDTO } from '@/types/team'
import type { TeamConstraintViolation } from '@/types/config'
import type { UserRole } from '@/types/roles'
import { UserReducedDTO } from '@/types/user'

export function filterTeams(
  teams: TeamDTO[],
  teamStatus: string,
  constraints: string,
  filterName: string,
  constraintsMap: Record<string, TeamConstraintViolation[]>,
) {
  const nameQuery = filterName.toLowerCase()

  return teams.filter(team => {
    // Name filter
    const matchesName =
      !filterName ||
      team.name.toLowerCase().includes(nameQuery) ||
      team.members.some(m => (m.firstname + ' ' + m.lastname).toLowerCase().includes(nameQuery))

    // Team status filter
    const matchesStatus = !teamStatus || team.status === teamStatus

    // Constraints filter
    const violations = constraintsMap[team.id] || []
    const matchesConstraints =
      !constraints ||
      (constraints === 'valid' && violations.length === 0) ||
      (constraints === 'invalid' && violations.length > 0)

    return matchesName && matchesStatus && matchesConstraints
  })
}

export function filterUsers(
  users: UserReducedDTO[],
  userTeamStatus: string,
  filterName: string,
  role?: UserRole | '',
  school?: string
) {
  const nameQuery = filterName.toLowerCase()

  return users.filter(user => {
    // Name filter
    const matchesName =
      !filterName ||
      (user.firstname + ' ' + user.lastname).toLowerCase().includes(nameQuery)

    // Individual filters
    let matchesUserStatus = true
    if (userTeamStatus) {
      if (userTeamStatus === 'withTeam') matchesUserStatus = !!user.teamId
      if (userTeamStatus === 'withoutTeam') matchesUserStatus = !user.teamId
    }

    let matchesRole = true
    if (role) matchesRole = user.role === role

    let matchesSchool = true
    if (school) matchesSchool = user.school === school

    return matchesName && matchesUserStatus && matchesRole && matchesSchool
  })
}
