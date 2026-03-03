# Pawtner Mobile App (`pawtner-app`)

Pawtner is a mobile‑first ethical animal marketplace and breeder back‑office.

This repo contains the **Expo React Native app**. It talks to:

- `pawtner-api` – Rust/Axum backend API
- `pawtner-infra` – Docker‑based infra (Postgres, Keycloak realm, demo data)

This README is for developers who want to understand the app architecture and get a dev environment running quickly.

---

## High‑level architecture

- **React Native + Expo**
  - Uses Expo Router for file‑based navigation (`app/(public)`, `app/(auth)`, `app/(app)`).
  - Targets Android, iOS, and (optionally) web.

- **TypeScript**
  - Strict typing with shared domain models under `src/features/shared/domain`.

- **State management**
  - Global auth state in a small **Zustand** store (`src/store/authStore.ts`).
  - All feature data (marketplace lists, back‑office data, PhotoLab state) uses local React state and hooks.

- **Auth**
  - Keycloak OIDC with PKCE using `react-native-app-auth`.
  - Bearer tokens & refresh handled centrally in `src/services/httpClient.ts`.

- **API integration**
  - `apiFetch<T>()` wrapper (base URL from env, bearer token, refresh‑on‑401, structured errors and logging).
  - Marketplace/back‑office services in `src/features/shared/services/marketplaceApi.ts`.

- **AI features**
  - Google Gemini integration in `src/features/shared/services/geminiService.ts`.
  - Used for:
    - Marketplace ethical advice,
    - BackOffice price audit,
    - PhotoLab AI retouch.

- **i18n**
  - `i18next` + `react-i18next`.
  - Full `en` and `fr` resources in `src/i18n/index.ts`.
  - Default language: **French**.

---

## Project layout

```text
pawtner-app/
  app/                    # Expo Router routes (public/auth/private groups)
  src/
    config/               # env loading
    store/                # Zustand auth store
    services/             # HTTP client, auth, error feedback
    features/
      auth/               # Sign-in screen + scaffold
      home/               # Public home + Ethical charter
      marketplace/        # Marketplace UI
      backOffice/         # Breeder back office UI + charting
      photoLab/           # AI Photo Lab
      shared/
        domain/           # Models, selectors, formatters
        data/             # Static image URLs
        services/         # Marketplace + Gemini services
        ui/               # Theme + shared components
    i18n/                 # i18next configuration
  package.json
  app.json
  .env.example
```

### Routing

Expo Router groups:

- `app/(public)` – public routes:
  - `/` → public home (`PublicHomeScreen`)
  - `/ethical-charter` → ethical charter (`EthicalCharterScreen`)
- `app/(auth)` – auth flow:
  - `/login` → Keycloak sign‑in (`SignInScreen`)
- `app/(app)` – authenticated app:
  - `/` → private home (links to features)
  - `/marketplace` → marketplace
  - `/back-office` → breeder back‑office
  - `/photo-lab` → AI Photo Lab

Auth gating:

- `app/index.tsx`:
  - If auth store not hydrated → show spinner
  - If authenticated → redirect to `/(app)`
  - Else → redirect to `/(public)`
- `app/(app)/_layout.tsx`:
  - If `!hydrated` → spinner
  - If `!isAuthenticated` → redirect to `/(auth)/login`
  - Else → render private stack

---

## Prerequisites

You’ll need:

- Node.js (min v22.11) + npm (or yarn/pnpm)
- Expo tooling (`npx expo` is fine; no global install required)
- Android/iOS dev environment if you want to run on emulator/simulator:
  - Android Studio + emulator, or
  - Xcode + iOS simulator, or
  - Expo Go on device.
- A running backend & infra:
  - `pawtner-api` – see that repo for API setup.
  - `pawtner-infra` – starts Postgres, Keycloak realm `pawtner`, and demo data.

**Important:** infra is **not** in this repo. Clone and start `pawtner-infra` separately, and configure `pawtner-api` accordingly.

---

## Environment configuration

The app uses Expo “public” env vars (prefixed with `EXPO_PUBLIC_`) read from `src/config/env.ts`.

Create an `.env` from `.env.example`:

```bash
cp .env.example .env
```

Default template:

