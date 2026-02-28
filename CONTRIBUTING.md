# Contributing to Splito

First off, thank you for considering contributing to Splito! It's people like you that make Splito such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our commitment to creating a welcoming environment. Please be respectful and constructive in all interactions.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title** describing the issue
- **Steps to reproduce** the behavior
- **Expected behavior** vs **actual behavior**
- **Screenshots** if applicable
- **Environment details** (OS, browser, Node version)

### Suggesting Features

Feature suggestions are welcome! Please:

- Check if the feature has already been suggested
- Provide a clear use case for the feature
- Explain how it benefits users

### Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Install dependencies** with `npm install`
3. **Make your changes** following our coding standards
4. **Test your changes** thoroughly
5. **Update documentation** if needed
6. **Submit a pull request**

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/splito.git
cd splito

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your local config

# Set up database
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types, avoid `any`
- Use interfaces for object shapes

### Vue Components

- Use `<script setup>` syntax
- Use composables for shared logic
- Keep components focused and small

### Styling

- Use Tailwind CSS classes
- Follow existing class patterns
- Keep responsive design in mind

### API Routes

- Use Zod for request validation
- Return consistent response shapes
- Handle errors gracefully

### Commits

- Use clear, descriptive commit messages
- Reference issues when applicable
- Keep commits focused on single changes

## Project Structure

```
splito/
├── app/
│   ├── components/      # Reusable Vue components
│   ├── composables/     # Vue composables (useAuth, useGroups, etc.)
│   ├── pages/           # Page components
│   └── layouts/         # Layout components
├── server/
│   ├── api/             # API endpoints
│   └── utils/           # Server utilities (auth, db, etc.)
├── prisma/
│   └── schema.prisma    # Database schema
└── public/              # Static assets
```

## Getting Help

- Open an issue for bugs or feature requests
- Start a discussion for questions
- Check existing issues and discussions first

## Recognition

Contributors will be recognized in:
- The README contributors section
- Release notes for significant contributions

Thank you for contributing!
