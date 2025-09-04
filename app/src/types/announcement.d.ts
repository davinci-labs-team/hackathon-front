export interface Announcement {
  id?: string
  title: string
  author: string
  publishedDate: string
  lastModified?: string
  tags: string[]
  description: string
  images?: string[]
  isPrivate: boolean
}
