import { TeamDTO } from '@/types/team'
import { MatchmakingSettingsDTO, TeamConstraintViolation } from '@/types/config'
import { checkTeamConstraints as originalCheckTeamConstraints } from '@/services/matchmakingService'

export function calculateTeamConstraints(team: TeamDTO, config: MatchmakingSettingsDTO): TeamConstraintViolation[] {
  return originalCheckTeamConstraints(team, config)
}

export function calculateAllTeamsConstraints(teams: TeamDTO[], config: MatchmakingSettingsDTO) {
  return teams.map((team) => ({
    teamId: team.id,
    violations: calculateTeamConstraints(team, config),
  }))
}
