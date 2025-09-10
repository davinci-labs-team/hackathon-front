export interface HackathonGeneralInfoDTO {
  name: string
  slogan: string
  description: string
}

export interface HackathonPhaseDTO {
  order: number
  startDate: string | null
  endDate: string | null
}

export interface PartnersDTO {
  name: string
  logoId: string
  websiteUrl: string
  isParticipatingSchool: boolean
}

export interface HackathonMediaDTO {
  bannerPictureId: string | null
  hackathonLogoId: string | null
  instagram: string | null
  linkedin: string | null
  facebook: string | null
  x: string | null
  youtube: string | null
}

export interface SettingResponse {
  id: string
  key: string
  value: any // JSON flexible
  createdAt: string
  updatedAt: string
}

export interface CreateSettingDTO {
  key: string
  value: any
}

export interface UpdateSettingDTO {
  key?: string
  value?: any
}
