import { UserPreviewDTO } from "./team"
import { UserRole } from "./user"
import { SubmissionStatus } from "./submissionStatus"

export interface SubmissionDTO {
    id: string
    teamId: string
    teamName: string
    subjectId: string
    juries: UserPreviewDTO[]
    status: SubmissionStatus
    grade: number | null
    comments: SubmissionCommentDTO[]
    createdAt: string
    updatedAt: string
  }
  
  export interface SubmissionCommentDTO {
    userId: string
    userName: string
    role: UserRole
    content: string
    grade?: number              // present if the comment is from a jury member
    evaluationFilePath?: string // present if the comment is from a jury member
    createdAt: string
  }