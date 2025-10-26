import type { TeamDTO } from '@/types/team'
import type { TeamConstraintViolation } from '@/types/config'
import type { UserRole } from '@/types/roles'

export function filterTeams(
  teams: TeamDTO[],
  teamStatus: string,
  constraints: string,
  filterName: string,
  constraintsMap: Record<string, TeamConstraintViolation[]>,
  userTeamStatus?: string,
  role?: UserRole | '',
  school?: string
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

    // Individual filters
    let matchesUserStatus = true
    if (userTeamStatus) {
      if (userTeamStatus === 'withTeam') matchesUserStatus = team.members.length > 0
      if (userTeamStatus === 'withoutTeam') matchesUserStatus = team.members.length === 0
    }

    let matchesRole = true
    if (role) matchesRole = team.members.some(m => m.role === role)

    let matchesSchool = true
    if (school) matchesSchool = team.members.some(m => m.school === school)

    return matchesName && matchesStatus && matchesConstraints && matchesUserStatus && matchesRole && matchesSchool
  })
}
