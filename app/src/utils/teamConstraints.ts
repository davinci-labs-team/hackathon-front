import { TeamDTO } from '@/types/team'
import { MatchmakingSettingsDTO, TeamConstraintViolation } from '@/types/config'
import { checkTeamConstraints as originalCheckTeamConstraints } from '@/services/matchmakingService'
import { UserReducedDTO } from '@/types/user'
import { TeamConstraintType } from '@/types/constraintType'

export function calculateTeamConstraints(team: TeamDTO, config: MatchmakingSettingsDTO): TeamConstraintViolation[] {
  return originalCheckTeamConstraints(team, config)
}

export function calculateAllTeamsConstraints(teams: TeamDTO[], config: MatchmakingSettingsDTO) {
  return teams.map((team) => ({
    teamId: team.id,
    violations: calculateTeamConstraints(team, config),
  }))
}

export function getCompatibleTeamsForUser(user: UserReducedDTO, teams: TeamDTO[], config: MatchmakingSettingsDTO): TeamDTO[] {
  return teams.filter((team) => {
    const violations = originalCheckTeamConstraints(team, config)
    
    for (const violation of violations) {
      if (violation.type === TeamConstraintType.SCHOOL_MIN) {
        continue
      }
      if (violation.type === TeamConstraintType.SCHOOL_EQUAL_TOO_FEW) {
        continue
      }
      if (violation.schools && violation.schools.includes(user.school!!)) {
        return false
      }
    }

    return true
  })
}