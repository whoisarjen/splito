# Splito

> Split expenses, not friendships.

**Splito** is an open-source expense sharing application that helps groups track shared costs and settle up fairly. Built with Nuxt 4, Prisma, and PostgreSQL.

🌐 **Live Demo**: [splito.whoisarjen.com](https://splito.whoisarjen.com)

---

## Features

- **Multi-Currency Support** - Track expenses in any currency, settle in your preferred one
- **Smart Settlements** - Algorithm minimizes transactions for easy settling
- **Group Management** - Create groups for trips, roommates, events, or any shared expense
- **Flexible Splitting** - Equal, unequal, or percentage-based splits
- **Real-time Balances** - Always know who owes what
- **Google Authentication** - Secure sign-in with your Google account
- **Open Source** - Self-host or contribute to the project

## Tech Stack

- **Framework**: [Nuxt 4](https://nuxt.com/) (Vue 3)
- **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Authentication**: Google OAuth 2.0
- **Icons**: [@nuxt/icon](https://github.com/nuxt/icon)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google OAuth credentials

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/whoisarjen/splito.git
cd splito
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/splito"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
NUXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. **Set up the database**

```bash
npx prisma generate
npx prisma db push
```

5. **Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
splito/
├── app/
│   ├── assets/          # CSS and static assets
│   ├── components/      # Vue components
│   ├── composables/     # Vue composables
│   ├── layouts/         # Page layouts
│   ├── pages/           # Application pages
│   └── generated/       # Prisma client (auto-generated)
├── prisma/
│   └── schema.prisma    # Database schema
├── server/
│   ├── api/             # API routes
│   └── utils/           # Server utilities
└── public/              # Static files
```

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/auth/google` | Initiate Google OAuth |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/logout` | Sign out |
| GET | `/api/groups` | List user's groups |
| POST | `/api/groups` | Create a group |
| GET | `/api/groups/:id` | Get group details |
| POST | `/api/groups/join/:code` | Join group via invite |
| GET | `/api/groups/:id/expenses` | List group expenses |
| POST | `/api/groups/:id/expenses` | Create expense |
| GET | `/api/groups/:id/balances` | Get group balances |
| POST | `/api/groups/:id/settle` | Record settlement |
| GET | `/api/currencies` | List supported currencies |
| GET | `/api/currencies/convert` | Convert between currencies |

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes |
| `NUXT_PUBLIC_APP_URL` | Application URL | Yes |

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Self-Hosting

Splito can be self-hosted on any platform that supports Node.js:

- **Vercel** - Zero-config deployment
- **Railway** - Easy PostgreSQL + Node.js hosting
- **Docker** - Container deployment (Dockerfile coming soon)
- **VPS** - Traditional server deployment

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by [Splitwise](https://www.splitwise.com/) and [Tricount](https://www.tricount.com/)
- Built by [@whoisarjen](https://github.com/whoisarjen)

---

<p align="center">
  Made with ❤️ for fair splits everywhere
</p>
