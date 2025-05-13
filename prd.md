Okay, here is the comprehensive, standalone Product Requirements Document (PRD) for **PandaHabit**, incorporating all the previously discussed elements, including competitor analysis solutions, the Timely Reward System (Scheme C), User Journeys, API Structure Analysis, and detailed Page Descriptions.

---

**Product Requirements Document: PandaHabit**

**Version:** 1.0
**Date:** May 15, 2025
**Status:** Draft

**1. Introduction**

*   **1.1. Overview:** PandaHabit is a mobile application designed to help users build positive habits, improve self-care routines, and enhance mental well-being through an engaging and supportive virtual pet experience. Users nurture a virtual Panda by completing real-life tasks and habits, creating a symbiotic relationship where taking care of oneself directly benefits the pet, and the pet, in turn, offers companionship, motivation, and gentle guidance.
*   **1.2. Vision:** To be the most supportive and engaging habit-building companion, transforming self-care from a chore into a rewarding journey. We aim to foster genuine, long-term positive change by providing proactive support, gentle accountability, meaningful emotional connection, and sustained engagement, overcoming the known shortcomings of existing apps in the market.
*   **1.3. Goals:**
    *   Increase user consistency in desired habits (e.g., hydration, mindfulness, exercise).
    *   Improve user self-reported mood and well-being.
    *   Achieve high user retention and engagement through a rewarding core loop and meaningful progression.
    *   Provide a genuinely supportive and non-judgmental environment, especially when users face challenges.
    *   Establish PandaHabit as a leader in the gamified self-care app market by directly addressing competitor weaknesses (lack of active support, becoming boring, punitive mechanics, negative reinforcement).
    *   Successfully monetize through a valuable VIP subscription model.
*   **1.4. Target Audience:** Individuals seeking tools for habit formation, self-care, mood tracking, motivation, and stress management. Particularly relevant for those who enjoy gamification, virtual pets, and desire a supportive, gentle approach. Also targets users dissatisfied with existing apps due to lack of active help, waning engagement, or negative experiences.

**2. User Journeys**

*   **2.1. New User Onboarding & First Task:**
    1.  User downloads and opens PandaHabit.
    2.  Welcomed with a brief intro to the concept (Panda companion for habits).
    3.  User customizes their initial Panda appearance (basic options).
    4.  User is guided to set their first simple habit/task (e.g., "Drink a glass of water").
    5.  Panda companion provides encouragement.
    6.  User completes the task in real life.
    7.  User opens the app and marks the task complete on the **Task Page**.
    8.  User receives base resource rewards (e.g., Bamboo, Water).
    9.  **Timely Reward:** User also sees the **Timeliness Bar** fill slightly and receives **Luck Points** (with visual feedback).
    10. User is guided to feed the Panda with the earned resources on the **Home Page** or **Pet Interaction Page**.
    11. Panda reacts positively to being fed.
    12. User is introduced to the main **Home Page** interface.
*   **2.2. Daily Habit Check-in & Timely Reward:**
    1.  User receives a gentle reminder notification (optional, Panda-themed).
    2.  User opens the app, landing on the **Home Page**.
    3.  User navigates to the **Task Page**.
    4.  User reviews their daily tasks (some marked with ⏰ for Timely Rewards).
    5.  User completes several tasks within their time windows.
    6.  User marks tasks complete in the app.
    7.  User receives base resources for each task.
    8.  **Timely Reward:** For each on-time task, the **Timeliness Bar** progresses, and **Luck Points** are awarded with visual feedback.
    9.  User sees their total Luck Points increase on the HUD.
    10. User might navigate to the **Lucky Draw Page** to spend points or check the Timeliness Bar reward progress on the Home Page.
