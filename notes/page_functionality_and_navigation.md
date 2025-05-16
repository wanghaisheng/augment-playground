# Page Functionality and Navigation Interactions: PandaHabit

This document describes the main pages/views in PandaHabit, their core functionality, and how users navigate between them. This complements the User Journey document by focusing on the app's structure.

## Core Navigation Structure

*   **AppShell:** The main container providing global layout elements.
    *   **Header:** Displays app title or current page title.
    *   **Navigation Bar (Bottom or Side):** Provides access to primary sections (Home, Tasks, Challenges, Tea Room, Store, Settings).
    *   **Footer:** Displays copyright or other static information.
*   **Page Transitions:** Smooth transitions should be used between page views (e.g., slide, fade, or specialized animations like 'inkSpread' as mentioned in `best-practices.md`).

## Main Pages/Views

### 1. Home Page (`HomePage.tsx`)
    *   **Functionality:**
        *   Dashboard view, displaying a summary of today's habits and tasks.
        *   Shows the Panda companion (status, level, EXP).
        *   Provides quick interaction buttons for the Panda (Feed, Play).
        *   Displays welcome message and user stats highlights.
        *   May show prompts for timely rewards or new challenges.
    *   **Navigation:**
        *   **Entry:** Default page on app launch after login/onboarding. Accessible from main navigation.
        *   **Exits:**
            *   To `TasksPage` (via main nav or task summary link).
            *   To `ChallengesPage` (via main nav or challenge prompt).
            *   To Panda interaction modals/pop-ups.
            *   To individual habit/task detail views (if applicable).
            *   To `SettingsPage` (via main nav).
            *   To `StorePage` (via main nav or currency display).
            *   To `TeaRoomPage` (via main nav).

### 2. Tasks Page (`TasksPageView.tsx` - assumed name, or `TaskManagementPage`)
    *   **Functionality:**
        *   Lists all user tasks.
        *   Allows creation of new tasks (opens a form/modal).
        *   Allows editing and deleting existing tasks.
        *   Allows marking tasks as To Do, In Progress, or Completed.
        *   Supports filtering and sorting of tasks (by status, priority, due date, category).
        *   Displays subtasks if applicable.
    *   **Navigation:**
        *   **Entry:** From main navigation.
        *   **Exits:**
            *   To Task creation/edit modal or a dedicated `TaskFormPage`.
            *   To Home or other main sections via main navigation.

### 3. Challenges Page (`ChallengesPageView.tsx`)
    *   **Functionality:**
        *   Displays a list of available, active, and completed challenges.
        *   Allows filtering challenges (by type, difficulty, status).
        *   Shows details of a selected challenge (description, tasks, rewards).
        *   Allows users to join/accept challenges.
        *   Displays progress for active challenges.
        *   May show challenge discovery cards or recommendations.
    *   **Navigation:**
        *   **Entry:** From main navigation.
        *   **Exits:**
            *   To a `ChallengeDetailsPage` (or modal) for viewing specific challenge info.
            *   To related tasks within the `TasksPage` or a dedicated challenge task view.
            *   To Home or other main sections via main navigation.

### 4. Tea Room / Mindfulness Page (`TeaRoomPageView.tsx` or `MeditationPage.tsx`)
    *   **Functionality:**
        *   **Meditation:**
            *   Browse and filter meditation courses.
            *   Play guided meditation sessions.
            *   Track meditation stats.
        *   **Mood Tracking:**
            *   Log current mood and intensity.
            *   Add optional notes.
            *   View mood history/charts.
        *   **Reflection:**
            *   Guided reflection prompts or free-form journaling.
            *   View reflection history.
        *   **Daily Wisdom:** Displays a daily tip or quote.
    *   **Navigation:**
        *   **Entry:** From main navigation.
        *   **Exits:**
            *   To a `MeditationPlayerPage` or modal for active sessions.
            *   To `ReflectionEntryPage` or modal.
            *   To `MoodLoggingPage` or modal.
            *   To Home or other main sections via main navigation.

### 5. Store Page (`StorePageView.tsx`)
    *   **Functionality:**
        *   Displays items available for purchase with in-app currency (Bamboo, Jade) or real money (for VIP).
        *   Categories for items (e.g., Panda Accessories, Panda Environments, Boosts, Special Seeds).
        *   Featured items and sale sections.
        *   Allows users to purchase items.
        *   Displays user's current currency balance.
        *   Provides access to VIP subscription options.
    *   **Navigation:**
        *   **Entry:** From main navigation.
        *   **Exits:**
            *   To `ItemDetailsPage` or modal.
            *   To `VipBenefitsPage` or VIP subscription purchase flow.
            *   To Home or other main sections via main navigation.

