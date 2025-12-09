export enum PhaseOrder {
  REGISTRATION = 1,
  TOPIC_SELECTION = 2,
  TEAM_FORMATION = 3,
  DEVELOPMENT = 4,
  EVALUATION = 5,
  CLOSING = 6,
}

export enum TaskKey {
  // PHASE 1
  CREATE_ACCOUNTS = 'create_accounts',
  SEND_INVITATIONS = 'send_invitations',
  PROFILE_COMPLETION = 'profile_completion',

  // PHASE 2
  CREATE_TOPICS = 'create_topics',
  TOPIC_SELECTION = 'topic_selection',

  // PHASE 3
  DEFINE_TEAM_CONSTRAINTS = 'define_team_constraints',
  TEAMS_FORMED = 'teams_formed',

  // PHASE 4
  DISCORD_AUTOROLE = 'discord_autorole',
  DEFINE_SUBMISSION_DEADLINE = 'define_submission_deadline',

  // PHASE 5
  UPLOAD_EVALUATION_GRID = 'upload_evaluation_grid',
  EVALUATIONS_COMPLETED = 'evaluations_completed',
}

export type PhaseStatus = 'PENDING' | 'IN_PROGRESS'

export const TaskMapByPhase: {
  [key in PhaseOrder]: {
    [status in PhaseStatus]?: TaskKey[]
  }
} = {
  // PHASE 1
  [PhaseOrder.REGISTRATION]: {
    PENDING: [TaskKey.CREATE_ACCOUNTS, TaskKey.SEND_INVITATIONS],
    IN_PROGRESS: [TaskKey.PROFILE_COMPLETION],
  },

  // PHASE 2
  [PhaseOrder.TOPIC_SELECTION]: {
    PENDING: [TaskKey.CREATE_TOPICS],
    IN_PROGRESS: [TaskKey.TOPIC_SELECTION],
  },

  // PHASE 3
  [PhaseOrder.TEAM_FORMATION]: {
    PENDING: [TaskKey.DEFINE_TEAM_CONSTRAINTS],
    IN_PROGRESS: [TaskKey.TEAMS_FORMED],
  },

  // PHASE 4
  [PhaseOrder.DEVELOPMENT]: {
    PENDING: [TaskKey.DISCORD_AUTOROLE, TaskKey.DEFINE_SUBMISSION_DEADLINE],
    IN_PROGRESS: [],
  },

  // PHASE 5
  [PhaseOrder.EVALUATION]: {
    PENDING: [TaskKey.UPLOAD_EVALUATION_GRID],
    IN_PROGRESS: [TaskKey.EVALUATIONS_COMPLETED],
  },

  // PHASE 6
  [PhaseOrder.CLOSING]: {
    PENDING: [],
    IN_PROGRESS: [],
  },
}
