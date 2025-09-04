export interface AnnouncementDTO {
  id?: string
  title: string
  author: string
  createdAt: string
  lastModified?: string
  tags: string[]
  description: string
  existingImages?: string[]
  newImages?: File[]
  isPrivate: boolean
}
