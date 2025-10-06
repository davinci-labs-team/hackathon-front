import { isAccessor } from 'typescript'

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
  id: string
  name: string
  logoId: string
  websiteUrl: string
  isParticipatingSchool: boolean
}

export interface HackathonTextDTO {
  hackathonName: string
  slogan? : string
  hackathonDescription: string
  location?: string
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

export interface ConfigurationResponse {
  id: string
  key: string
  value: any
  createdAt: string
  updatedAt: string
}

export interface CreateConfigurationDTO {
  key: string
  value: any
}

export interface UpdateConfigurationDTO {
  key?: string
  value?: any
}

export interface ConstraintDTO {
  rule: 'MIN' | 'MAX' | 'EQUAL'
  schools: string[]
  value: number
  multiple: boolean
}

export interface MatchmakingSettingsDTO {
  isActive: boolean
  teamSizeMin: number
  teamSizeMax: number
  constraints: ConstraintDTO[]
}

export interface SubjectDTO {
  id: string
  name: string
  description: string
}

export interface ThemesDTO {
  id: string
  name: string
  description: string
  subjects: SubjectDTO[]
}