*   **2.3. Engaging with a Challenge:**
    1.  User navigates to the **Challenge Page**.
    2.  User browses active Challenges (Daily, Weekly, Event, Continuous).
    3.  User selects a Challenge (e.g., "7-Day Meditation Streak").
    4.  Challenge details show the overall goal, final reward, and component sub-tasks (e.g., "Meditate 5 mins today").
    5.  User accepts the Challenge.
    6.  The relevant daily sub-task appears in the user's **Task Page**, marked as a Challenge Task (🔥).
    7.  User completes the sub-task daily and marks it off in the Task Page, earning daily rewards and Timely Rewards if applicable.
    8.  User checks progress on the **Challenge Page**.
    9.  Upon completing the final sub-task, the Challenge is marked complete, and the user claims the main Challenge reward.
*   **2.4. Using the Reflection Module:**
    1.  User consistently skips a core habit task for several days OR reports a low mood during check-in.
    2.  Panda **gently** offers the option to reflect ("Things seem tough with [Task Name] lately. Want to explore that?").
    3.  User accepts and enters the Reflection Module.
    4.  Panda asks simple, non-judgmental questions ("What felt like the biggest barrier today?").
    5.  User provides input (optional text or multiple choice).
    6.  Panda offers empathetic validation ("It's okay to find things difficult sometimes.") and suggests **small, actionable positive steps** ("Maybe tomorrow we try just 2 minutes of it? Or try [alternative simple task] instead?").
    7.  User feels supported and less discouraged.
*   **2.5. Upgrading to VIP:**
    1.  User interacts with a feature locked behind VIP (e.g., creating a Custom Goal, trying to claim extra reward bonus).
    2.  A prompt appears explaining the benefits of VIP related to that feature and others.
    3.  User navigates to the **Shop Page** or a dedicated VIP section.
    4.  User reviews VIP tiers, benefits (increased rewards, custom goals, exclusive items), and pricing.
    5.  User selects a subscription plan and completes the purchase via the App Store.
    6.  App UI updates immediately to reflect VIP status (e.g., VIP badge, unlocked features).
*   **2.6. Using the Lucky Draw:**
    1.  User accumulates sufficient **Luck Points** by completing tasks on time.
    2.  User navigates to the **Lucky Draw Page** (accessible from Home HUD or Rewards page).
    3.  User sees their current Luck Point balance and the "Draw x1" / "Draw x10" buttons with costs.
    4.  User views the potential prize pool highlights.
    5.  User taps a Draw button.
    6.  An engaging animation plays (e.g., spinning wheel, opening bamboo chest).
    7.  The awarded prize is revealed (e.g., "+50 Coins", "Rare Panda Hat").
    8.  The prize is automatically added to the user's inventory/balance.

**3. Functional Requirements**

*   **3.1. Core Gameplay Loop: "Panda Nurturing Lifestyle System"**
    *   **3.1.1. Panda Companion:**
        *   Visual representation of a Panda that grows and evolves.
        *   Displays emotional states (happy, neutral, concerned) based on user actions and inputs.
        *   Reacts to user interactions (feeding, petting).
        *   Possesses unlockable abilities tied to growth stages (see 3.2.2).
    *   **3.1.2. Resource System:**
        *   Core resources (e.g., Bamboo, Water, Coins) earned primarily through Task completion.
        *   Resources used for feeding the Panda and facilitating Panda Growth/Upgrades.
        *   Premium currency (e.g., Diamonds) potentially used for cosmetics, speeding up timers (if any), or specific VIP features.
    *   **3.1.3. Interconnected Loop:** User completes Tasks -> Earns Resources & Timely Rewards -> Feeds/Grows Panda -> Panda Unlocks Abilities/Provides Support -> User is Motivated to Complete More Tasks.
*   **3.2. Panda Growth & Customization**
    *   **3.2.1. Growth Stages:** Defined stages (e.g., Infant, Youth, Adult, Perfect Form) reached by spending resources and meeting level requirements. Each stage unlocks new visual appearances.
    *   **3.2.2. Capability Unlock (Meaningful Progression):** Panda growth unlocks functional benefits:
        *   New supportive dialogue options and emotional responses.
        *   Enhanced ability to help break down User-Defined Goals (VIP).
        *   Access to advanced guided exercises (meditation, breathing).
        *   Potentially offer small passive bonuses (e.g., slightly increased Luck Point gain).
    *   **3.2.3. Customization:** Users can personalize Panda appearance (skins, hats, accessories) and its environment (decorations) using items earned or purchased.
