import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      home: {
        title: "Welcome to Pawtner",
        subtitle: "You are now inside the authenticated area.",
        marketplaceLink: "Marketplace",
        backOfficeLink: "Back Office",
        photoLabLink: "Photo Lab",
      },
      auth: {
        connected: "Authenticated",
        notConnected: "Not authenticated",
        pawtnerId: "Pawtner ID",
        welcomeTitle: "Welcome to Pawtner",
        welcomeSubtitle:
          "Ethical breeding platform with secure access for families and breeders.",
        loginTitle: "Sign in to Pawtner",
        loginDescription:
          "Access your marketplace, back-office, and photo tools securely.",
        loginAction: "Sign in",
        signupAction: "Create account",
        noAccount: "New to Pawtner?",
        logoutAction: "Sign out",
        errors: {
          cancelled: "Authentication was cancelled.",
          network: "Network error. Please check your connection and retry.",
          oidcUnavailable: "Authentication service is temporarily unavailable.",
          unknown: "Authentication failed. Please try again.",
        },
      },
      publicHome: {
        heroTag: "Leading ethical platform",
        heroTitlePrefix: "Conscious breeding",
        heroTitleAccent: "for everyone",
        heroSubtitle:
          "Connect with certified breeders and manage animal well-being with AI.",
        heroPrimaryAction: "Explore marketplace",
        heroSecondaryAction: "Ethical charter",
        familyTag: "Pawtner family label",
        familyTitle: "Love at the heart of home",
        familyDescription:
          "We prioritize passionate breeders who integrate companions into daily family life.",
        familyImageFallback: "Family breeding image is temporarily unavailable.",
        valueOneTitle: "No puppy mills",
        valueOneDescription:
          "Rigorous breeder audits to guarantee healthy and responsible conditions.",
        valueTwoTitle: "Rudy predictive AI",
        valueTwoDescription:
          "An intelligent assistant to guide decisions on animal well-being.",
        valueThreeTitle: "CSR and engagement",
        valueThreeDescription:
          "Part of our revenue supports active animal protection actions.",
      },
      charter: {
        tag: "Public",
        title: "Pawtner ethical charter",
        intro:
          "Pawtner puts animal welfare at the center of every decision. This charter formalizes our commitments to animals, breeders, and families.",
        commitmentOne:
          "No industrial breeder and no over-breeding practices.",
        commitmentTwo:
          "Transparency on health, socialization, and traceability.",
        commitmentThree:
          "Veterinary follow-up and a respectful living environment.",
        commitmentFour:
          "Responsible support for adoptive families before and after adoption.",
      },
      marketplace: {
        title: "Ethical marketplace",
        subtitle:
          "Discover companions raised with transparency and well-being.",
        searchLabel: "Search",
        searchPlaceholder: "Breed or name",
        filterAll: "All",
        emptyTitle: "No results",
        emptyText: "Adjust your filters to continue.",
        loadingOffers: "Loading offers...",
        loadFailed: "Marketplace data is unavailable right now. Please retry.",
        breederFallbackName: "Certified breeder {{code}}",
        breederHint: "Tap to load trust details",
        breederRating: "Rating {{rating}} ({{count}} reviews)",
        insightButton: "AI advice",
        insightLoading: "Loading advice...",
        insightUnavailable: "Analysis is unavailable right now. Please retry.",
        trustUnavailable: "Trust summary is unavailable right now.",
        insightModalTitle: "Advice for {{breed}}",
        modalLoading: "Loading...",
        trustLoading: "Trust analysis in progress...",
      },
      backOffice: {
        title: "Breeder back office",
        tabDashboard: "Dashboard",
        tabFemales: "Females",
        tabMales: "Males",
        tabAudit: "Audit",
        auditInvalidInput: "Please provide a valid breed and price.",
        auditUnavailable: "Audit is unavailable right now. Please retry.",
        salesLabel: "Monthly sales",
        salesValue: "12 400 EUR",
        salesDetail: "+14% vs last month",
        littersLabel: "Current litters",
        littersValue: "3",
        littersDetail: "2 Maine Coon, 1 Golden",
        scoreLabel: "Ethical score",
        scoreValue: "95 / 100",
        scoreDetail: "Trusted breeder",
        loadingData: "Loading dashboard data...",
        loadFailed: "Back-office data is unavailable right now. Please retry.",
        noData: "No data available for this chart.",
        chartsSectionTitle: "Performance trends",
        salesTrendTitle: "Sales trend (6 months)",
        populationByTypeTitle: "Animals by type",
        deferredCharts:
          "Detailed charts are deferred to the next phase for robust native integration.",
        cycleUnknown: "Cycle not provided",
        studAvailable: "Stud available",
        studStandard: "Standard",
        auditTitle: "Ethical price audit",
        breedLabel: "Breed",
        breedPlaceholder: "Example: Golden Retriever",
        priceLabel: "Price (EUR)",
        pricePlaceholder: "Example: 1800",
        launchAudit: "Run audit",
      },
      photoLab: {
        defaultPrompt:
          "Make the background greener and more lush, and make the animal look at the camera with a soft expression.",
        permissionDenied: "Gallery permission was denied.",
        imageReadFailed: "Cannot read the selected image.",
        imageTooLarge: "Image is too large. Choose a lighter image.",
        selectImageFirst: "Select an image before launching retouch.",
        processingFailed:
          "Retouch failed. Check your Gemini key and retry.",
        title: "Photo Lab AI",
        subtitle:
          "Enhance your listings with our AI specialized in animal photography.",
        originalImageTitle: "Original image",
        noImageSelected: "No image selected",
        pickImage: "Choose an image",
        instructionsTitle: "AI instructions",
        promptLabel: "Prompt",
        promptPlaceholder: "Describe the retouch you want",
        launchMagic: "Launch magic",
        resultTitle: "AI result",
        resultPlaceholder: "The edited result will appear here",
      },
    },
  },
  fr: {
    translation: {
      home: {
        title: "Bienvenue sur Pawtner",
        subtitle: "Vous êtes maintenant dans l’espace authentifié.",
        marketplaceLink: "Marketplace",
        backOfficeLink: "Back Office",
        photoLabLink: "Photo Lab",
      },
      auth: {
        connected: "Authentifié",
        notConnected: "Non authentifié",
        pawtnerId: "Identité Pawtner",
        welcomeTitle: "Bienvenue sur Pawtner",
        welcomeSubtitle:
          "Plateforme d’élevage éthique avec accès sécurisé pour familles et éleveurs.",
        loginTitle: "Connexion à Pawtner",
        loginDescription:
          "Accédez à votre marketplace, back-office et outils photo en toute sécurité.",
        loginAction: "Se connecter",
        signupAction: "Créer mon compte",
        noAccount: "Vous découvrez Pawtner ?",
        logoutAction: "Se déconnecter",
        errors: {
          cancelled: "L'authentification a été annulée.",
          network: "Erreur réseau. Vérifiez votre connexion et réessayez.",
          oidcUnavailable: "Le service d'authentification est momentanément indisponible.",
          unknown: "Échec de l'authentification. Veuillez réessayer.",
        },
      },
      publicHome: {
        heroTag: "Plateforme éthique de référence",
        heroTitlePrefix: "L’élevage",
        heroTitleAccent: "conscient",
        heroSubtitle:
          "Connectez-vous avec des éleveurs certifiés et gérez le bien-être animal avec IA.",
        heroPrimaryAction: "Explorer le marché",
        heroSecondaryAction: "Charte éthique",
        familyTag: "Label familial Pawtner",
        familyTitle: "L'amour au cœur du foyer",
        familyDescription:
          "Nous privilégions les éleveurs passionnés qui intègrent leurs compagnons à leur vie quotidienne.",
        familyImageFallback:
          "L'image de l'élevage familial est momentanément indisponible.",
        valueOneTitle: "Zéro usine à chiots",
        valueOneDescription:
          "Audit rigoureux des éleveurs pour garantir les conditions sanitaires.",
        valueTwoTitle: "IA prédictive Rudy",
        valueTwoDescription:
          "Assistant intelligent pour guider les décisions de bien-être animal.",
        valueThreeTitle: "RSE et engagement",
        valueThreeDescription:
          "Une part des bénéfices soutient activement la protection animale.",
      },
      charter: {
        tag: "Public",
        title: "Charte éthique Pawtner",
        intro:
          "Pawtner place le bien-être animal au centre de chaque décision. Cette charte formalise nos engagements envers les animaux, les éleveurs et les familles.",
        commitmentOne:
          "Aucun éleveur industriel ni pratique de sur-reproduction.",
        commitmentTwo:
          "Transparence sur la santé, la socialisation et la traçabilité des animaux.",
        commitmentThree:
          "Suivi vétérinaire et environnement respectueux du vivant.",
        commitmentFour:
          "Accompagnement responsable des adoptants avant et après adoption.",
      },
      marketplace: {
        title: "Marketplace éthique",
        subtitle:
          "Découvrez des compagnons élevés avec transparence et bien-être.",
        searchLabel: "Recherche",
        searchPlaceholder: "Race ou nom",
        filterAll: "Tous",
        emptyTitle: "Aucun résultat",
        emptyText: "Modifiez vos filtres pour continuer.",
        loadingOffers: "Chargement des annonces...",
        loadFailed:
          "Les données marketplace sont indisponibles pour le moment. Veuillez réessayer.",
        breederFallbackName: "Éleveur certifié {{code}}",
        breederHint: "Touchez pour charger les détails de confiance",
        breederRating: "Note {{rating}} ({{count}} avis)",
        insightButton: "Conseils IA",
        insightLoading: "Chargement des conseils...",
        insightUnavailable:
          "Analyse indisponible actuellement. Veuillez réessayer.",
        trustUnavailable:
          "Synthèse de confiance indisponible pour le moment.",
        insightModalTitle: "Conseils pour {{breed}}",
        modalLoading: "Chargement...",
        trustLoading: "Analyse de confiance en cours...",
      },
      backOffice: {
        title: "Back office éleveur",
        tabDashboard: "Dashboard",
        tabFemales: "Femelles",
        tabMales: "Mâles",
        tabAudit: "Audit",
        auditInvalidInput: "Veuillez renseigner une race et un prix valide.",
        auditUnavailable:
          "Audit indisponible actuellement. Merci de réessayer.",
        salesLabel: "Ventes mensuelles",
        salesValue: "12 400 EUR",
        salesDetail: "+14% vs mois dernier",
        littersLabel: "Portées en cours",
        littersValue: "3",
        littersDetail: "2 Maine Coon, 1 Golden",
        scoreLabel: "Score label éthique",
        scoreValue: "95 / 100",
        scoreDetail: "Éleveur de confiance",
        loadingData: "Chargement des données du dashboard...",
        loadFailed:
          "Les données du back-office sont indisponibles pour le moment. Veuillez réessayer.",
        noData: "Aucune donnée disponible pour ce graphique.",
        chartsSectionTitle: "Tendances de performance",
        salesTrendTitle: "Tendance des ventes (6 mois)",
        populationByTypeTitle: "Animaux par type",
        deferredCharts:
          "Les graphiques détaillés sont différés à la prochaine phase pour une intégration native robuste.",
        cycleUnknown: "Cycle non renseigné",
        studAvailable: "Disponible saillie",
        studStandard: "Standard",
        auditTitle: "Audit de prix éthique",
        breedLabel: "Race",
        breedPlaceholder: "Ex: Golden Retriever",
        priceLabel: "Prix (EUR)",
        pricePlaceholder: "Ex: 1800",
        launchAudit: "Lancer l'audit",
      },
      photoLab: {
        defaultPrompt:
          "Rends le fond plus vert et luxuriant, et fais en sorte que l'animal regarde l'objectif avec un regard doux.",
        permissionDenied: "Permission galerie refusée.",
        imageReadFailed: "Impossible de lire l'image sélectionnée.",
        imageTooLarge:
          "Image trop volumineuse, choisissez une image plus légère.",
        selectImageFirst: "Sélectionnez une image avant de lancer la retouche.",
        processingFailed:
          "Erreur lors de la retouche. Vérifiez la clé Gemini et réessayez.",
        title: "Photo Lab AI",
        subtitle:
          "Sublimez vos annonces grâce à notre IA spécialisée en photographie animale.",
        originalImageTitle: "Image originale",
        noImageSelected: "Aucune image sélectionnée",
        pickImage: "Choisir une image",
        instructionsTitle: "Instructions IA",
        promptLabel: "Prompt",
        promptPlaceholder: "Décrivez la retouche souhaitée",
        launchMagic: "Lancer la magie",
        resultTitle: "Résultat IA",
        resultPlaceholder: "Le résultat retouché apparaîtra ici",
      },
    },
  },
};

// Product decision: app boots in French by default.
// We can add user-selectable language later and persist it.
const initialLanguage = "fr";

void i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: "fr",
  interpolation: {
    escapeValue: false,
  },
});

export { i18n };
