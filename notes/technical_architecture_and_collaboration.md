# Technical Architecture and Collaboration Guide: PandaHabit

This document outlines the technical architecture of the PandaHabit project and provides guidelines for team collaboration, emphasizing type safety and error handling. It should be used in conjunction with `docs/best-practices.md`.

## 1. Core Architecture Overview

PandaHabit is a React-based application built with TypeScript, utilizing Vite for the build process. The architecture emphasizes a clear separation of concerns, strong typing, and a component-based approach.

*   **Language:** TypeScript
*   **Framework/Library:** React
*   **Build Tool:** Vite
*   **State Management:**
    *   Global language state: `LanguageProvider` (`src/context/LanguageProvider.tsx`)
    *   Server state/cache: `@tanstack/react-query` for managing data fetched via services.
    *   Local component state: React's `useState`, `useReducer`.
    *   Shared application state (beyond server cache): `PandaStateProvider` (as seen in `CustomGoalsPage.tsx`, context for user-specific, non-server-cache data like VIP status, Panda attributes not directly tied to a server resource).
*   **Data Persistence (Client-Side Mock Backend):** Dexie.js (`src/db.ts`) acting as a mock backend for UI labels and application data.
*   **Routing:** `react-router-dom` (`src/router.tsx`) with lazy loading for pages.
*   **Styling:** Global CSS (`src/index.css`) and potentially component-scoped styles or CSS Modules (not explicitly detailed but common in Vite/React setups).

## 2. Project Structure (Key Directories)

(Refer to `README.md` from "Minimal Demo V3 Final" for a detailed file tree)

*   `src/`
    *   `components/`: Reusable UI components.
        *   `common/`: Generic components (Button, LoadingSpinner, ErrorDisplay).
        *   `layout/`: Structural components (AppShell, Header, Navigation).
        *   Feature-specific components (e.g., `goals/CustomGoalCard`).
    *   `context/`: React Context providers (e.g., `LanguageProvider.tsx`, `PandaStateProvider.tsx`).
    *   `db.ts`: Dexie.js database setup and initial data population.
    *   `features/`: Contains components and logic related to specific application features (e.g., `home/`, `settings/`). These often represent sections within pages.
    *   `hooks/`: Custom React hooks (e.g., `useLocalizedView.tsx`, `useInternationalizedQuery.tsx`, feature-specific hooks like `useBambooSystem.ts`).
    *   `pages/`: Top-level view components corresponding to routes.
    *   `router.tsx`: Application routing configuration.
    *   `services/`:
        *   `localizedContentService.ts`: Fetches localized labels and page-specific data from `db.ts`.
        *   Other service files (e.g., `customGoalService.ts`): Handle business logic and data operations for specific features, interacting with `db.ts` or other data sources.
    *   `types/`: Centralized TypeScript type definitions (`index.ts` and potentially feature-specific type files like `battle-pass.ts`).
    *   `utils/`: Utility functions (e.g., `sound.ts`).
*   `docs/`: Project documentation (`best-practices.md`, `typescript-fixes-progress.md`).
*   `notes/`: Additional planning and strategy documents (this folder).
*   `public/`: Static assets.

## 3. Key Architectural Patterns & Best Practices

### 3.1. Internationalization (i18n)

*   **Core:** `LanguageProvider`, `useLocalizedView`, `localizedContentService.ts`, Dexie `uiLabels` table.
*   **Flow:**
    1.  `LanguageProvider` manages current `language`.
    2.  Pages use `useLocalizedView` hook, providing a query key and a `fetch<PageName>View` function.
    3.  `useLocalizedView` (built on `useInternationalizedQuery`) uses `language` from context to form a unique `queryKey` for `@tanstack/react-query`.
    4.  The `fetch<PageName>View` function (from `localizedContentService.ts`) is called with the current `language`.
    5.  Service function queries `db.ts` (Dexie `uiLabels` table) for records matching `scopeKey` and `languageCode`.
    6.  `buildLabelsObject` helper reconstructs a nested label bundle from flat Dexie records.
    7.  Service returns `LocalizedContent<TDataPayload, TLabelsBundle>`.
    8.  `@tanstack/react-query` caches this response.
    9.  Page receives typed `labels` and `data` from `useLocalizedView`.
