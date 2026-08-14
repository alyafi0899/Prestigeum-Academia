# Transition to Dynamic Web - Prestigeum Academia

This plan outlines the steps to transform the current static "Prestigeum Academia" website into a fully functional dynamic application using **Supabase** for persistence, authentication, and logic.

## User Review Required

> [!IMPORTANT]
> **Database Choice**: We are using **Supabase**. To avoid conflicts with existing projects in your Supabase instance, I will prefix all tables with `pa_` (e.g., `pa_trainings`).

- **Supabase Credentials**:
    - URL: `https://fkbsvefhnzaoodlvlyap.supabase.co`
    - Anon Key: `sb_publishable_f9V7L21-GNrH5YtxfiDhtw__CHNBkk9`
- **Admin Account**: I will create an initial admin account in the `pa_profiles` table.
- **Migration**: I will provide a SQL script that you can run in your Supabase SQL Editor to set up the tables correctly with the `pa_` prefix.

## Proposed Changes

### Core Service Layer
Integrating Supabase as the single source of truth.

#### [NEW] [supabaseClient.ts](file:///D:/Code/Prestigeum%20Academia/src/lib/supabaseClient.ts)
- Initialize Supabase client using environment variables.

#### [NEW] [dataService.ts](file:///D:/Code/Prestigeum%20Academia/src/data/dataService.ts)
- Implement CRUD operations targeting `pa_` prefixed tables.
- Handle error states and loading states.
- Methods for: `getTrainings`, `createRegistration`, `getArticles`, `updateAttendance`, `issueCertificate`.

---

### Authentication & Authorization
Switching from mock auth to Supabase Auth.

- **Admin Account**: `admin@demo.com` / `admin123!@#` (I will provide instructions to manually create this in Supabase).
- **User Auth Features**:
    - Sign up / Sign in via email.
    - Password Reset / Forgot Password flow (using Supabase Auth).
    - Basic Role-based access control (RBAC) via the `pa_profiles` table.

#### [AuthContext.tsx](file:///D:/Code/Prestigeum%20Academia/src/context/AuthContext.tsx)
- Use `supabase.auth` for `login`, `register`, and `logout`.
- Fetch additional user data (role, name) from the `pa_profiles` table.
- Maintain session persistence automatically.

---

### Feature Logic

#### [Register.tsx](file:///D:/Code/Prestigeum%20Academia/src/pages/Register.tsx)
- Insert registration record into `pa_registrations`.
- Use an RPC (Remote Procedure Call) or Transaction to atomically decrease `seats_left` in `pa_trainings`.

#### [Admin.tsx](file:///D:/Code/Prestigeum%20Academia/src/pages/Admin.tsx)
- Connect all dashboards to real Supabase tables.
- Implement "Create Event" (inserts to `pa_trainings`).
- Implement "Confirm Registration" and "Issue Certificate" (updates `pa_registrations` and `pa_certificates`).

#### [Dashboard.tsx](file:///D:/Code/Prestigeum%20Academia/src/pages/Dashboard.tsx)
- Fetch registrations filtered by the logged-in user's ID.
- Save attendance/signature to the registration record.

---

## Data Schema (Prefixed)

| Table Name | Description |
| :--- | :--- |
| `pa_profiles` | Extends Supabase auth.users with `full_name`, `role`, `wa_number`. |
| `pa_trainings` | Stores training details, seats, price, etc. |
| `pa_registrations` | Maps users to trainings with status, attendance, and signature. |
| `pa_articles` | Blog posts and news. |
| `pa_gallery` | Images and captions for the gallery. |
| `pa_certificates` | Issued certificates with ID, training, and verification status. |
