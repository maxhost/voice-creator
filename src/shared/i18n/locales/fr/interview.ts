/**
 * French translations for Interview Page
 */
export const interview = {
  page: {
    greeting: 'Bonjour',
    paymentVerified: 'Paiement vérifié',
    yourInterview: 'Votre entretien',
  },
  states: {
    verifying: 'Vérification de votre paiement...',
    verificationError: 'Erreur de vérification',
    verificationErrorMessage: 'Nous n\'avons pas pu vérifier votre paiement. Veuillez réessayer.',
    backToHome: 'Retour à l\'accueil',
    sessionUsed: 'Session déjà utilisée',
    sessionUsedMessage: 'Cette session de paiement a déjà été utilisée pour un entretien.',
    buyNewSession: 'Acheter une nouvelle session',
    generating: 'Génération de vos idées',
    generatingMessage: 'Nous analysons votre entretien et créons des idées de contenu personnalisées...',
  },
  panel: {
    languageHint: 'Vous pouvez parler dans n\'importe quelle langue et l\'IA répondra dans cette langue',
    timeUp: 'Le temps est écoulé. Veuillez patienter pendant que nous générons vos idées...',
    lastResponseWarning: 'Dernière chance de parler. L\'IA donnera sa réponse finale.',
    status: {
      yourTurn: 'À vous - Maintenez pour parler',
      recording: 'Enregistrement... Relâchez pour envoyer',
      aiSpeaking: 'L\'IA parle...',
      processing: 'Traitement en cours...',
    },
    instructions: 'Cliquez et maintenez · Touchez et maintenez · Ou appuyez sur la barre d\'espace',
  },
  onboarding: {
    title: 'Avant de commencer...',
    subtitle: 'Parlez-nous un peu de vous pour personnaliser votre entretien',
    nameLabel: 'Votre nom',
    namePlaceholder: 'Quel est votre nom ?',
    networksLabel: 'Pour quels réseaux sociaux souhaitez-vous créer du contenu ?',
    networksHint: 'Sélectionnez au moins un réseau social',
    expertiseLabel: 'Quels sujets maîtrisez-vous ou souhaitez-vous créer du contenu à leur sujet ?',
    expertisePlaceholder: 'Ex : Marketing digital, productivité, développement personnel, cuisine, fitness...',
    submit: 'Commencer l\'entretien',
  },
  payment: {
    title: 'Commencer l\'entretien',
    earlyAccess: 'Accès anticipé - Paiement unique',
    features: {
      interview: 'Entretien IA de 10 minutes',
      ideas: 'Minimum 4 idées de contenu garanties',
      pdf: 'Téléchargement PDF',
    },
    securePayment: 'Paiement sécurisé traité par Stripe',
  },
  transcript: {
    placeholder: 'La conversation apparaîtra ici',
    you: 'Vous',
    ai: 'IA',
  },
  thinking: 'Réflexion...',
  recordButton: {
    recording: 'Enregistrement...',
    processing: 'Traitement...',
    holdToRecord: 'Maintenez pour enregistrer',
  },
  micErrors: {
    denied: 'Permission du microphone refusée. Veuillez l\'activer dans les paramètres de votre navigateur.',
    notFound: 'Impossible d\'accéder au microphone. Veuillez autoriser l\'accès dans votre navigateur.',
  },
};