*   **Best Practices:** (Refer to `docs/best-practices.md#1-多语言支持`)
    *   Avoid hardcoded text.
    *   Hierarchical label organization: `[viewName]View.[sectionName].[labelKey]`.
    *   Provide English defaults.

### 3.2. Data Fetching and State Management

*   **Server State:** `@tanstack/react-query` is the primary tool for managing asynchronous data, caching, and refetching.
    *   `useInternationalizedQuery` is a generic wrapper.
    *   `useLocalizedView` specializes this for i18n content.
*   **Services Layer (`src/services/`):**
    *   Abstracts data fetching logic from components.
    *   Responsible for interacting with `db.ts` (or a real backend).
    *   Should return typed responses, typically `Promise<ServiceResponse<TData>>` or `Promise<LocalizedContent<TData, TLabels>>`.
*   **Type Safety:** Crucial for services. Define clear `DataPayload` types for what services fetch/return and `LabelsBundle` for label structures. (Refer to `docs/best-practices.md#14-服务层类型安全指南`).

### 3.3. Component-Based Development

*   **Pages (`src/pages/`):** Act as containers, responsible for fetching data for their view using `useLocalizedView`.
*   **Feature Sections (`src/features/`):** Encapsulate distinct UI parts within a page. Receive `labels` and `data` as props from the parent page.
*   **Common Components (`src/components/common/`):** Reusable, purely presentational components driven by props.
*   **Layout Components (`src/components/layout/`):** Define the overall application structure. `AppShell` fetches global layout labels.
*   **Best Practices:** (Refer to `docs/best-practices.md#3-组件开发指南`)
    *   Favor common components (e.g., `Button`, `LoadingSpinner`, `ErrorDisplay`) over raw HTML elements.
    *   Handle loading and error states gracefully, typically using `LoadingSpinner` and `ErrorDisplay`. `DataLoader` pattern if more complex orchestration is needed.

### 3.4. Type Safety

*   **Strict TypeScript Configuration:** (`tsconfig.json` settings like `strict: true`, `noUnusedLocals`, `noUnusedParameters`, `noImplicitAny`, `strictNullChecks`).
*   **Centralized Types (`src/types/`):**
    *   Clear naming conventions (PascalCase for interfaces, enums, types; `T` prefix for generics).
    *   Detailed types for API responses (`ServiceResponse<T>`), localized content (`LocalizedContent<TData, TLabels>`), page-specific data payloads and label bundles.
    *   Database model types (`BaseModel`, `UserModel`, etc.).
*   **Best Practices:** (Extensively covered in `docs/best-practices.md#4-类型定义最佳实践` and `#15-类型安全检查清单`)
    *   **AVOID `any`**. Use `unknown` with type guards or specific types.
    *   Use optional properties (`?`) judiciously. Provide defaults for labels.
    *   Define clear function signatures for callbacks.
    *   Use type guards (`isUserData(obj): obj is UserData`) for validating external data.
    *   Utilize optional chaining (`?.`) and nullish coalescing (`??`).
    *   Use generic constraints (`<T extends HasValue>`).
    *   Ensure type safety in event handlers (`React.ChangeEvent<HTMLInputElement>`).
    *   Strongly type asynchronous operations (`async function fetchData(): Promise<UserData>`).

### 3.5. Error Handling

*   **Component Level:**
    *   Use `ErrorDisplay` component for showing user-friendly error messages.
    *   Pages using `useLocalizedView` or `useInternationalizedQuery` get `isError` and `error` objects to pass to `ErrorDisplay`.
*   **Service Level:**
    *   Service functions should handle potential errors from `db.ts` or API calls.
    *   Return structured error information within `ServiceResponse` or throw custom `ServiceError` instances. (Refer to `docs/best-practices.md#14.3-错误处理类型`).
