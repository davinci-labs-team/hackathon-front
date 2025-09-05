import { logout } from '@/services/authService'

export default {
  common: {
    close: 'Fermer',
    loading: 'Chargement...',
    error: 'Une erreur est survenue, veuillez réessayer plus tard.',
    success: 'Opération réussie avec succès.',
    fieldRequired: 'Ce champ est obligatoire',
    invalidEmail: 'Veuillez saisir une adresse email valide',
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    create: 'Créer',
    logout: 'Se déconnecter',
    saveChanges: 'Enregistrer les Modifications',
    changesSaved: 'Modifications enregistrées avec succès',
  },
  profile: {
    mainTitle: 'Mon Profil',
    otherUserTitle: 'Profil de',
    personalInfo: {
      title: 'Informations Personnelles',
      editButton: 'Modifier les Informations',
      saveButton: 'Enregistrer les Modifications',
      cancelButton: 'Annuler',
      name: 'Nom ',
      email: 'Email ',
      role: 'Rôle ',
      phone: 'Téléphone ',
      bio: 'Bio ',
      linkedin: 'LinkedIn ',
      github: 'GitHub ',
      website: 'Site Web ',
      noInfo: 'Aucune information supplémentaire fournie.',
    },
    otherUserInfoTitle: "Informations de l'Utilisateur",
  },
  roles: {
    organizer: 'Organisateur',
    jury: 'Jury',
    mentor: 'Mentor',
    participant: 'Participant',
  },
  hackathon: {
    title: 'Qubit or Not Qubit',
    subtitle: 'Le Hackathon Quantique',
    description:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Veritatis saepe nulla commodi totam necessitatibus expedita autem ipsum, deserunt repudiandae porro itaque, consectetur ipsa dolorum ex, nisi eveniet voluptas ut adipisci?',
    inscriptionTitle: 'Inscription',
    inscriptionMessage:
      "Bienvenue ! Pour rejoindre l'événement, veuillez vous inscrire ci-dessous.",
    firstLoginBtn: 'Première connexion',
    locationText: 'Inscrivez-vous pour connaître le lieu exact',
    dateText: '2 jours intensifs de codage',
  },
  login: {
    title: 'Connexion',
    organizerTitle: 'Connexion administrateur',
    btn_login: 'Se connecter',
    organizer: 'Espace Organisateur',
    user: 'Espace Utilisateur',
    email: 'Email',
    password: 'Mot de passe',
    invalidCredentials: 'Email ou mot de passe invalide',
    accessDenied: 'Accès refusé. Espace organisateur uniquement.',
  },
  partners: {
    title: 'PARTENAIRES',
  },
  announcements: {
    lastAnnouncements: 'Dernières Annonces',
    title: "Titre de l'annonce",
    content: "Contenu de l'annonce",
    tags: 'Tags',
    tagsHint: 'Séparés par des virgules',
    private: 'Annonce Privée',
    public: 'Annonce Publique',
    privateHint: 'Visible uniquement par les utilisateurs authentifiés',
    publicHint: 'Visible par tous les utilisateurs',
    addTitle: 'Créer une annonce',
    editTitle: 'Modifier l’annonce',
    writtenBy: 'Écrit par',
    noContent: 'Aucune annonce disponible',
    confirmTitle: 'Confirmer la Suppression',
    confirmText: 'Êtes-vous sûr de vouloir supprimer cette annonce ?',
    images: 'Ajouter des images',
    max3Images: 'Vous pouvez ajouter jusqu’à 3 images.',
  },

  // Roles sections
  organizer: {
    dashboard: 'Tableau de bord Organisateur',
    announcements: {
      searchPlaceholder: 'Rechercher',
      addButton: 'Créer une annonce',
      addClicked: 'Bouton d’ajout cliqué',
    },
    nav: {
      announcements: 'Annonces',
      users: 'Gestion des utilisateurs',
      teams: 'Gestion des équipes',
      projects: 'Gestion des dépôts',
      settings: 'Paramètres',
    },
  },
  jury: {
    dashboard: 'Tableau de bord Jury',
    nav: {
      dashboard: 'Dashboard',
      teams: 'Mes Équipes',
      projects: 'Évaluation des Projets',
      faq: 'FAQ',
    },
  },
  mentor: {
    dashboard: 'Tableau de bord Mentor',
    nav: {
      dashboard: 'Dashboard',
      teams: 'Mes Équipes',
      projects: 'Feedback des Projets',
      faq: 'FAQ',
    },
  },
  participant: {
    dashboard: 'Tableau de bord Participant',
    nav: {
      dashboard: 'Dashboard',
      teams: 'Mon Équipe',
      projects: 'Dépôt de Projet',
      faq: 'FAQ',
    },
  },

  // Header and Footer
  header: {
    public: 'En-tête Public',
    organizer: 'Panneau Organisateur',
    user: 'Panneau Utilisateur',
  },
  footer: {
    copyright: '© 2025 Hackathon - Tous droits réservés',
    privacyPolicy: 'Politique de confidentialité',
    terms: 'Conditions générales',
    cookies: 'Cookies',
  },

  // Settings
  legalEditor: {
    title: 'Mentions Légales',
    subtitle: 'Gérez les documents légaux de votre hackathon',
    documentType: 'Type de document',
    privacyPolicy: 'Politique de Confidentialité',
    termsConditions: 'Conditions Générales',
    addSection: '+ Ajouter une section',
    newSection: 'Nouvelle section',
    exportJSON: 'Exporter en JSON',
    save: 'Sauvegarder',
    delete: 'Supprimer',
    sections: {
      privacy: [
        { title: 'Introduction', content: 'Présentez votre politique de confidentialité.' },
        {
          title: 'Données collectées',
          content: 'Indiquez quelles données personnelles vous collectez.',
        },
        {
          title: 'Finalités du traitement',
          content: 'Expliquez pourquoi vous collectez ces données.',
        },
        {
          title: 'Partage des données',
          content: 'Précisez si vous partagez les données avec des tiers.',
        },
        {
          title: 'Conservation des données',
          content: 'Indiquez combien de temps les données sont conservées.',
        },
        {
          title: 'Droits des utilisateurs',
          content: 'Expliquez les droits (accès, suppression, etc.).',
        },
        { title: 'Cookies', content: 'Indiquez l’utilisation des cookies et comment les refuser.' },
        { title: 'Contact', content: 'Précisez un email pour exercer les droits.' },
      ],
      terms: [
        {
          title: 'Introduction',
          content: "Décrivez le but des conditions générales d'utilisation.",
        },
        { title: 'Accès au site', content: "Conditions d'accès et utilisation du site." },
        {
          title: 'Propriété intellectuelle',
          content: "Indiquez qui détient les droits d'auteur et marques.",
        },
        {
          title: 'Responsabilités',
          content: "Précisez vos responsabilités et celles de l'utilisateur.",
        },
        {
          title: 'Limitation de responsabilité',
          content: 'Indiquez les limites de votre responsabilité.',
        },
        {
          title: 'Loi applicable',
          content: 'Mentionnez le droit applicable et la juridiction compétente.',
        },
        { title: 'Contact', content: "Précisez comment contacter l'équipe." },
      ],
    },
    alertExport: 'JSON généré dans la console.',
  },
  texts_faq_title: 'Textes & FAQ',
  textsSettings: {
    title: 'Textes',
    subtitle: "Gérez les textes affichés sur l'interface utilisateur",
    slogan: 'Slogan',
    hackathonDescription: 'Description du Hackathon',
    hackathonName: 'Nom du Hackathon',
    errors: {
      sloganRequired: 'Le slogan est obligatoire.',
      descriptionRequired: 'La description du hackathon est obligatoire.',
      nameRequired: 'Le nom du hackathon est obligatoire.',
      maxLength: 'La longueur maximale est dépassée.',
    },
  },
  mediaSettings: {
    title: 'Médias',
    subtitle: "Gérez les images et logos utilisés dans l'application",
  },
  partnersSettings: {
    title: 'Partenaires',
    subtitle: "Gérez les partenaires affichés dans l'application",
  },
  faqSettings: {
    title: 'FAQ',
    subtitle: "Gérez les questions fréquemment posées dans l'application",
    question: 'Question',
    answer: 'Réponse',
    addQuestionBtn: '+ Ajouter une question',
    addQuestion: 'Nouvelle Question',
    editQuestion: 'Modifier la question',
    deleteQuestion: 'Supprimer la question',
    confirmTitle: 'Confirmer la suppression',
    confirmText: 'Êtes-vous sûr de vouloir supprimer cette question ?',
    noQuestions: 'Aucune question disponible.',
  },
  matchmakingSettings: {
    title: 'Matchmaking',
    subtitle: 'Configurez les paramètres de matchmaking pour le hackathon',
    enable: 'Activer le Matchmaking',
    disable: 'Désactiver le Matchmaking',
    criteria: 'Critères de Matchmaking',
    addCriterion: '+ Ajouter un critère',
    editCriterion: 'Modifier le critère',
    deleteCriterion: 'Supprimer le critère',
  },
  communicationSettings: {
    title: 'Communication',
    subtitle: 'Gérez les paramètres de communication pour le hackathon',
  },
  planningSettings: {
    title: 'Dates & Planning',
    subtitle: "Gérez le planning de l'événement et les sessions",
  },

  // FAQ Section
  faq: {
    title: 'Foire Aux Questions',
    noQuestions: 'Aucune question disponible pour le moment.',
    question: 'Question',
    answer: 'Réponse',
  },
}
