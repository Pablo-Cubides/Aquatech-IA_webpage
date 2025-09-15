# Generate README Documentation

## Objective
Generate comprehensive README.md documentation from the current project structure, analyzing the codebase to create accurate and useful documentation.

## Context
This prompt should analyze the existing monorepo structure and generate documentation sections that reflect the actual implementation, not theoretical or planned features.

## Analysis Required

### 1. Project Structure Analysis
- Scan all apps/ and packages/ directories
- Identify actual implemented features vs placeholders
- Document the monorepo architecture
- List available scripts and commands

### 2. Technology Stack Detection
- Identify frameworks and libraries in package.json files
- Detect configuration files (Tailwind, ESLint, Prisma, etc.)
- Note development and build tools
- Document deployment configurations

### 3. Environment Configuration
- Scan for .env.example files
- Identify required environment variables
- Document external service integrations
- Note configuration patterns

### 4. Development Workflow
- Extract available npm/pnpm scripts
- Document development server setup
- Identify build and deployment processes
- Note testing configurations

## Required Sections

Generate these README sections:

1. **Project Header**
   - Name and description
   - Status badges (if applicable)
   - Brief overview

2. **Architecture Overview**
   - Monorepo structure diagram
   - Apps and packages explanation
   - Technology stack summary

3. **Quick Start**
   - Prerequisites
   - Installation steps
   - First-time setup
   - Development server startup

4. **Development**
   - Available scripts
   - Common development tasks
   - Debugging setup
   - Testing procedures

5. **Project Structure**
   - Detailed folder structure
   - App and package descriptions
   - Key configuration files

6. **Environment Configuration**
   - Required variables
   - Setup instructions
   - Environment-specific notes
   - External service setup

7. **Deployment**
   - Build process
   - Deployment platforms
   - Environment promotion
   - CI/CD information

8. **Contributing**
   - Development guidelines
   - Code style requirements
   - Commit conventions
   - PR process

## Output Requirements

- Use clear, concise language
- Include code examples where helpful
- Add proper markdown formatting
- Use emojis sparingly for section headers
- Include troubleshooting section
- Add links to relevant documentation

## Quality Standards

- Accuracy: Only document what actually exists
- Clarity: Explain technical concepts simply
- Completeness: Cover all major aspects
- Maintenance: Structure for easy updates

## Agent Instructions

1. **Scan the Codebase**
   - Read package.json files to understand dependencies
   - Check configuration files for setup requirements
   - Identify actual vs placeholder implementations

2. **Generate Documentation**
   - Start with project overview
   - Build structure documentation from actual folders
   - Extract scripts and commands from package.json
   - Document environment variables from examples

3. **Validate and Refine**
   - Ensure all mentioned commands work
   - Verify file paths and references
   - Check that instructions are complete
   - Test quick start steps

Focus on creating documentation that helps new developers get started quickly while providing comprehensive reference material for ongoing development.
