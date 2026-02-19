# Specification

## Summary
**Goal:** Build a multi-role gym member portal where admins control all settings and branding, trainers manage client workout plans, clients track progress, and an AI assistant (VORTEX) provides fitness guidance.

**Planned changes:**
- Create backend data models for workout plans, progress tracking, user management (admin/trainer/client roles), and branding settings
- Implement backend functions for workout plan CRUD operations, progress logging, user management, branding customization, and AI assistant queries
- Build trainer dashboard to view assigned clients, create/edit workout plans, and monitor client progress
- Build client dashboard to view workout plans, log completions with metrics, and visualize progress over time
- Build admin control panel for logo upload, color customization, user management (add/edit/remove trainers and clients), and client-to-trainer assignments
- Create VORTEX AI assistant chat interface accessible to all users with contextual fitness responses
- Apply customizable branding (logo and colors) throughout the application
- Implement role-based access control ensuring admins have full access, trainers only manage their assigned clients, and clients only access their own data
- Design professional fitness-focused UI theme with energetic colors and athletic feel

**User-visible outcome:** Admins can fully customize branding and manage all users, trainers can create and update workout plans for their clients, clients can log workouts and track progress in real-time, and all users can chat with VORTEX AI assistant for fitness guidance.
