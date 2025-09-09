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
