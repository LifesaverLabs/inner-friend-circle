# Inner Friend

**Curate Your Closest Relationships**

Inner Friend is a relationship support and tending app that helps you intentionally nurture your closest friendships based on Dunbar's Number research. Instead of endless scrolling, invest quality time in real relationships.

*Face Time, Not Ad Time.*

## What is Dunbar's Number?

Research by anthropologist Robin Dunbar shows humans can maintain meaningful relationships at different scales:

- **Core (5)** — Your closest confidants, the people you trust most
- **Inner (15)** — Close friends you connect with regularly
- **Outer (50)** — Good friends and your extended circle
- **Naybors (variable)** — Trusted neighbors for mutual aid and emergencies
- **Acquainted (150)** — People you know well enough to greet
- **Role Models (unlimited)** — People whose life stories inspire you
- **Parasocial (unlimited)** — Celebrities and content creators you follow

## Features

### Core Features
- **Intentional Limits** — Science-backed caps on each tier help you focus on quality over quantity
- **Private by Default** — Your lists stay on your device; account creation is optional
- **Tending Reminders** — Get notified when you haven't contacted someone in a while
- **Drag & Drop** — Easily reorder and tend to friends within tiers
- **Multiple Contact Methods** — Phone, FaceTime, WhatsApp, Signal, Telegram, SMS

### Naybor Features
- **Naybor SOS** — Quick access to trusted neighbors for emergencies and mutual aid
- **Keys Shared** — Securely track who has keys to your home for emergencies
- **Emergency Entry Permissions** — Define when naybors can enter during emergencies

### Privacy & Data Rights (GDPR Compliant)
- **Cookie Consent** — Granular control over cookies (essential, functional, analytics, marketing)
- **Data Export** — Export all your data anytime in JSON format (Data Liberation Front compliant)
- **Account Deletion** — 30-day grace period with full data removal
- **Consent Management** — View, manage, and withdraw consent at any time
- **Age Verification** — GDPR Article 8 compliant for users under 16

### Social Features
- **Mutual Discovery** — Optionally discover when friends have you on their list too
- **Bridging Protocol** — Core and Inner feeds emphasize calls and meetups over passive likes
- **Bulk Contact Import** — Import contacts from phone, vCard, or CSV files

### Internationalization
- **23 Languages** — Full translations including accessibility labels
- **RTL Support** — Arabic, Urdu, and Hebrew with proper right-to-left layout
- **Prominent Language Selector** — Easily switch languages from any page

## Supported Languages

Inner Friend supports 23 languages with complete translations including accessibility labels:

| Language | Endonym | Direction |
|----------|---------|-----------|
| English | English | LTR |
| Chinese | 简体中文 | LTR |
| Hindi | हिन्दी | LTR |
| Spanish | Español | LTR |
| French | Français | LTR |
| Arabic | العربية | RTL |
| Bengali | বাংলা | LTR |
| Portuguese | Português | LTR |
| Russian | Русский | LTR |
| Japanese | 日本語 | LTR |
| Punjabi | ਪੰਜਾਬੀ | LTR |
| German | Deutsch | LTR |
| Javanese | Basa Jawa | LTR |
| Korean | 한국어 | LTR |
| Telugu | తెలుగు | LTR |
| Vietnamese | Tiếng Việt | LTR |
| Marathi | मराठी | LTR |
| Tamil | தமிழ் | LTR |
| Turkish | Türkçe | LTR |
| Italian | Italiano | LTR |
| Urdu | اردو | RTL |
| Hebrew | עברית | RTL |
| Blesséd | Blesséd | LTR |

## Tech Stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) for fast development
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [shadcn/ui](https://ui.shadcn.com/) component library
- [Supabase](https://supabase.com/) for optional persistence and auth
- [Framer Motion](https://www.framer.com/motion/) for animations
- [React Query](https://tanstack.com/query) for data fetching
- [i18next](https://www.i18next.com/) for internationalization
- [Vitest](https://vitest.dev/) for testing (1300+ tests)

## Getting Started

### Prerequisites

- Node.js 18+ ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Installation

```sh
# Clone the repository
git clone https://github.com/LifesaverLabs/inner-friend-circle.git

# Navigate to the project
cd inner-friend-circle

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Running Tests

```sh
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Philosophy

Inner Friend embraces these principles:

- **Quality over Quantity** — Cognitive limits are real; honor them
- **Asymmetry is Natural** — Not all relationships are symmetrical, and that's okay
- **Privacy First** — Your relationships are yours; we don't need your data
- **Intentional Design** — Leave the app to spend time with the people you've listed
- **Bridging, Not Broadcasting** — Encourage real connection over passive engagement

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Translations

Help translate Inner Friend into more languages or improve existing translations. Translation files are located in `public/locales/[language-code]/`.

## License

- **Code**: [MIT License](LICENSE)
- **Content**: [CC0 1.0 Universal](LICENSE-CONTENT)

Copyright (c) 2025 Lifesaver Labs Public Benefit Corporation and Lifesaver Labs Koalition