### 6. Settings Page (`SettingsPage.tsx`)
    *   **Functionality:**
        *   **Language Selection:** Change display language.
        *   **Notification Preferences:** Manage app notifications.
        *   **Sound Preferences:** Control sound effects and music.
        *   **Account Settings:** Link to profile editing, password change (if not on Profile page).
        *   **Data Management:** Options for data sync, export (if applicable).
        *   **Help & Support:** Links to FAQ, contact support.
        *   **Legal:** Links to Privacy Policy, Terms of Service.
        *   **Logout.**
    *   **Navigation:**
        *   **Entry:** From main navigation or profile.
        *   **Exits:**
            *   To `ProfilePage` (if separate).
            *   To external links for support/legal.
            *   To Login screen after logout.
            *   To Home or other main sections via main navigation.

### 7. Profile Page (`ProfilePageView.tsx`)
    *   **Functionality:**
        *   Displays user information (username, avatar, level, title).
        *   Allows editing of profile information.
        *   Tabs for:
            *   **Achievements:** View unlocked badges and achievements.
            *   **Statistics:** Display user progress stats (habits completed, tasks done, meditation minutes, etc.).
            *   **Customization:** Access Panda accessory and environment selectors.
            *   **Social:** Manage friends, view social challenge history (if applicable).
    *   **Navigation:**
        *   **Entry:** From main navigation or by tapping user avatar in Header.
        *   **Exits:**
            *   To `SettingsPage`.
            *   To Panda Customization modals/pages.
            *   To Home or other main sections via main navigation.

### 8. Bamboo System Pages
    *   **Bamboo Planting Page (`BambooPlantingPage.tsx`):**
        *   **Functionality:** View and manage bamboo plots, select seeds, plant, water, fertilize, and harvest bamboo.
        *   **Navigation:** Entry from main navigation or a "Garden" icon. Exits to seed selection modal, plot detail modal.
    *   **Bamboo Collection Page (`BambooCollectionPage.tsx`):**
        *   **Functionality:** View available bamboo collection spots on a map or list, collect bamboo when spots are active.
        *   **Navigation:** Entry from main navigation or a "Collect" icon.
    *   **Bamboo Trading Page (`BambooTradingPage.tsx`):**
        *   **Functionality:** View current market prices, buy and sell bamboo.
        *   **Navigation:** Entry from main navigation or a "Market" icon.
    *   **Bamboo Dashboard Page (`BambooDashboardPage.tsx`):**
        *   **Functionality:** Overview of total bamboo, growth rates, market trends, etc.
        *   **Navigation:** Entry from main navigation or a "Dashboard" icon.

### 9. VIP Benefits Page (`VipBenefitsPageView.tsx`)
    *   **Functionality:** Displays the benefits of different VIP subscription tiers. Allows users to subscribe.
    *   **Navigation:**
        *   **Entry:** From Store page, or from prompts on VIP-locked features.
        *   **Exits:** To payment processing flow, back to Store, or to previously viewed page.

### 10. Custom Goals Page (`CustomGoalsPage.tsx`)
    *   **Functionality:** Allows users to create, view, update, and delete personal long-term goals. Displays progress towards these goals. May show VIP upsell if goal limit is reached.
    *   **Navigation:**
        *   **Entry:** From main navigation.
        *   **Exits:** To goal creation/edit form (modal or separate page). To `VipBenefitsPage`.

## Modals and Pop-ups (Examples)

*   **Confirmation Modals:** For actions like deleting a habit/task, spending currency, starting a difficult challenge.
*   **Task/Habit Creation/Edit Forms:** Could be modals or dedicated pages.
*   **Reward Notifications/Celebrations:** Pop-ups or brief animations when a reward is earned.
*   **Panda Interaction Modals:** For feeding, playing, training if not directly on the home screen.
*   **Error Display Modals/Toasts:** For showing errors to the user.
*   **Loading Spinners/Overlays:** During data fetching or processing.

This document provides a structural overview. Actual navigation paths and component names might vary based on implementation details. Refer to `router.tsx` for defined routes. 