import { TeamDTO } from '@/types/team'
import { MatchmakingSettingsDTO, TeamConstraintViolation } from '@/types/config'
import { TeamConstraintType } from '@/types/constraintType'

function checkTeamSizeConstraints(team: TeamDTO, config: MatchmakingSettingsDTO): TeamConstraintViolation[] {
  const violations: TeamConstraintViolation[] = []

  if (team.members.length < config.teamSizeMin) {
    violations.push({ 
      type: TeamConstraintType.TEAM_SIZE_MIN, 
      count: config.teamSizeMin - team.members.length 
    })
  }
  if (team.members.length > config.teamSizeMax) {
    violations.push({ 
      type: TeamConstraintType.TEAM_SIZE_MAX, 
      count: team.members.length - config.teamSizeMax 
    })
  }

  return violations
}

function checkSingleSchoolConstraint(school: string, count: number, rule: 'MIN' | 'MAX' | 'EQUAL', value: number): TeamConstraintViolation | null {
  switch (rule) {
    case 'MIN':
      if (count < value) return { type: TeamConstraintType.SCHOOL_MIN, count: value - count, schools: school }
      break
    case 'MAX':
      if (count > value) return { type: TeamConstraintType.SCHOOL_MAX, count: count - value, schools: school }
      break
    case 'EQUAL':
      if (count !== value) return { type: count > value ? TeamConstraintType.SCHOOL_EQUAL_TOO_MANY : TeamConstraintType.SCHOOL_EQUAL_TOO_FEW, count: Math.abs(count - value), schools: school }
      break
  }
  return null
}

function checkMultipleSchoolsConstraint(
  schools: string[],
  counts: number[],
  rule: 'MIN' | 'MAX' | 'EQUAL',
  value: number
): TeamConstraintViolation | null {
  const total = counts.reduce((sum, c) => sum + c, 0)

  let type: TeamConstraintType | null = null
  let diff: number = 0

  switch (rule) {
    case 'MIN':
      if (total < value) {
        type = TeamConstraintType.SCHOOLS_MIN
        diff = value - total
      }
      break

    case 'MAX':
      if (total > value) {
        type = TeamConstraintType.SCHOOLS_MAX
        diff = total - value
      }
      break

    case 'EQUAL':
      if (total > value) {
        type = TeamConstraintType.SCHOOLS_EQUAL_TOO_MANY
        diff = total - value
      } else if (total < value) {
        type = TeamConstraintType.SCHOOLS_EQUAL_TOO_FEW
        diff = value - total
      }
      break
  }

  if (!type) return null

  return {
    type,
    count: diff,
    schools: schools.join(', ')
  }
}

function checkMentorConstraint(team: TeamDTO): TeamConstraintViolation | null {
  const hasMentor = team.mentors && team.mentors.length > 0
  if (!hasMentor) {
    return { type: TeamConstraintType.MENTOR_MISSING }
  }
  return null
}

function checkJuryConstraint(team: TeamDTO): TeamConstraintViolation | null {
  const hasJury = team.juries && team.juries.length > 0
  if (!hasJury) {
    return { type: TeamConstraintType.JURY_MISSING }
  }
  return null
}
  

export function checkTeamConstraints(team: TeamDTO, config: MatchmakingSettingsDTO): TeamConstraintViolation[] {
  if (!config.isActive || team.ignoreConstraints) return []

  const violations = [...checkTeamSizeConstraints(team, config)]

  const juryViolation = checkJuryConstraint(team)
  const mentorViolation = checkMentorConstraint(team)
  
  if (juryViolation) violations.push(juryViolation)
  if (mentorViolation) violations.push(mentorViolation)


  config.constraints.forEach((constraint) => {
    const countPerSchool = constraint.schools.map((school) => team.members.filter((m) => m.school === school).length)

    let violation: TeamConstraintViolation | null = null

    if (constraint.schools.length === 1) {
      violation = checkSingleSchoolConstraint(constraint.schools[0], countPerSchool[0], constraint.rule, constraint.value)
    } else if (constraint.schools.length > 1) {
      violation = checkMultipleSchoolsConstraint(constraint.schools, countPerSchool, constraint.rule, constraint.value)
    }

    if (violation) violations.push(violation)
  })

  return violations
}