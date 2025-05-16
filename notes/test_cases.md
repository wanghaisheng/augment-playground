# Test Cases: PandaHabit

This document outlines high-level test cases for the PandaHabit application. Detailed test scripts for each module should be developed based on these categories.

## 1. Functional Testing

### 1.1. User Account Management
    *   TC1.1.1: Successful user registration (email, social).
    *   TC1.1.2: Successful user login and logout.
    *   TC1.1.3: Password recovery.
    *   TC1.1.4: Profile creation and updates (username, avatar).
    *   TC1.1.5: Account deletion.

### 1.2. Habit Management
    *   TC1.2.1: Create a new habit (predefined and custom).
    *   TC1.2.2: Edit an existing habit (name, frequency, reminders).
    *   TC1.2.3: Delete a habit.
    *   TC1.2.4: Mark a habit as complete/incomplete for a day.
    *   TC1.2.5: Verify habit streak calculation.
    *   TC1.2.6: Verify reminder notifications for habits.
    *   TC1.2.7: Check behavior with different habit frequencies (daily, weekly, specific days).

### 1.3. Task Management
    *   TC1.3.1: Create a new task (with title, description, category, priority, due date).
    *   TC1.3.2: Edit an existing task.
    *   TC1.3.3: Delete a task.
    *   TC1.3.4: Mark a task as 'To Do', 'In Progress', 'Completed'.
    *   TC1.3.5: Create and manage subtasks.
    *   TC1.3.6: Filter tasks by status, category, priority.
    *   TC1.3.7: Verify task reminder notifications.

### 1.4. Panda Companion Interaction
    *   TC1.4.1: Verify Panda's visual changes with user progress (level up, EXP gain).
    *   TC1.4.2: Test feeding interaction (consumes food, Panda reacts).
    *   TC1.4.3: Test playing interaction (Panda reacts, mood changes).
    *   TC1.4.4: Test training interaction (Panda learns new tricks/abilities).
    *   TC1.4.5: Verify Panda accessory and environment customization.

### 1.5. Challenges & Achievements
    *   TC1.5.1: Join an active challenge.
    *   TC1.5.2: Make progress in a challenge by completing related tasks/habits.
    *   TC1.5.3: Verify challenge completion and reward distribution.
    *   TC1.5.4: View list of available and completed challenges.
    *   TC1.5.5: Unlock and view achievements.
    *   TC1.5.6: (If applicable) Create/Join social challenges.

### 1.6. Rewards System
    *   TC1.6.1: Verify earning of in-app currency (Bamboo, Jade) for actions.
    *   TC1.6.2: Verify EXP gain for Panda companion.
    *   TC1.6.3: Test timely reward claims (daily login, streak bonuses).
    *   TC1.6.4: Test lucky draw functionality (cost, reward pool, probabilities if testable).
    *   TC1.6.5: Verify that rewards are correctly added to user inventory.

### 1.7. Mindfulness Features (Tea Room & Meditation)
    *   TC1.7.1: Browse and filter meditation courses.
    *   TC1.7.2: Successfully start, pause, resume, and complete a meditation session.
    *   TC1.7.3: Verify audio playback and guidance during meditation.
    *   TC1.7.4: Track meditation statistics (sessions, minutes, streaks).
    *   TC1.7.5: Log mood and reflections in the Tea Room.
    *   TC1.7.6: View mood history.
    *   TC1.7.7: Receive and interact with daily wisdom/tips.

### 1.8. Bamboo System
    *   **Planting:**
        *   TC1.8.1: Plant a seed in an available plot.
        *   TC1.8.2: Water a plant (verify resource consumption, plant state change).
        *   TC1.8.3: Fertilize a plant (verify resource consumption, plant state change).
        *   TC1.8.4: Harvest a mature plant (verify bamboo gain, plot becomes available).
        *   TC1.8.5: Test plot unlocking mechanism.
    *   **Collection:**
        *   TC1.8.6: Collect bamboo from an available spot.
        *   TC1.8.7: Verify spot depletion and respawn timer.
    *   **Trading:**
        *   TC1.8.8: Successfully buy bamboo from the marketplace.
        *   TC1.8.9: Successfully sell bamboo to the marketplace.
        *   TC1.8.10: Verify market price fluctuations (if dynamic).
    *   **Dashboard:**
        *   TC1.8.11: Verify accuracy of data displayed on the Bamboo Dashboard.