*   **3.3. Tasks System**
    *   **3.3.1. Task Types:**
        *   **Daily Tasks:** Simple, repeatable tasks for daily engagement and basic resource generation (e.g., Login, Feed Panda, Quick Mood Check). Contribute to Timely Rewards.
        *   **Mainline Tasks:** Core habit-building tasks related to user's goals (e.g., Drink Water, Meditate, Exercise, Journal, Health Record). Contribute to Timely Rewards. Can be broken down into smaller steps.
        *   **Side Tasks:** Varied tasks including Positive Psychology prompts (Affirmation, Gratitude), Guided Practices, Event Tasks, and potentially social tasks. Time-sensitive ones contribute to Timely Rewards.
    *   **3.3.2. Task Management:**
        *   Users can select from predefined task suggestions or create basic custom tasks (advanced custom goals are VIP).
        *   Tasks appear on a daily Task List.
        *   Users mark tasks as complete.
        *   Ability to set task recurrence (daily, specific days, weekly).
    *   **3.3.3. Task Decomposition:** System/Panda offers assistance in breaking down larger Mainline tasks or User-Defined Goals into smaller, manageable daily actions.
    *   **3.3.4. Gentle Reminders:** Optional, customizable, Panda-themed push notifications for specific tasks.
*   **3.4. Challenge System**
    *   **3.4.1. Challenge Definition:** Longer-term objectives composed of multiple steps or requiring sustained effort over time (See Section 4.1 for definition).
    *   **3.4.2. Challenge Types:** Daily Login Streaks, Task Completion Streaks, Resource Collection Goals, Event-Specific Challenges, Cooperative Social Challenges. Categorized by duration (Daily, 7-Day, 30-Day, etc.) and source (System, Event).
    *   **3.4.3. Challenge Lifecycle Tagging:** Challenges tagged for user lifecycle stages (Newbie, Growing, Mature) for appropriate presentation.
    *   **3.4.4. Sub-Task Integration:** Challenge sub-tasks appear in the daily Task List, clearly marked. Completing sub-tasks (on time) contributes to the Timely Reward System. Challenge completion grants a separate, larger reward.
*   **3.5. Progression Systems**
    *   **3.5.1. Achievements:** Awarded for specific, one-off accomplishments across all game areas (Pet Growth, Tasks, Challenges, Resources, Social, Timeliness). Provide small-medium rewards (Coins, basic items). (See Appendix A for detailed list).
    *   **3.5.2. Milestones:** Mark major user journey progression points, often tied to account age or significant achievements. Provide substantial rewards (Large Coins, Rare Cosmetics, Materials). Tailored to user lifecycle stages. (See Appendix B for detailed list).
*   **3.6. Timely Reward System (Scheme C)**
    *   **3.6.1. Eligibility:** Clearly marked Tasks (Daily, Mainline, applicable Side/Challenge sub-tasks) are eligible.
    *   **3.6.2. Time Windows:** Defined windows for "on-time" completion (daily cutoff, specific times, task deadlines). "Early Bird" bonus potential.
    *   **3.6.3. Rewards:**
        *   **Timeliness Bar:** Fills progressively with each on-time completion. Visible on Home HUD. Reaching the end grants a **guaranteed significant reward** (e.g., rare seasonal cosmetic, large resource bundle). Bar resets upon claiming. Reward preview visible.
        *   **Luck Points:** Awarded for each on-time completion. Amount varies by task type/difficulty and VIP status. Displayed on HUD.
    *   **3.6.4. Lucky Draw:** Dedicated feature where users spend Luck Points for a chance to win random rewards from a tiered pool (Common to Legendary). Clear UI for drawing and viewing potential prizes.
