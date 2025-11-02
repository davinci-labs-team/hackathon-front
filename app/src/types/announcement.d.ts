export interface AnnouncementDTO {
  id: string
  title: string
  author: string
  tags?: string[]
  content: string
  files?: string[]
  isPrivate: boolean
  createdAt: string
}


export interface CreateAnnouncementDTO { 
  title: string
  tags: string[]
  content: string
  isPrivate : boolean
  files? : string[]
}

export type UpdateAnnouncementDTO = Partial<CreateAnnouncementDTO>;