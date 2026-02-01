export interface FAQItemDTO {
  id?: string
  question: string
  answer: string
  createdAt?: string
}

export interface CreateFaqDto {
  question: string
  answer: string
}

export interface UpdateFaqDto {
  question?: string
  answer?: string
}