*   **3.7. Deep Reflection & Psychological Support**
    *   **3.7.1. Reflection Module ("Take a Break"):** Non-intrusive module offered when user struggles (skipping tasks, low mood). Uses gentle, non-judgmental dialogue (Panda-led) to explore barriers and suggest small, positive, actionable steps. Focuses on self-compassion.
    *   **3.7.2. Proactive Support:** Panda provides context-aware, actionable, positive tips based on mood check-ins or detected patterns (e.g., suggesting hydration if mood is low and water task incomplete).
    *   **3.7.3. Avoidance of Negative Reinforcement:** No punitive mechanics for skipping tasks. Mood tracking focuses on providing support, not reinforcing negative feelings. No potentially inaccurate diagnostic quizzes.
*   **3.8. Social & Community Features**
    *   **3.8.1. Friends System:** Add friends, send encouragement messages, small resource gifts.
    *   **3.8.2. Sharing (Optional):** Share Panda growth, Milestone achievements, rare Lucky Draw wins.
    *   **3.8.3. Cooperative Challenges:** Team-based challenges encouraging collaboration.
    *   **3.8.4. Community Forum/Space:** Moderated area for sharing positive stories, tips, and encouragement.
*   **3.9. Monetization (VIP Subscription & Shop)**
    *   **3.9.1. VIP Subscription:** Tiered subscription offering benefits:
        *   Increased Luck Point earnings.
        *   Faster Timeliness Bar progression.
        *   Free daily/weekly Lucky Draws.
        *   Access to create User-Defined Goals (with Panda assistance).
        *   Higher reward caps/better potential rewards for Custom Goals.
        *   Exclusive cosmetic items (accessible only via VIP or VIP shop).
        *   VIP badge/identifier.
        *   Potential ad removal (if ads exist for free tier).
    *   **3.9.2. Shop:** In-app store selling:
        *   Cosmetic items (Panda skins, accessories, environment decorations) for Coins or potentially Diamonds.
        *   Potentially resource bundles or enhancement materials (use with caution to avoid pay-to-win feel).
        *   VIP-exclusive items.

**4. UI/UX Design (Page Descriptions)**

*   **4.1. Home Page**
    *   **Purpose:** Main dashboard, quick overview, access to core interactions.
    *   **Layout:**
        *   *Top:* User info (profile, name), Currency (Coins, Diamonds, **Luck Points** ✨), quick access icons (Pet, Achievements, Events, Tasks, VIP, Settings).
        *   *Center:* Large interactive Panda visual, reflecting current state/growth. **Timeliness Bar** 进度条 prominently displayed below or near Panda, showing progress and target reward icon.
        *   *Bottom:* Key active Task display/button area. Recent reward notifications/log.
    *   **Navigation:** Fixed bottom navigation bar (Home, Rewards/Draw, Journey, Shop, Task List).
    *   **Key Interactions:** Tapping Panda (petting), feeding shortcut, claiming task rewards, accessing other sections via icons/nav bar, checking Timeliness Bar.
*   **4.2. Task Page**
    *   **Purpose:** View and manage daily/current tasks.
    *   **Layout:**
        *   *Top:* Date, overall daily progress ("X/Y tasks complete"). Filter/Sort options.
        *   *Main:* Vertical scrollable list of tasks. Each task item shows:
            *   Name/Description.
            *   Associated icon (habit type).
            *   Reward preview (base resources).
            *   **Timeliness Icon (⏰/✨)** if eligible.
            *   **Time Window/Deadline** clearly stated.
            *   **Challenge/Custom Goal Indicator (🔥/👤)** if applicable.
            *   Checkbox/button/swipe to complete.
    *   **Key Interactions:** Marking tasks complete (triggers reward/timeliness feedback), filtering list, potentially adding new tasks (VIP).
