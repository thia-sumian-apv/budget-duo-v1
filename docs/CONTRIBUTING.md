# Contributing to Budget Duo

Thank you for contributing! This guide covers the conventions and processes used in this project.

## Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/). Every commit message must follow this format:

```
<type>: <description>
```

### Types

| Type | When to use | Example |
| --- | --- | --- |
| `feat` | A new feature | `feat: add CPF breakdown chart` |
| `fix` | A bug fix | `fix: correct salary ratio calculation` |
| `chore` | Maintenance, config, dependencies | `chore: update Node.js to v20` |
| `docs` | Documentation changes | `docs: add API usage examples to README` |
| `refactor` | Code change that neither fixes a bug nor adds a feature | `refactor: extract planner validation logic` |
| `test` | Adding or updating tests | `test: add unit tests for budget utils` |
| `style` | Formatting, whitespace, semicolons (no logic changes) | `style: fix indentation in auth config` |
| `perf` | Performance improvements | `perf: cache MongoDB connection in serverless context` |

### Rules

- Use lowercase for the type and description
- Do not end the description with a period
- Keep the first line under 72 characters
- Use the body (separated by a blank line) for additional context when needed

### Example with Body

```
feat: add email verification flow

Sends a verification email on registration using Mailpit in
development. Includes a token-based verification endpoint and
updates the user record on confirmation.
```

## Branch Naming

Use a prefix that matches the commit type:

| Prefix | Purpose | Example |
| --- | --- | --- |
| `feat/` | New features | `feat/cpf-breakdown` |
| `fix/` | Bug fixes | `fix/ratio-calculation` |
| `chore/` | Maintenance and config | `chore/ci-setup` |
| `docs/` | Documentation | `docs/update-readme` |
| `refactor/` | Refactoring | `refactor/planner-logic` |
| `test/` | Test additions | `test/budget-utils` |

## Pull Request Process

1. **Create a branch** from `main` using the naming convention above
2. **Make your changes** with well-formed conventional commits
3. **Push** your branch to the remote
4. **Open a pull request** targeting `main`
5. **Ensure CI passes** — linting, type checks, and builds must succeed
6. **Request a review** from a team member
7. **Merge** after approval (squash merge preferred for feature branches)

### PR Title

Use the same conventional commit format for the PR title:

```
feat: add CPF breakdown chart
```

### PR Description

Include:
- A summary of what changed and why
- A test plan or steps to verify the changes

## Code Style

This project uses **Prettier** and **ESLint** for consistent code formatting and linting.

### Before Committing

```bash
# Format all files
npm run format

# Run linter
npm run lint

# Auto-fix lint issues
npm run lint:fix
```

### Editor Setup

Install the Prettier and ESLint extensions for your editor to get real-time feedback. The project includes configuration files that your editor should pick up automatically.

## Questions?

Open an issue or reach out to the team if anything is unclear.
