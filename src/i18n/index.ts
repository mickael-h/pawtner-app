import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      home: {
        title: "Welcome to Pawtner",
        subtitle: "You are now inside the authenticated area.",
      },
      auth: {
        connected: "Authenticated",
        notConnected: "Not authenticated",
        loginTitle: "Sign in with Keycloak",
        loginDescription: "Use OIDC to access marketplace features securely.",
        loginAction: "Sign in",
        logoutAction: "Sign out",
        issuer: "OIDC issuer: {{issuer}}",
      },
    },
  },
  fr: {
    translation: {
      home: {
        title: "Bienvenue sur Pawtner",
        subtitle: "Vous etes maintenant dans l espace authentifie.",
      },
      auth: {
        connected: "Authentifie",
        notConnected: "Non authentifie",
        loginTitle: "Connexion avec Keycloak",
        loginDescription:
          "Utilisez OIDC pour acceder de facon securisee aux fonctionnalites.",
        loginAction: "Se connecter",
        logoutAction: "Se deconnecter",
        issuer: "Fournisseur OIDC : {{issuer}}",
      },
    },
  },
};

const deviceLanguage = getLocales()[0]?.languageCode?.toLowerCase();
const initialLanguage = deviceLanguage === "fr" ? "fr" : "en";

void i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: "fr",
  interpolation: {
    escapeValue: false,
  },
});

export { i18n };
