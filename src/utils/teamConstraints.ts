import { TeamDTO, UserPreviewDTO } from '@/types/team'
import { MatchmakingSettingsDTO, TeamConstraintViolation } from '@/types/config'
import { checkTeamConstraints as originalCheckTeamConstraints } from '@/services/matchmakingService'
import { UserReducedDTO } from '@/types/user'
import { TeamConstraintType } from '@/types/constraintType'

export function calculateTeamConstraints(
  team: TeamDTO,
  config: MatchmakingSettingsDTO
): TeamConstraintViolation[] {
  return originalCheckTeamConstraints(team, config)
}

export function calculateAllTeamsConstraints(teams: TeamDTO[], config: MatchmakingSettingsDTO) {
  return teams.map((team) => ({
    teamId: team.id,
    violations: calculateTeamConstraints(team, config),
  }))
}

/**
 * Filters the given teams to return only those eligible for the given user.
 * If the user has no favoriteSubjectId, they are eligible for all teams
 * (subject to constraint checks).
 * * @param teams
 * @param user
 * @param config
 * @returns
 */
export function getEligibleTeamsForUser(
  teams: TeamDTO[],
  user: UserReducedDTO,
  config: MatchmakingSettingsDTO
): TeamDTO[] {
  const simulatedMember: UserPreviewDTO = {
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    school: user.school || '',
    role: user.role,
  }

  if (config.isActive === false) {
    return teams
  }

  const teamsBySubject = user.favoriteSubjectId
    ? teams.filter((team) => team.subjectId === user.favoriteSubjectId)
    : teams

  return teamsBySubject.filter((team: TeamDTO) => {
    const simulatedTeam: TeamDTO = {
      ...team,
      members: [...team.members, simulatedMember],
    }

    const violations = calculateTeamConstraints(simulatedTeam, config)

    const hasBlockingViolation = violations.some((v) => {
      if (v.type === TeamConstraintType.TEAM_SIZE_MAX) return true

      if (v.schools?.includes(user.school ?? '')) {
        const blockingTypes = [
          TeamConstraintType.SCHOOL_MAX,
          TeamConstraintType.SCHOOLS_MAX,
          TeamConstraintType.SCHOOL_EQUAL_TOO_MANY,
          TeamConstraintType.SCHOOLS_EQUAL_TOO_MANY,
        ]

        if (blockingTypes.includes(v.type as TeamConstraintType)) {
          console.log('Blocking violation found for user school:', user.school)
          return true
        }
      }

      return false
    })

    return !hasBlockingViolation
  })
}
