import { SubmissionStatus } from "./submission_status"
import { UserPreviewDTO } from "./team"

export interface SubmissionDTO {
  id: string
  teamId: string
  teamName: string // to set
  subjectId: string // to set
  grade: number | null
  status: SubmissionStatus
  createdAt: Date 
  updatedAt: Date 
  submissionFilePath: string | null
  githubLink: string | null

  juries: UserPreviewDTO[] // to set
  mentors: UserPreviewDTO[] // to set

  evaluations: EvaluationDTO[] | null
  comments: CommentDTO[] | null
}

export interface EvaluationDTO {
  id: string
  submissionId: string
  juryId: string
  juryName: string // to set
  grade: number
  comment: string | null 
  createdAt: Date
  evaluationFilePath: string | null
}

export interface CommentDTO {
  id: string
  submissionId: string
  mentorId: string
  mentorName: string // to set
  content: string
  createdAt: Date
}

export interface UpdateSubmissionDto {
  teamId?: string
  submissionFilePath?: string | null
  githubLink?: string | null
}