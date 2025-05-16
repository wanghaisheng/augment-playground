# Test-Driven Development (TDD) Strategy for PandaHabit

This document outlines the strategy for applying Test-Driven Development (TDD) principles to new feature development and bug fixing within the PandaHabit project.

## 1. Introduction to TDD

Test-Driven Development is a software development process where developers write tests *before* writing the actual code that implements a feature or fixes a bug. The typical TDD cycle is:

1.  **Red:** Write a failing test that defines a small piece of desired functionality.
2.  **Green:** Write the minimum amount of code necessary to make the test pass.
3.  **Refactor:** Clean up the code (both production and test code) while ensuring all tests still pass.

## 2. Why TDD for PandaHabit?

*   **Improved Code Quality:** Writing tests first forces clear thinking about requirements and edge cases.
*   **Reduced Bugs:** Comprehensive test coverage catches regressions early.
*   **Better Design:** TDD often leads to more modular, decoupled, and testable code.
*   **Living Documentation:** Tests serve as a form of executable documentation, illustrating how code is intended to be used.
*   **Confident Refactoring:** A strong test suite allows developers to refactor and improve code with confidence.
*   **Type Safety Reinforcement:** Tests can explicitly verify type interactions and data structures, complementing TypeScript's static analysis.

## 3. TDD Scope in PandaHabit

TDD should be applied to:

*   **New Feature Development:** For all new components, services, hooks, and utility functions.
*   **Bug Fixing:** Before fixing a bug, write a test that reproduces the bug. The fix is complete when this test (and all others) pass.
*   **Refactoring:** Ensure existing tests cover the code being refactored. If not, add tests before refactoring.

While aiming for high coverage, prioritize TDD for business logic, complex UI interactions, state management, and service layers. Purely presentational components with minimal logic might have simpler snapshot tests or integration tests.

## 4. Types of Tests in the TDD Cycle

PandaHabit will utilize a mix of testing types within the TDD workflow:

*   **Unit Tests:**
    *   **Focus:** Test individual functions, React components (props, state, basic rendering), custom hooks, and service methods in isolation.
    *   **Tools:** Jest, React Testing Library (RTL).
    *   **Example (Hook):**
        1.  **Red:** Write a test for `useBambooSystem` that expects `plantBamboo` to update `plots` state.
        2.  **Green:** Implement the minimal logic in `plantBamboo` and state update to pass.
        3.  **Refactor:** Improve the hook's implementation.
    *   **Example (Component):**
        1.  **Red:** Test that `Button.tsx` renders with correct text and calls `onClick` when pressed.
        2.  **Green:** Basic `Button` implementation.
        3.  **Refactor:** Add variants, loading states, etc., with new failing tests for each addition.

*   **Integration Tests:**
    *   **Focus:** Test the interaction between several components, or components with services/hooks.
    *   **Tools:** Jest, React Testing Library (RTL), MSW (Mock Service Worker) for API calls.
    *   **Example:**
        1.  **Red:** Test that when a user fills the `TaskForm` and clicks "Save", the `taskService.createTask` is called and the `TaskList` component updates.
        2.  **Green:** Implement the form submission logic and service call.
        3.  **Refactor:** Improve form validation, error handling, and component structure.

*   **End-to-End (E2E) Tests (Complementary to TDD, not strictly part of the inner loop):**
    *   **Focus:** Test complete user flows through the application.
    *   **Tools:** Playwright or Cypress.
    *   **Note:** While TDD focuses on unit/integration tests, E2E tests validate the system as a whole. They are typically written after significant parts of a feature are developed.

## 5. TDD Workflow for a New Feature Page (e.g., `NewFeaturePage.tsx`)

1.  **Understand Requirements:** Clearly define what the new feature page should do (refer to PRD, User Journey).
2.  **Page-Level Test (Integration):**
    *   **Red:** Write a test for `NewFeaturePage.tsx`. What's the most basic thing it should display given certain props or initial state (e.g., a title)? If it fetches data, mock the `useLocalizedView` hook or the underlying service.
    *   **Green:** Create the basic `NewFeaturePage.tsx` structure to pass the test.
3.  **Add Core Functionality - Test by Test:**
    *   **Identify a small piece of logic or UI element:**
        *   E.g., "When a user types into the input field, the state should update."
        *   E.g., "When the 'Submit' button is clicked, a specific service function should be called with the correct data."
    *   **Component/Hook Unit Tests (if extracting logic):**
        *   If the logic is complex, consider extracting it into a custom hook (`useNewFeatureLogic`) or a utility function. Write unit tests for this isolated piece first (Red-Green-Refactor).
    *   **Page Integration Test (for interactions):**
        *   **Red:** Write a test in `NewFeaturePage.test.tsx` for the specific interaction (e.g., simulate button click, check for service call mock).
        *   **Green:** Implement the minimal code in `NewFeaturePage.tsx` (and its child components/hooks if necessary) to make the test pass.
        *   **Refactor:** Clean up the implementation.
4.  **Iterate:** Repeat step 3 for all pieces of functionality on the page (data display, user inputs, conditional rendering, error states, loading states).
5.  **Localization Tests:** Ensure tests cover different language states if text rendering is conditional or complex (though `useLocalizedView` handles much of this, tests should verify labels are passed and rendered correctly).
6.  **Accessibility Checks:** Incorporate accessibility checks (e.g., using `jest-axe` with RTL) as part of the testing process.

## 6. Test Structure and Naming

*   Test files should be co-located with the source files (e.g., `Button.tsx` and `Button.test.tsx` in the same folder).
*   Use clear and descriptive names for test suites (`describe` blocks) and individual tests (`it` or `test` blocks).
    *   Example: `describe('<NewFeaturePage />', () => { it('should call the submission service when the form is submitted with valid data', () => { ... }); });`

## 7. Mocking Dependencies

*   **React Testing Library:** Encourages testing from the user's perspective, minimizing mocks of child components.
*   **Jest Mocks:** Use `jest.fn()` for callbacks, `jest.mock('./path/to/module')` for mocking modules (like services or custom hooks during page tests).
*   **`db.ts` (Dexie):** For services interacting with Dexie, consider:
    *   Mocking the specific service methods in tests for components that use them.
    *   For testing the service itself, you might use an in-memory Dexie or mock Dexie's table methods.
*   **`useLocalizedView`:** When testing pages, you can mock this hook to provide controlled `labels` and `data` for different test scenarios (loading, error, success).

## 8. Continuous Integration (CI)

*   All tests (unit and integration) must pass in the CI pipeline before code can be merged.
*   Track test coverage and aim for a high percentage, particularly for critical logic.

## 9. Best Practices for TDD in PandaHabit

*   **Write tests for the "happy path" first, then for edge cases and error conditions.**
*   **Keep tests small and focused on one specific behavior.**
*   **Ensure tests are independent and can be run in any order.**
*   **Test component states, not just props (e.g., loading, error, empty states).**
*   **Refactor test code alongside production code.** Readable and maintainable tests are crucial.
*   **Follow the testing principles outlined in `docs/best-practices.md` (Section 7).**
*   **For TypeScript, leverage types in tests to ensure data structures and function signatures are correctly mocked and asserted.**

By adhering to this TDD strategy, the PandaHabit team can build a more robust, maintainable, and high-quality application. 