*   **4.3. Challenge Page**
    *   **Purpose:** Track progress on long-term goals and special events.
    *   **Layout:**
        *   *Top:* Tabs or filters for challenge categories (Active, Continuous, Event, Completed).
        *   *Main:* Card-based view of Challenges. Each card shows Title, Key Reward, Progress Bar, Time Limit, potentially list of sub-tasks.
    *   **Key Interactions:** Viewing challenge details, accepting new challenges, tracking progress, claiming final challenge rewards.
*   **4.4. Journey Page (Panda Growth & Milestones)**
    *   **Purpose:** Visualize Panda's growth path and user's major achievements.
    *   **Layout:**
        *   *Top/Main:* Visual representation of Panda's evolution path (timeline, tree, etc.). Nodes mark key levels and Milestones. Each node shows requirement and reward. Clear indication of completed/current/locked status.
        *   *Bottom/Tab:* Log of achieved Milestones and potentially significant past accomplishments.
    *   **Key Interactions:** Exploring the growth path, seeing future rewards, reviewing past achievements.
*   **4.5. Shop Page**
    *   **Purpose:** Browse and purchase cosmetic items, resources, or VIP subscription.
    *   **Layout:**
        *   *Top:* Search bar, scrollable category filters (Decorations, Skins, Resources, VIP).
        *   *Main:* Grid/list of items with image, name, price. Highlighted section for Sales/Featured/VIP items.
        *   *Item Detail View:* Larger image/preview, description, purchase button.
    *   **Key Interactions:** Browsing categories, searching, viewing item details, making purchases.
*   **4.6. Pet Interaction Page**
    *   **Purpose:** Direct interaction with the Panda, feeding, accessing skills.
    *   **Layout:**
        *   *Top:* Panda status indicators (Mood, Health, Energy).
        *   *Center:* Large interactive Panda view.
        *   *Bottom:* Interaction buttons (Feed, Play, Train, Reflect). Section showing unlocked skills/abilities.
    *   **Key Interactions:** Feeding Panda (uses resources), playing mini-games (if any), triggering reflection, viewing/upgrading skills.
*   **4.7. Lucky Draw Page**
    *   **Purpose:** Spend Luck Points for random rewards.
    *   **Layout:**
        *   *Top:* Current Luck Point balance (⭐).
        *   *Center:* Visually engaging draw mechanism (wheel, chest, gacha machine). "Draw x1" and "Draw x10" buttons showing point costs.
        *   *Bottom/Side:* Display of potential prize pool highlights (especially rare items). Link to view probabilities/full pool. History log of recent wins.
    *   **Key Interactions:** Spending points to initiate draws, viewing results, checking prize pool.
*   **4.8. Reflection Module (Modal/Separate Screen)**
    *   **Purpose:** Guided self-reflection when struggling.
    *   **Layout:** Calm, simple interface. Text-based dialogue with Panda avatar. Options for user input (buttons, simple text entry). Clear display of Panda's questions and supportive statements.
    *   **Key Interactions:** Reading prompts, selecting responses or typing brief reflections, receiving actionable suggestions.

**5. API Endpoint Structure Analysis (High-Level)**

*(Assuming a standard RESTful API structure for communication between the mobile app and backend server)*

*   **User:**
    *   `POST /auth/register`
    *   `POST /auth/login`
    *   `GET /user/profile`
    *   `PUT /user/profile`
    *   `GET /user/vip_status`
*   **Panda:**
    *   `GET /panda/status` (Level, evolution, mood, health)
    *   `POST /panda/feed` (Body: {resource_type, amount})
    *   `POST /panda/interact` (Body: {interaction_type})
    *   `GET /panda/customization`
    *   `PUT /panda/customization`
*   **Tasks:**
    *   `GET /tasks?date={YYYY-MM-DD}` (Fetch tasks for a specific day)
    *   `POST /tasks` (Create custom task - basic)
    *   `PUT /tasks/{taskId}` (Update task - e.g., recurrence)
    *   `POST /tasks/{taskId}/complete` (Crucially includes timestamp for timely check)
    *   `DELETE /tasks/{taskId}`
