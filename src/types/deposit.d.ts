import { UserRole } from '@/types/roles'

export interface DepositStatus {
    SUBMITTED: 'SUBMITTED'
    PENDING: 'PENDING'
    EVALUATED: 'EVALUATED'
    NOT_EVALUATED: 'NOT_EVALUATED'
}

export interface DepositDTO {
  id: string
  teamId: string
  files: string[]
  depositStatus: DepositStatus
  evaluationStatus: DepositStatus
dueDate: Date
comments?: string | null
submittedAt?: Date | null
feedback?: string | null
grade?: number | null
reviewedAt?: Date | null
}
