import { isDefaultClause } from "typescript"

export interface Translation {
  en: string
  fr: string
}

export interface Section {
  id: string
  title: Translation
  content: Translation
  isDefault: boolean
}

export interface LegalText {
  privacy: Section[]
  terms: Section[]
}