*   **Challenges:**
    *   `GET /challenges?status=active|completed`
    *   `GET /challenges/{challengeId}`
    *   `POST /challenges/{challengeId}/accept`
    *   `POST /challenges/{challengeId}/claim_reward`
*   **User-Defined Goals (VIP):**
    *   `POST /goals` (VIP only - create Goal and sub-tasks)
    *   `GET /goals` (VIP only - list user's custom goals)
    *   `GET /goals/{goalId}`
    *   `PUT /goals/{goalId}`
    *   `DELETE /goals/{goalId}`
*   **Timely Rewards:**
    *   `GET /timely_rewards/status` (Current Luck Points, Timeliness Bar progress & target reward)
    *   `POST /lucky_draw/draw` (Body: {draw_count}) -> Returns awarded items
    *   `GET /lucky_draw/pool` (Info about potential prizes)
    *   `POST /timely_rewards/claim_bar_reward`
*   **Progression:**
    *   `GET /achievements`
    *   `GET /milestones`
*   **Shop & Monetization:**
    *   `GET /shop/items?category={category}`
    *   `POST /shop/purchase/{itemId}`
    *   `POST /vip/subscribe` (Handles App Store receipt validation)
*   **Social:**
    *   `GET /friends`
    *   `POST /friends/add`
    *   `POST /friends/{friendId}/send_encouragement`
    *   `GET /community/feed` (For shared stories)

**6. Non-Functional Requirements**

*   **6.1. Performance:** Smooth animations, fast load times, responsive UI. Backend API responses should be quick (<500ms target).
*   **6.2. Reliability:** Stable app with minimal crashes. Accurate tracking of tasks, resources, and progression. No loss of rewards due to technical issues (addressing Finch complaint). Robust data synchronization.
*   **6.3. Scalability:** Backend infrastructure capable of handling a growing user base.
*   **6.4. Security:** Secure handling of user authentication and personal data (including mood/reflection data if stored). Compliance with privacy regulations (GDPR, CCPA, etc.). Secure payment processing integration.
*   **6.5. Usability:** Intuitive navigation, clear visual hierarchy. Features should be discoverable. Onboarding should effectively teach core mechanics.
*   **6.6. Accessibility:** Adherence to platform accessibility guidelines (e.g., font sizes, color contrast, screen reader support) where feasible.

**7. Future Considerations / Roadmap Ideas**

*   Advanced Panda interactions and mini-games.
*   More sophisticated habit analytics and insights for users.
*   Deeper social features (e.g., forming accountability groups).
*   Integration with wearable devices (e.g., step tracking).
*   Expanded range of guided exercises (mindfulness, fitness).
*   Themed seasonal events with unique mechanics and rewards.

**8. Appendix**

*(Note: This section assumes the detailed tables provided in earlier prompts are available as appendices.)*

*   **Appendix A:** Detailed Task Lists (Daily, Mainline, Side - including 0-7 Day User Behavior Expectation Table)
*   **Appendix B:** Detailed Achievement List & Descriptions (Including Timeliness Achievements)
*   **Appendix C:** Detailed Milestone List & Descriptions (Lifecycle-based, including Timeliness Milestones)
*   **Appendix D:** Detailed Challenge List & Descriptions (Categorized by duration/type)
*   **Appendix E:** Reward Coefficient Tables (Task Type vs. VIP Level, Timely Reward Coefficients)
*   **Appendix F:** Data Models (JSON examples for Goal, Task, Achievement, Milestone, etc.)
*   **Appendix G:** Lucky Draw Pool Itemization (Example list of items and tiers)

---

This PRD provides a comprehensive guide for the development of PandaHabit, focusing on creating a supportive, engaging, and effective self-care and habit-building application that learns from and improves upon existing market offerings.