```env
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:3000
EXPO_PUBLIC_KEYCLOAK_ISSUER=http://10.0.2.2:18080/realms/pawtner
EXPO_PUBLIC_KEYCLOAK_CLIENT_ID=pawtner-mobile
EXPO_PUBLIC_KEYCLOAK_REDIRECT_URL=com.pawtner.oauth://oauthredirect
EXPO_PUBLIC_ALLOW_INSECURE_HTTP=true
EXPO_PUBLIC_GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
```

Notes:

- `10.0.2.2` is the special host alias from an **Android emulator** to your host machine.
- For iOS simulator or physical devices, use your machine’s LAN IP instead (e.g. `http://192.168.1.x:3000` and adjust Keycloak accordingly).
- `EXPO_PUBLIC_GEMINI_API_KEY` is required to use AI-driven features. Without it, those flows will show localized error messages.

---

## Running the app

Install dependencies:

```bash
npm install
# or
yarn install
```

Start the dev server:

```bash
npm start         # expo start
```

Or directly:

```bash
npm run android   # Android emulator
npm run ios       # iOS simulator (macOS + Xcode required)
```

When the app starts:

1. Public home (`/(public)`) is shown for unauthenticated users.
2. Tapping “Explore the marketplace” (or equivalent in French) from public home will route to auth → Keycloak login.
3. Log in with a user created in Keycloak (e.g. `merchant_demo` or `client_demo` if using `pawtner-infra` defaults).

---

## Auth flow details

Core files:

- `src/services/auth/oidcClient.ts`
  - `loginWithOidc` and `signUpWithOidc` use `react-native-app-auth` with PKCE.
  - Scopes: `openid`, `profile`, `email`, `offline_access`.
- `src/store/authStore.ts`
  - Zustand store:
    - `accessToken`, `refreshToken`, `hydrated`, `isLoading`, `errorCode`, `errorDetail`.
    - Actions: `hydrate`, `signIn`, `signUp`, `signOut`, `refreshSession`.
  - Derived selector: `selectIsAuthenticated` from `accessToken`.
- `src/services/httpClient.ts`
  - `apiFetch<TResponse>(path, init?)`:
    - attaches bearer token from auth store.
    - on `401`:
      - calls `refreshSession()`,
      - retries once with refreshed token.
    - logs:
      - outgoing request: `[api] -> METHOD URL`
      - response: `[api] <- METHOD URL STATUS body=...`
    - throws `ApiError` on non‑OK status.

UI:

- `src/features/auth/screens/SignInScreen.tsx`
  - Shows progress spinner while auth is hydrating.
  - If already authenticated, redirects to `/(app)`.
  - On error, shows localized message (`auth.errors.*`) + error detail (e.g. Keycloak/HTTP error text).

---

## Features

### Marketplace

Files:

- `src/features/marketplace/screens/MarketplaceScreen.tsx`
- `src/features/shared/services/marketplaceApi.ts`

Behavior:

- Fetches public offers from `pawtner-api`:
  - `GET /api/v1/marketplace/offers`
  - Local filters:
    - animal type (`Chien/Chat/Cheval`),
    - listing type (`Vente/Saillie`),
    - search by name or breed.
- “Éleveur certifié XXXX” button:
  - calls `GET /api/v1/marketplace/merchants/{merchant_id}/reviews`,
  - uses Gemini to summarize trust from reviews.
- “Conseils IA” button:
  - calls Gemini with the animal breed and displays AI advice.

### Back Office

Files:

- `src/features/backOffice/screens/BackOfficeScreen.tsx`
- `src/features/backOffice/domain/chartData.ts`
- `src/features/backOffice/ui/BackOfficeCharts.tsx`

Behavior:

- Requires authenticated merchant token with appropriate role.
- Loads:
  - `GET /api/v1/merchant/offers` – merchant’s animals; used for “Femelles/Mâles” tabs and distribution bar chart.
  - `GET /api/v1/metrics/monthly-sales` – used for “Tendance des ventes” chart.
- Audit tab:
  - Takes animal type, breed, and price,
  - Calls Gemini to provide an ethical pricing assessment.

Charting:

- `buildMonthlySalesPoints` and `buildAnimalTypeDistribution` compute normalized ratios for simple RN bar charts.
- `BackOfficeCharts` renders:
  - vertical bar chart for sales trend,
  - horizontal bars for animals per type.