### 1.9. VIP Membership
    *   TC1.9.1: Successfully subscribe to a VIP plan (mock payment for testing).
    *   TC1.9.2: Verify access to VIP-exclusive features (e.g., more custom goals, courses, items).
    *   TC1.9.3: Verify VIP-specific UI elements (badges, frames).
    *   TC1.9.4: Test subscription renewal and cancellation (mocked).
    *   TC1.9.5: Restore purchase functionality.

### 1.10. Custom Goals
    *   TC1.10.1: Create a custom goal with all fields.
    *   TC1.10.2: Update progress on a custom goal.
    *   TC1.10.3: Mark a custom goal as achieved.
    *   TC1.10.4: Edit and delete a custom goal.
    *   TC1.10.5: Verify goal limits (free vs. VIP).

### 1.11. Store & Customization
    *   TC1.11.1: Browse store categories and items.
    *   TC1.11.2: Purchase an item using in-app currency.
    *   TC1.11.3: Verify item is added to inventory and currency is deducted.
    *   TC1.11.4: Equip/unequip panda accessories.
    *   TC1.11.5: Change panda environment.
    *   TC1.11.6: Update user profile settings (username, avatar, etc.).

### 1.12. Settings
    *   TC1.12.1: Change app language and verify UI updates.
    *   TC1.12.2: Configure notification preferences.
    *   TC1.12.3: Configure sound preferences.
    *   TC1.12.4: Access help/support and legal information (privacy policy, ToS).

## 2. UI/UX Testing

*   TC2.1: Verify consistency in design elements (colors, fonts, icons).
*   TC2.2: Test responsiveness across different screen sizes and orientations (if applicable).
*   TC2.3: Check for intuitive navigation and ease of use.
*   TC2.4: Verify all interactive elements are clickable/tappable and provide feedback.
*   TC2.5: Ensure readability of text and clarity of information.
*   TC2.6: Test error message display and clarity.
*   TC2.7: Verify animations and transitions are smooth.

## 3. Performance Testing

*   TC3.1: Measure app launch time.
*   TC3.2: Measure screen loading times for key pages.
*   TC3.3: Test app performance under low network conditions.
*   TC3.4: Monitor CPU and memory usage during typical operations.
*   TC3.5: Test app stability with a large amount of data (many habits, tasks, long history).

## 4. Localization Testing

*   TC4.1: Verify all UI text is correctly translated for supported languages (English, Chinese).
*   TC4.2: Check for text overflow or truncation issues in different languages.
*   TC4.3: Ensure date, time, and number formats are correct for the selected locale.
*   TC4.4: Verify images and icons are culturally appropriate.

## 5. Error Handling & Edge Cases

*   TC5.1: Test app behavior with no internet connection.
*   TC5.2: Test app behavior with intermittent internet connection.
*   TC5.3: Input invalid data into forms (e.g., special characters, empty required fields).
*   TC5.4: Attempt actions without sufficient resources (e.g., buy item with no currency).
*   TC5.5: Test app recovery from unexpected errors or crashes.
*   TC5.6: Test interactions with concurrent actions (if possible).

## 6. Security Testing (High-Level)

*   TC6.1: Verify secure handling of user credentials.
*   TC6.2: Check for protection against common vulnerabilities (e.g., data injection, if applicable to client-side).
*   TC6.3: Ensure user data privacy is maintained.

## 7. Accessibility Testing (A11y)

*   TC7.1: Verify keyboard navigation support.
*   TC7.2: Check for sufficient color contrast.
*   TC7.3: Ensure screen reader compatibility (e.g., alt text for images, ARIA labels for controls).
*   TC7.4: Test with options to reduce motion/animations.
*   TC7.5: Verify text scalability with system font size settings.

This list should be expanded with specific test steps, expected results, and actual results during the testing phase for each feature module. 