export interface FAQItemDTO {
  id?: string
  question: string
  answer: string
  isPrivate: boolean
  createdAt?: string
}

export interface CreateFaqDto {
  question: string
  answer: string
  isPrivate: boolean
}

export interface UpdateFaqDto {
  question?: string
  answer?: string
  isPrivate?: boolean
}
