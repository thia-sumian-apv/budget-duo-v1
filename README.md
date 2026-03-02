# Budget Duo

A budget planning application for couples and dual-income households, featuring Singapore CPF integration. Plan together, allocate income, and track financial goals as a team.

## Tech Stack

| Technology | Version | Purpose |
| --- | --- | --- |
| Next.js | 15 | React framework (App Router, Turbopack) |
| React | 19 | UI library |
| TypeScript | 5 | Type safety |
| MongoDB | 6+ | Database |
| GraphQL | Apollo Server 5 / Apollo Client 3 | API layer |
| NextAuth | v4 | Authentication |
| Tailwind CSS | 3 | Styling |
| shadcn/ui | — | UI components |
| Sentry | — | Error monitoring |
| Docker Compose | — | Local dev services |

## Prerequisites

- **Node.js** 20+
- **Docker Desktop** (for local MongoDB and Mailpit)

## Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/thia-sumian-apv/budget-duo-v1.git
cd budget-duo-v1

# 2. Copy the environment file and fill in values
cp .env.example .env

# 3. Start local services (MongoDB + Mailpit)
npm run services:up

# 4. Install dependencies
npm install --legacy-peer-deps

# 5. Start the dev server
npm run dev
```

- App: [http://localhost:4001](http://localhost:4001)
- Mailpit inbox: [http://localhost:8025](http://localhost:8025)

## Available Scripts

| Script | Command | Description |
| --- | --- | --- |
| `dev` | `npm run dev` | Start dev server with Turbopack on port 4001 |
| `build` | `npm run build` | Build for production |
| `start` | `npm start` | Start production server |
| `codegen` | `npm run codegen` | Generate GraphQL types from schema |
| `codegen:watch` | `npm run codegen:watch` | Watch mode for GraphQL codegen |
| `lint` | `npm run lint` | Run ESLint |
| `lint:fix` | `npm run lint:fix` | Run ESLint with auto-fix |
| `format` | `npm run format` | Format code with Prettier |
| `services:up` | `npm run services:up` | Start Docker services (MongoDB + Mailpit) |
| `services:down` | `npm run services:down` | Stop Docker services |
| `services:logs` | `npm run services:logs` | View Docker service logs |

> `codegen` runs automatically before `dev` and `build` via the `predev` and `prebuild` hooks.

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `NEXTAUTH_URL` | Yes | Canonical URL of the app (e.g. `http://localhost:4001`) |
| `NEXTAUTH_SECRET` | Yes | Secret for NextAuth session encryption |
| `SMTP_HOST` | Yes | SMTP server host (use `localhost` with Mailpit) |
| `SMTP_PORT` | Yes | SMTP server port (use `1025` with Mailpit) |
| `SMTP_FROM` | Yes | Sender email address for outgoing mail |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth client secret |
| `GITHUB_ID` | No | GitHub OAuth app ID |
| `GITHUB_SECRET` | No | GitHub OAuth app secret |
| `SENTRY_DSN` | No | Sentry DSN for error monitoring |

Copy `.env.example` to `.env` and fill in the required values. OAuth and Sentry variables are optional for local development.

## Project Structure

```
budget-duo-v1/
├── app/                    # Next.js App Router
│   ├── (authenticated)/    # Protected routes (dashboard, planner, profile)
│   ├── api/                # API routes (GraphQL, auth)
│   ├── login/              # Login page
│   └── pages/              # Shared page components
├── components/             # React components
│   ├── dashboard/          # Dashboard layout and cards
│   ├── landing/            # Landing page sections
│   ├── planner/            # Budget planner components
│   └── ui/                 # Reusable UI primitives (shadcn/ui)
├── db/                     # Database collections and helpers
├── graphql/                # GraphQL layer
│   ├── mutations/          # Mutation resolvers (user, planner)
│   ├── queries/            # Query resolvers (user, planner)
│   ├── schema/             # GraphQL type definitions (.graphql files)
│   └── types/              # Custom scalars and type mappings
├── lib/                    # Shared utilities
│   ├── auth.ts             # NextAuth configuration
│   ├── mongodb.ts          # MongoDB client singleton
│   └── utils/              # Budget calculations, CPF logic
└── types/                  # TypeScript type definitions
    ├── planners/           # Planner and goal types
    └── users/              # User types
```

## Authentication

Budget Duo supports multiple authentication methods:

- **Email + password** with email verification (uses Mailpit in development for local email testing)
- **Google OAuth** (optional — requires `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`)
- **GitHub OAuth** (optional — requires `GITHUB_ID` and `GITHUB_SECRET`)

Authentication is managed by [NextAuth.js v4](https://next-auth.js.org/) with a MongoDB adapter for session storage.

## Docker Services

The project uses Docker Compose to run local development services:

- **MongoDB** — primary database
- **Mailpit** — local SMTP server and email inbox for testing email verification

Start services:

```bash
npm run services:up
```

Stop services:

```bash
npm run services:down
```

### Port Conflicts

If the default ports conflict with other services on your machine, create a `docker-compose.override.yml` file (see `docker-compose.override.example.yml` for reference) to remap ports. Docker Compose automatically merges the override file with the base configuration.

## Error Monitoring

[Sentry](https://sentry.io/) is integrated for error tracking in both client and server environments. Set the `SENTRY_DSN` environment variable to enable it. Error monitoring is optional and can be skipped for local development.

## Contributing

See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines on:

- Conventional commit message format
- Branch naming conventions
- Pull request process
- Code style and formatting

## License

This project is private and not licensed for external use.
