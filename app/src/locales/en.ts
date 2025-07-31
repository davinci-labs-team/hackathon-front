import { announcements } from '@/tests/data/announcements'

export default {
  common: {
    close: 'Close',
    loading: 'Loading...',
    error: 'An error occurred, please try again later.',
    success: 'Operation completed successfully.',
    fieldRequired: 'This field is required',
    invalidEmail: 'Please enter a valid email address',
    profile: 'Profile',
    cancel: 'Cancel',
    delete: 'Delete',
  },
  hackathon: {
    title: 'Qubit or Not Qubit',
    subtitle: 'The Quantum Hackathon',
    description:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Veritatis saepe nulla commodi totam necessitatibus expedita autem ipsum, deserunt repudiandae porro itaque, consectetur ipsa dolorum ex, nisi eveniet voluptas ut adipisci?',
    inscriptionTitle: 'Registration',
    inscriptionMessage: 'Welcome! To join the event, please register below.',
    firstLoginBtn: 'First login',
    locationText: 'Register to see the exact location',
    dateText: '2 intensive days of coding',
  },
  login: {
    title: 'Login',
    organizerTitle: 'Administrator Login',
    organizer: 'Organizer Area',
    btn_login: 'Login',
    user: 'User Area',
    email: 'Email',
    password: 'Password',
    invalidCredentials: 'Invalid email or password',
  },
  partners: {
    title: 'PARTNERS',
  },
  announcements: {
    title: 'Last Announcements',
    writtenBy: 'Written by',
    on: 'on',
    noContent: 'No announcements available',
    confirmTitle: 'Confirm Deletion',
    confirmText: 'Are you sure you want to delete this announcement?',
  },
  // Roles sections
  organizer: {
    dashboard: 'Organizer Dashboard',
    announcements: {
      searchPlaceholder: 'Search',
      addButton: 'Create Announcement',
      addClicked: 'Add button clicked',
    },
    nav: {
      announcements: 'Announcements',
      users: 'User Management',
      teams: 'Team Management',
      projects: 'Projects Management',
      settings: 'Settings',
    },
  },
  jury: {
    dashboard: 'Jury Dashboard',
    nav: {
      dashboard: 'Dashboard',
      teams: 'My Teams',
      projects: 'Projects Evaluation',
      faq: 'FAQ',
    },
  },
  mentor: {
    dashboard: 'Mentor Dashboard',
    nav: {
      dashboard: 'Dashboard',
      teams: 'My Teams',
      projects: 'Projects Feedback',
      faq: 'FAQ',
    },
  },
  participant: {
    dashboard: 'Participant Dashboard',
    nav: {
      dashboard: 'Dashboard',
      teams: 'My Team',
      projects: 'Project submission',
      faq: 'FAQ',
    },
  },
  // Header and Footer
  header: {
    public: 'Public Header',
    organizer: 'Organizer Panel',
    user: 'User Panel',
  },
  footer: {
    copyright: '© 2025 Hackathon - All rights reserved',
    privacyPolicy: 'Privacy Policy',
    terms: 'Terms and Conditions',
    cookies: 'Cookies',
  },

  // Settings
  legalEditor: {
    title: 'Legal Notice',
    documentType: 'Type of document',
    privacyPolicy: 'Privacy Policy',
    termsConditions: 'Terms & Conditions',
    addSection: '+ Add Section',
    newSection: 'New Section',
    exportJSON: 'Export JSON',
    save: 'Save',
    delete: 'Delete',
    sections: {
      privacy: [
        { title: 'Introduction', content: 'Present your privacy policy.' },
        { title: 'Data Collected', content: 'Specify what personal data you collect.' },
        { title: 'Purpose of Processing', content: 'Explain why you collect this data.' },
        { title: 'Data Sharing', content: 'Specify if you share data with third parties.' },
        { title: 'Data Retention', content: 'Indicate how long data is retained.' },
        { title: 'User Rights', content: 'Explain rights (access, deletion, etc.).' },
        { title: 'Cookies', content: 'Explain use of cookies and how to refuse them.' },
        { title: 'Contact', content: 'Provide an email for exercising rights.' },
      ],
      terms: [
        { title: 'Introduction', content: 'Describe the purpose of the terms and conditions.' },
        { title: 'Site Access', content: 'Conditions for accessing and using the site.' },
        { title: 'Intellectual Property', content: 'Specify who owns copyrights and trademarks.' },
        {
          title: 'Responsibilities',
          content: 'Specify your responsibilities and those of the user.',
        },
        { title: 'Limitation of Liability', content: 'Specify the limits of your liability.' },
        { title: 'Applicable Law', content: 'Mention applicable law and jurisdiction.' },
        { title: 'Contact', content: 'Explain how to contact the team.' },
      ],
    },
    alertExport: 'JSON generated in the console.',
  },
}
