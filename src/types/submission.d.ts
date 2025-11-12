import { UserRole } from '@/types/roles'

export interface SubmissionStatus {
    GRADED: 'GRADED'
    PENDING: 'PENDING'
    NOT_SUBMITTED: 'NOT_SUBMITTED'
}

export interface SubmissionDTO {
  id: string
  teamId: string
  grade?: number | null
  status: SubmissionStatus
  createdAt?: Date | null
  updatedAt?: Date | null
  submissionFilePath?: string | null
  githubLink?: string | null
  evaluations?: EvaluationDTO[] | null
  comments?: CommentDTO[] | null
}

export interface UpdateSubmissionDto {
  teamId: string
  submissionFilePath?: string | null
}

export interface EvaluationDTO {
  id: string
  submissionId: string
  juryId: string
  grade: number
  comment?: string | null
  createdAt?: Date | null
  evaluationFilePath?: string | null
}

export interface CommentDTO {
  id: string
  submissionId: string
  mentorId: string
  content?: string | null
  createdAt?: Date | null
}

