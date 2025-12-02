import { ConfigurationKey } from './configurationKey'

function getDefaultPhases() {
  const phases = []
  const today = new Date()
  let previousEnd: Date | null = null

  for (let i = 1; i <= 6; i++) {
    let startDate: string | null = null
    let endDate: string | null = null

    if (i === 1) {
      startDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()).toISOString()
      endDate = new Date(new Date(startDate).getTime() + 2 * 24 * 60 * 60 * 1000).toISOString()
      previousEnd = new Date(endDate)
    } else if (i === 2) {
      startDate = null
      endDate = null
    } else {
      startDate = new Date(previousEnd!.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString()
      endDate = new Date(new Date(startDate).getTime() + 2 * 24 * 60 * 60 * 1000).toISOString()
      previousEnd = new Date(endDate)
    }

    phases.push({
      order: i,
      startDate,
      endDate,
    })
  }

  return phases
}


export const defaultConfigurations = {
  [ConfigurationKey.LEGAL]: {
    terms: [
      {
        id: 'introduction',
        title: { en: 'Introduction', fr: 'Introduction' },
        content: {
          en: 'Describe the purpose of the terms and conditions.',
          fr: "Décrivez l'objet des conditions générales.",
        },
        isDefault: true,
      },
      {
        id: 'site_access',
        title: { en: 'Site Access', fr: 'Accès au site' },
        content: {
          en: 'Conditions for accessing and using the site.',
          fr: "Conditions d'accès et d'utilisation du site.",
        },
        isDefault: true,
      },
      {
        id: 'intellectual_property',
        title: { en: 'Intellectual Property', fr: 'Propriété intellectuelle' },
        content: {
          en: 'Specify who owns copyrights and trademarks.',
          fr: "Précisez qui possède les droits d'auteur et les marques.",
        },
        isDefault: true,
      },
      {
        id: 'responsibilities',
        title: { en: 'Responsibilities', fr: 'Responsabilités' },
        content: {
          en: 'Specify your responsibilities and those of the user.',
          fr: "Précisez vos responsabilités et celles de l'utilisateur.",
        },
        isDefault: true,
      },
      {
        id: 'limitation_of_liability',
        title: { en: 'Limitation of Liability', fr: 'Limitation de responsabilité' },
        content: {
          en: 'Specify the limits of your liability.',
          fr: 'Précisez les limites de votre responsabilité.',
        },
        isDefault: true,
      },
      {
        id: 'applicable_law',
        title: { en: 'Applicable Law', fr: 'Droit applicable' },
        content: {
          en: 'Mention applicable law and jurisdiction.',
          fr: 'Mentionnez le droit applicable et la juridiction compétente.',
        },
        isDefault: true,
      },
      {
        id: 'contact',
        title: { en: 'Contact', fr: 'Contact' },
        content: {
          en: 'Explain how to contact the team.',
          fr: "Expliquez comment contacter l'équipe.",
        },
        isDefault: true,
      },
    ],
    privacy: [
      {
        id: 'introduction',
        title: { en: 'Introduction', fr: 'Introduction' },
        content: {
          en: 'Present your privacy policy.',
          fr: 'Présentez votre politique de confidentialité.',
        },
        isDefault: true,
      },
      {
        id: 'data_collected',
        title: { en: 'Data Collected', fr: 'Données collectées' },
        content: {
          en: 'Specify what personal data you collect.',
          fr: 'Précisez quelles données personnelles vous collectez.',
        },
        isDefault: true,
      },
      {
        id: 'purpose_of_processing',
        title: { en: 'Purpose of Processing', fr: 'Finalité du traitement' },
        content: {
          en: 'Explain why you collect this data.',
          fr: 'Expliquez pourquoi vous collectez ces données.',
        },
        isDefault: true,
      },
      {
        id: 'data_sharing',
        title: { en: 'Data Sharing', fr: 'Partage des données' },
        content: {
          en: 'Specify if you share data with third parties.',
          fr: 'Précisez si vous partagez des données avec des tiers.',
        },
        isDefault: true,
      },
      {
        id: 'data_retention',
        title: { en: 'Data Retention', fr: 'Conservation des données' },
        content: {
          en: 'Indicate how long data is retained.',
          fr: 'Indiquez combien de temps les données sont conservées.',
        },
        isDefault: true,
      },
      {
        id: 'user_rights',
        title: { en: 'User Rights', fr: "Droits de l'utilisateur" },
        content: {
          en: 'Explain rights (access, deletion, etc.)',
          fr: 'Expliquez les droits (accès, suppression, etc.)',
        },
        isDefault: true,
      },
      {
        id: 'cookies',
        title: { en: 'Cookies', fr: 'Cookies' },
        content: {
          en: 'Explain use of cookies and how to refuse them.',
          fr: "Expliquez l'utilisation des cookies et comment les refuser.",
        },
        isDefault: true,
      },
      {
        id: 'contact',
        title: { en: 'Contact', fr: 'Contact' },
        content: {
          en: 'Provide an email for exercising rights.',
          fr: 'Fournissez un email pour exercer vos droits.',
        },
        isDefault: true,
      },
    ],
  },
  [ConfigurationKey.MEDIA]: {
    instagram: null,
    facebook: null,
    linkedin: null,
    x: null,
    youtube: null,
    bannerPictureId: null,
    hackathonLogoId: null,
    evaluationGridPath: null,
  },
  [ConfigurationKey.TEXTS]: {
    hackathonName: '',
    slogan: '',
    hackathonDescription: '',
  },
  [ConfigurationKey.PHASES]: {
    phases: getDefaultPhases(),
  },
  [ConfigurationKey.PARTNERS]: [],
  [ConfigurationKey.MATCHMAKING]: {
    isActive: false,
    teamSizeMin: 1,
    teamSizeMax: 1,
    constraints: [],
  },
  [ConfigurationKey.THEMES]: [],
  [ConfigurationKey.MAILING]: {
    firstConnectionTemplate: {
      object: 'Welcome to {{hackathonName}}!',
      title: 'Welcome to {{hackathonName}}',
      introParagraph: 'You are invited to participate in {{hackathonName}}. We are excited to have you on board!',
      actionPrompt: 'To confirm your participation and access your account, please click the button below:',
      buttonText: 'Access to my account',
      closingNote: 'If you have any questions, our team is here to help you.',
      signatureSalutation: 'Best regards,',
      signatureName: 'The {{hackathonName}} Team',
    },
    passwordResetTemplate: {
      object: 'Password Reset Request for {{hackathonName}}',
      title: 'Password Reset Request',
      introParagraph: 'We received a request to reset your password for your account at {{hackathonName}}.',
      actionPrompt: 'To reset your password, please click the button below:',
      buttonText: 'Reset My Password',  
      closingNote: 'If you did not request a password reset, please ignore this email.',
      signatureSalutation: 'Best regards,',
      signatureName: 'The {{hackathonName}} Team',
    },
  },
}