### Photo Lab

Files:

- `src/features/photoLab/screens/PhotoLabScreen.tsx`

Behavior:

- Lets user pick an image from gallery (via Expo Image Picker).
- Applies size constraints to base64 strings to avoid huge uploads.
- Calls Gemini with original image + prompt to generate an edited image.
- Shows either the AI edited image or descriptive placeholders.

---

## Shared modules

### Domain

`src/features/shared/domain/`:

- `models.ts` – (`Animal`, `Breeder`, `ListingType`, `AnimalType`, etc.).
- `selectors.ts` – pure functions:
  - `filterAnimals`, `getAverageRating`, `getBreederById`, `getFemaleAnimals`.
- `formatters.ts` – formatting helpers:
  - `formatPriceEur`, `formatMonthYear`.

These are unit‑tested in `*.test.ts`.

### UI & theme

`src/features/shared/ui/`:

- `theme.ts` – central design tokens (colors, spacing, radii, typography).
- `components/`:
  - `AppScreen` – consistent screen wrapper with padding/scrolling.
  - `AppCard` – card container.
  - `AppButton` – primary/secondary + loading state.
  - `AppTag` – pill tags for status/labels.
  - `AppTextField` – labeled text input.
  - `AppModalSheet` – bottom sheet wrapper.

---

## i18n

File: `src/i18n/index.ts`

- Uses `i18next` + `initReactI18next`.
- Two languages:
  - `en` (English)
  - `fr` (French) – default.
- Keys grouped by feature:
  - `home`, `auth`, `publicHome`, `charter`, `marketplace`, `backOffice`, `photoLab`.

When adding UI text:

1. Add keys to both `en` and `fr` translations.
2. Use `const { t } = useTranslation();` and `t("namespace.key")` in components.

---

## Testing

From the root of `pawtner-app`:

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # currently re-runs typecheck
npm run test        # domain tests + UI smoke tests
```

Tests:

- Domain/unit tests:
  - `src/features/shared/domain/selectors.test.ts`
  - `src/features/shared/domain/formatters.test.ts`
  - `src/features/backOffice/domain/chartData.test.ts`
- UI smoke tests (Jest + React Native Testing Library):
  - `src/navigation/__tests__/authRouting.test.tsx`
  - `src/features/auth/__tests__/SignInScreen.test.tsx`

---

## Debugging tips

- **API calls**
  - Check Metro/terminal logs for:
    - `[api] -> METHOD URL`
    - `[api] <- METHOD URL STATUS body=...`
  - If you see `401` followed by refresh attempts, verify:
    - `EXPO_PUBLIC_KEYCLOAK_ISSUER` matches Keycloak realm issuer.
    - API `KEYCLOAK_ISSUER`/`KEYCLOAK_AUDIENCE` match your token.

- **Identity conflicts**
  - Error like:
    - `identity conflict: username already linked to another subject`
  - Means `marketplace_users` has a row whose `keycloak_sub` does not match your current token `sub` for the same username.
  - In dev, you can clear `keycloak_sub` for that username in `pawtner_db` so it relinks on next request (see `pawtner-api/tests/endpoints.rs` for example SQL).

- **Gemini issues**
  - If AI features fail, confirm:
    - `EXPO_PUBLIC_GEMINI_API_KEY` is set and valid.
    - Network access to Google generative language API is allowed.
  - The UI will show localized “processing failed” messages with error details.

---

## Contributing

- Use feature‑first structure under `src/features/<feature>/...`.
- Keep domain models in `shared/domain`.
- Keep shared visual building blocks under `shared/ui`.
- Don’t hardcode user‑facing text; add it to `src/i18n/index.ts`.
- For new endpoints:
  - update `pawtner-api` (Rust + `openapi.yaml`),
  - then add a typed service under `src/features/shared/services/`.
- Add tests for core domain and service logic where practical.

If you’re unsure where to put something, a good heuristic:

- **UI/layout** → `src/features/<feature>/screens/` + `shared/ui`.
- **Pure logic** → `src/features/shared/domain/`.
- **Remote calls** → `src/features/shared/services/` integrating via `apiFetch`.
