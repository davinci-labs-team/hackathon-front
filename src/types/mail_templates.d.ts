export interface EmailTemplateDTO {
  /** L'objet de l'e-mail. */
  object: string

  /** Le titre de l'e-mail affiché dans l'onglet du navigateur */
  title: string

  /** Le premier paragraphe d'introduction. */
  introParagraph: string

  /** Le paragraphe ou la phrase accompagnant le bouton d'action. */
  actionPrompt: string

  /** Le texte affiché sur le bouton d'action. */
  buttonText: string

  /** Le paragraphe de conclusion ou de note importante avant la signature. */
  closingNote: string

  /** La formule de salutation avant le nom de l'expéditeur. */
  signatureSalutation: string

  /** Le nom affiché comme signataire. */
  signatureName: string
}

export interface MailingSettingsDTO {
  firstConnectionTemplate: EmailTemplateDTO
  passwordResetTemplate: EmailTemplateDTO
}
