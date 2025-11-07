import { UserPreviewDTO } from "./team"
import { UserRole } from "./user"
import { SubmissionStatus } from "./submissionStatus"

export interface SubmissionDTO {
    teamId: string
    teamName: string
    subjectId: string
    juries: UserPreviewDTO[]
    mentors: UserPreviewDTO[]
    status: SubmissionStatus
    grade: number | null
    comments: SubmissionCommentDTO[]
  }
  
  export interface SubmissionCommentDTO {
    userId: string
    userName: string
    role: UserRole
    comment: string
    grade?: number
    createdAt: string
  }