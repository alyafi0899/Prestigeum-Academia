# Transition to Dynamic Web - Prestigeum Academia

This plan outlines the steps to transform the current static "Prestigeum Academia" website into a fully functional dynamic application with persistence, logic, and data management.

## User Review Required

> [!IMPORTANT]
> **Database Choice**: I propose using `localStorage` for this prototype to ensure it works instantly in any browser/Figma Make environment without needing a backend server. If you have a specific backend (like Supabase, Firebase, or a Node.js API), please let me know.

- **Admin Account**: I will keep `admin@demo.com` as the default admin account.
- **Persistence**: Data will persist in the browser's storage. Clearing site data will reset the application.

## Proposed Changes

### Core Service Layer
A new service layer will be introduced to handle all "database" operations. This ensures that if you decide to move to a real backend later, you only need to change this layer.

#### [NEW] [dataService.ts](file:///D:/Code/Prestigeum%20Academia/src/data/dataService.ts)
- Implement `StorageService` using `localStorage`.
- Provide CRUD operations for `Users`, `Trainings`, `Registrations`, `Articles`, and `Gallery`.
- Initialize storage with existing data from `mockData.ts` if empty.

---

### Authentication & Authorization
Transitioning from demo auth to persistent auth.

#### [AuthContext.tsx](file:///D:/Code/Prestigeum%20Academia/src/context/AuthContext.tsx)
- Update `login` and `register` to use `dataService`.
- Persist session (currently lost on refresh).

#### [routes.ts](file:///D:/Code/Prestigeum%20Academia/src/routes.ts)
- Wrap Dashboard and Admin routes with `ProtectedRoute` components.

---

### Feature Logic
Implementing the "Alive" part of the application.

#### [Register.tsx](file:///D:/Code/Prestigeum%20Academia/src/pages/Register.tsx)
- Save registration details to `dataService`.
- Implement seat availability check and deduction logic.

#### [Admin.tsx](file:///D:/Code/Prestigeum%20Academia/src/pages/Admin.tsx)
- Connect all tables to `dataService`.
- Implement "Create Event" functionality with persistence.
- Implement "Confirm Registration" and "Issue Certificate" actions.

#### [Dashboard.tsx](file:///D:/Code/Prestigeum%20Academia/src/pages/Dashboard.tsx)
- Fetch user-specific registrations.
- Save attendance and digital signature.
- Enable certificate viewing once issued by admin.

#### [VerifyCertificate.tsx](file:///D:/Code/Prestigeum%20Academia/src/pages/VerifyCertificate.tsx)
- Search `dataService` for valid certificate IDs and display details.

---

## Verification Plan

### Manual Verification
1. **User Flow**:
   - Register a new account.
   - Browse a training and register (check if seats decrease).
   - Go to Dashboard, check in, and sign.
   - Verify that data persists after refreshing the page.
2. **Admin Flow**:
   - Log in as admin.
   - Create a new training and see it appear on the Home page.
   - View the registration from the test user.
   - Confirm registration and mark attendance.
   - Issue a certificate and note the ID.
3. **Verification Flow**:
   - Go to the Verify Certificate page.
   - Enter the issued certificate ID.
   - Ensure the correct details are displayed.
