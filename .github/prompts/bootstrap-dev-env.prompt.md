# Bootstrap Development Environment

## Objective
Set up the complete development environment for the IA-Next monorepo, ensuring all dependencies are installed, tasks are configured, and the development server can start successfully.

## Context
This is an agent-mode prompt for automatically setting up the development environment. The agent should:

1. **Install Dependencies**
   - Run `pnpm install` at the root level
   - Verify all workspaces are properly installed
   - Check for any peer dependency warnings

2. **Verify Configuration**
   - Ensure TypeScript configurations are valid
   - Check ESLint and Prettier configurations
   - Validate Turbo configuration

3. **Database Setup**
   - Generate Prisma client in API app
   - Verify database connection (if environment variables are set)
   - Check schema validation

4. **Development Server Verification**
   - Start development servers for both apps
   - Verify they start without errors
   - Check that ports are available and accessible

5. **Environment Validation**
   - Check for required environment variables
   - Validate .env.example files exist
   - Suggest missing environment setup

6. **VS Code Integration**
   - Verify recommended extensions
   - Check task definitions work
   - Validate debug configurations

## Success Criteria

The environment is ready when:

- ✅ `pnpm install` completes without errors
- ✅ `pnpm dev` starts both web and API servers
- ✅ TypeScript compilation succeeds
- ✅ Prisma client generates successfully
- ✅ VS Code tasks are functional
- ✅ All required configuration files exist

## Output Format

Provide a status report with:

```
🔧 Development Environment Setup
================================

Dependencies: ✅ Installed successfully
TypeScript: ✅ Configurations valid
Database: ✅ Prisma client generated
Servers: ✅ Web (3000) and API (3001) running
Environment: ⚠️ Missing FIREBASE_PROJECT_ID
VS Code: ✅ All extensions recommended

Next Steps:
1. Copy .env.example to .env.local in both apps
2. Configure Firebase environment variables
3. Set up Supabase database URL
```

## Error Handling

If issues arise:
1. Log specific error messages
2. Suggest concrete solutions
3. Provide command examples to fix issues
4. Indicate which steps can be skipped for now

## Agent Instructions

Execute this as a systematic setup process:
1. Start with dependency installation
2. Move through configuration validation
3. Set up database tooling
4. Test development servers
5. Provide final status and next steps

Focus on getting the development environment functional, not on implementing business features.