*   **Global Level:**
    *   React Error Boundaries can be used to catch rendering errors in component trees and display a fallback UI. (Refer to `docs/best-practices.md#10.1-错误边界`).
*   **Best Practices:**
    *   Provide meaningful, localized error messages.
    *   Offer retry mechanisms where appropriate.
    *   Log errors for debugging (client-side logging or to a remote service).

### 3.6. Testing

*   **Strategy:** Test-Driven Development (TDD) is encouraged. (Refer to `notes/tdd_strategy.md`).
*   **Tools:** Jest, React Testing Library (RTL).
*   **Types of Tests:** Unit tests for components, hooks, services. Integration tests for component interactions.
*   **Best Practices:** (Refer to `docs/best-practices.md#7-测试最佳实践` and `notes/tdd_strategy.md`)
    *   Test component rendering in different states (loading, error, various props).
    *   Test data fetching and display.
    *   Test user interactions and event handling.
    *   Mock dependencies appropriately.

## 4. Collaboration Workflow

1.  **Branching Strategy:**
    *   Use a standard branching model (e.g., Gitflow: `main`, `develop`, `feature/feature-name`, `fix/bug-name`, `release/version`).
    *   Features are developed in `feature/` branches off `develop`.
    *   Fixes are developed in `fix/` branches off `develop` (or `main` for hotfixes).
2.  **Issue Tracking:** Use an issue tracker (e.g., GitHub Issues, Jira) to manage tasks, features, and bugs.
3.  **Code Reviews:**
    *   All code changes must be reviewed via Pull Requests (PRs) before merging into `develop`.
    *   Reviewers should focus on:
        *   Adherence to best practices (this document and `docs/best-practices.md`).
        *   Correctness and completeness of functionality.
        *   Type safety and error handling.
        *   Test coverage and quality.
        *   Readability and maintainability.
        *   Localization considerations.
4.  **Coding Standards:**
    *   Follow TypeScript and React best practices.
    *   Adhere to the ESLint and Prettier configurations in the project for consistent code style.
    *   Follow naming conventions outlined in `docs/best-practices.md` (e.g., for types, components, labels).
5.  **Communication:**
    *   Regular team communication (stand-ups, planning meetings).
    *   Use comments in code for non-obvious logic.
    *   Keep documentation (PRD, User Journeys, these architecture docs) updated as the project evolves.
6.  **Type Definition Updates:**
    *   When adding or modifying data structures or service responses, update the corresponding types in `src/types/`.
    *   Ensure `db.ts` label schemas and service data payloads match their TypeScript definitions.
7.  **Handling Unused Code:**
    *   Regularly clean up unused imports, variables, and functions.
    *   Use linter rules (`noUnusedLocals`, `noUnusedParameters`) to help identify these.
    *   (Refer to `docs/best-practices.md#12-未使用代码处理指南`).

## 5. Key Points for Type Safety & Error Handling Collaboration

*   **Prioritize Type Safety:** When defining data structures, always create strong types in `src/types/`. Avoid `any` and use `unknown` with type guards when external data shapes are uncertain.
*   **Service Contract:** Service functions are a critical boundary. Their request parameters and response shapes MUST be accurately typed. `LocalizedContent` and `ServiceResponse` generics help enforce this.
*   **Label Consistency:** Adding new UI text requires:
    1.  Defining the label key(s) and structure in the appropriate `LabelsBundle` type in `src/types/`.
    2.  Adding the corresponding label records (for all languages) to `src/db.ts` under the correct `scopeKey`.
    3.  Using the typed label in the component via `useLocalizedView`.
*   **Error Propagation:** If a service encounters an error, it should either return it in a structured way (e.g., `ServiceResponse.error`) or throw a typed error. Components should anticipate these errors and use `ErrorDisplay` or other UI to inform the user.
*   **Code Reviews for Types & Errors:** Pay special attention during code reviews to how new types are defined and how errors are handled and presented to the user. Ensure new `fetch<PageName>View` functions correctly provide data and labels matching their type definitions.

By following these architectural guidelines and collaboration practices, the PandaHabit team can work effectively to deliver a high-quality, maintainable, and robust application. 