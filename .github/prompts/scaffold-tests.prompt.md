# Scaffold Test Structure

## Objective
Create a comprehensive test structure for the IA-Next monorepo without implementing business logic - focus on setting up testing infrastructure, configuration, and placeholder tests that validate the basic wiring and setup.

## Context
This is a scaffolding prompt for setting up testing foundations. The goal is to establish testing patterns and infrastructure that can be expanded with actual business logic later.

## Test Structure Required

### 1. Unit Tests
Create basic unit test structure for:

**Apps/Web**
- Component rendering tests (placeholders)
- Utility function tests (if any exist)
- Hook tests (if any exist)
- Layout and error page tests

**Apps/API**
- API route response tests (basic 200/404 responses)
- Middleware tests (placeholder validation)
- Database connection tests (mock/stub)
- Authentication helper tests (placeholder)

**Packages**
- UI component library tests
- Database utility tests (connection/client)
- Configuration validation tests

### 2. Integration Tests
Set up structure for:
- API endpoint integration tests
- Database integration tests (with test database)
- Authentication flow tests (mocked)
- Payment webhook tests (mocked)

### 3. End-to-End Tests
Create placeholder E2E tests for:
- Portal navigation (IA and Environmental)
- Basic user flows (without real features)
- Error page handling
- Layout responsiveness

## Testing Configuration

### Framework Setup
- **Unit Tests**: Jest or Vitest configuration
- **React Testing**: React Testing Library setup
- **E2E Tests**: Playwright configuration
- **Coverage**: Coverage reporting setup
- **Mocking**: Mock configurations for external services

### Test Utilities
Create shared utilities for:
- Component rendering helpers
- Mock data factories
- Test database setup
- Authentication mocking
- API response mocking

## File Structure

```
tests/
├── __mocks__/           # Global mocks
├── setup/              # Test setup files
├── utils/              # Test utilities
└── fixtures/           # Test data

apps/web/
├── __tests__/          # App-specific tests
├── src/app/__tests__/  # Route tests
└── jest.config.js      # Test configuration

apps/api/
├── __tests__/          # API tests
├── src/app/api/__tests__/ # Route tests
└── jest.config.js      # Test configuration

packages/*/
├── __tests__/          # Package tests
└── jest.config.js      # Package test config
```

## Test Examples to Create

### 1. Component Tests (Placeholder)
```typescript
// apps/web/src/app/(portals)/ia/__tests__/page.test.tsx
describe('IA Portal Page', () => {
  it('renders without crashing', () => {
    // Basic render test
  });
  
  it('displays expected placeholder content', () => {
    // Content validation
  });
});
```

### 2. API Route Tests (Basic)
```typescript
// apps/api/src/app/api/health/__tests__/route.test.ts
describe('Health Check API', () => {
  it('returns 200 OK', () => {
    // Basic response test
  });
  
  it('returns expected JSON structure', () => {
    // Response format test
  });
});
```

### 3. Integration Tests (Mocked)
```typescript
// tests/integration/auth.test.ts
describe('Authentication Integration', () => {
  it('validates Firebase token (mocked)', () => {
    // Mocked auth test
  });
});
```

## Success Criteria

The test scaffold is complete when:

- ✅ Test runners are configured and working
- ✅ Basic tests run and pass
- ✅ Coverage reporting is functional
- ✅ Mocking setup is in place
- ✅ CI/CD integration is configured
- ✅ Test utilities are available
- ✅ Documentation explains test structure

## Quality Standards

### Test Organization
- Clear folder structure
- Consistent naming conventions
- Proper test categorization
- Shared utilities for common tasks

### Configuration
- Environment-specific test configs
- Proper mock configurations
- Coverage thresholds set appropriately
- CI/CD integration

### Documentation
- Testing guide in README
- Mock usage examples
- Test writing guidelines
- Troubleshooting common issues

## Agent Instructions

1. **Setup Test Infrastructure**
   - Install testing dependencies
   - Configure test runners (Jest/Vitest)
   - Set up React Testing Library
   - Configure Playwright for E2E

2. **Create Test Structure**
   - Generate folder structure
   - Create configuration files
   - Set up shared utilities
   - Add mock configurations

3. **Generate Placeholder Tests**
   - Create basic component tests
   - Add API route tests
   - Set up integration test examples
   - Add E2E test placeholders

4. **Configure Integration**
   - Add test scripts to package.json
   - Configure CI/CD integration
   - Set up coverage reporting
   - Add debugging configurations

5. **Documentation**
   - Update README with testing section
   - Create testing guidelines
   - Document mock usage
   - Add troubleshooting guide

Focus on creating a solid foundation that can be easily expanded with real business logic tests later. Ensure all tests pass and the infrastructure is robust.
