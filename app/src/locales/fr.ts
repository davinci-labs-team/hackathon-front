export default {
  common: {
    close: 'Fermer',
    loading: 'Chargement...',
    error: 'Une erreur est survenue, veuillez réessayer plus tard.',
    success: 'Opération réussie avec succès.',
    fieldRequired: 'Ce champ est obligatoire',
    invalidEmail: 'Veuillez saisir une adresse email valide',
    profile: 'Profil',
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    create: 'Créer',
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
    privateHint: 'Visible uniquement par les utilisateurs authentifiés',
    addTitle: 'Créer une annonce',
    writtenBy: 'Écrit par',
    noContent: 'Aucune annonce disponible',
    confirmTitle: 'Confirmer la Suppression',
    confirmText: 'Êtes-vous sûr de vouloir supprimer cette annonce ?',
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
}
