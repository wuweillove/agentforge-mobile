# Contributing to AgentForge

First off, thank you for considering contributing to AgentForge! It's people like you that make AgentForge such a great tool.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:
- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what is best for the community

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear use case**
- **Expected benefits**
- **Possible implementation approach**
- **Alternative solutions considered**

### Pull Requests

1. **Fork the repository**
2. **Create a branch** from `develop`
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow the code style guide
   - Add tests for new functionality
   - Update documentation as needed

4. **Test your changes**
   ```bash
   # Frontend tests
   npm test
   
   # Backend tests
   cd backend && npm test
   ```

5. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
   
   Use conventional commits:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting, etc.)
   - `refactor:` Code refactoring
   - `test:` Adding or updating tests
   - `chore:` Maintenance tasks

6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Open a Pull Request**

## Development Setup

### Frontend (Mobile App)

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Run linter
npm run lint
```

### Backend (API)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Start database
docker-compose up -d db redis

# Run migrations
npx prisma migrate dev

# Seed database
npm run seed

# Start development server
npm run dev

# Run tests
npm test
```

## Code Style Guide

### JavaScript/TypeScript

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons
- Use meaningful variable names
- Add JSDoc comments for functions
- Prefer async/await over promises

### React/React Native

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use TypeScript for type safety
- Follow React best practices

### Git Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests

### Testing

- Write tests for all new features
- Maintain minimum 70% code coverage
- Test edge cases and error scenarios
- Mock external dependencies
- Keep tests fast and isolated

## Project Structure

### Mobile App
```
src/
├── components/       # Reusable UI components
├── screens/          # Screen components
├── navigation/       # Navigation configuration
├── services/         # API services
├── store/            # State management
├── utils/            # Utility functions
└── __tests__/        # Test files
```

### Backend
```
src/
├── config/           # Configuration
├── controllers/      # Request handlers
├── middleware/       # Express middleware
├── routes/           # API routes
├── services/         # Business logic
├── utils/            # Utilities
└── __tests__/        # Test files
```

## Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create release branch: `release/v1.0.0`
4. Run full test suite
5. Create pull request to `main`
6. After merge, create git tag: `v1.0.0`
7. GitHub Actions will automatically:
   - Build mobile apps
   - Deploy backend
   - Create GitHub release

## Getting Help

- **Discord**: Join our [Discord server](https://discord.gg/agentforge)
- **Email**: dev@agentforge.io
- **Discussions**: Use GitHub Discussions for questions

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in the app's About section

Thank you for contributing! 🎉
