# GamerEars Frontend — Documentation

## 1. Engage

* **Challenge:** Build an interactive, performant Single Page Application (SPA) for the GamerEars community forum. The frontend must consume the backend REST API, implement full authentication and email verification workflows, maintain responsive layouts across desktop and mobile devices, and offer fluid interactions (live search, markdown previews, voting, inline comment editing, and admin management).
* **Goal:** Deliver a modern React 18 application with clean state management via Redux Toolkit, zero bloated CSS frameworks, strictly zero inline code comments, and 100% build reliability.

---

## 2. Investigate

### 2.1 Technical Decisions Matrix

| Domain | Choice | Engineering Justification |
| :--- | :--- | :--- |
| **Framework & Build** | React 18 + Vite | Fast HMR in development and optimized production bundling under 400KB. |
| **State Management** | Redux Toolkit (`@reduxjs/toolkit`) | Predictable unidirectional state flow across 6 domain slices with async thunks. |
| **Routing** | React Router v7 | Client-side routing with route-level protection (`ProtectedRoute.jsx`) for auth and admin views. |
| **HTTP Client** | Axios | Request interceptors automatically inject JWT Bearer tokens |
| **Styling Strategy** | Modern Pure CSS | CSS Custom Properties (`variables.css`), CSS Grid, and Flexbox without the bundle overhead of UI libraries. |
| **Icons** | Lucide React | Lightweight SVG icon library providing crisp UI iconography. |

---

### 2.2 Component Hierarchy & Data Flow

```
BrowserRouter (App.jsx)
  ├── Header.jsx (Brand logo, live search bar, user XP pill, admin link)
  ├── Sidebar.jsx (Collapsible navigation drawer, top game categories)
  ├── Main Content (<Routes>)
  │     ├── HomePage.jsx (Feed with sorting and category filter chips)
  │     ├── PostDetailPage.jsx (Post content, voting, comment tree, replies)
  │     ├── CreatePostPage.jsx / EditPostPage.jsx (Live Markdown Preview)
  │     ├── ProfilePage.jsx (Gamer rank badge, avatar upload, user posts)
  │     ├── AdminDashboardPage.jsx (Guild stats, user roles, category CRUD)
  │     └── Auth Pages (LoginPage, RegisterPage, ConfirmEmailPage, ResetPasswordPage)
  └── Footer.jsx (Minimalist GamerEars copyright)
```

### 2.3 Redux Toolkit Store Architecture

The global Redux store (`src/store/index.js`) manages 6 decoupled slices:
* **`authSlice`:** Stores authenticated user profile, token in `localStorage`, and handles login/logout/register.
* **`postsSlice`:** Manages paginated post feed, sorting state (likes vs date, asc vs desc), and active filters.
* **`commentsSlice`:** Manages comments list, inline replies, author editing, and like votes for comments.
* **`categoriesSlice`:** Caches game categories and provides real-time post counts for the sidebar.
* **`usersSlice`:** Manages profile data, favorite posts, and avatar file uploads.
* **`adminSlice`:** Manages global metrics and administrative user lists.

---

## 3. Act — Key User Workflows and Features

### 3.1 Live Markdown Post Preview
When creating or editing a guide, authors can switch between `[ Write ]` and `[ Preview ]` tabs. The preview renders the formatted post in real time, displaying the title, author badge, formatted markdown content, and tagged categories before submitting to the API.

### 3.2 Dynamic RPG Gamer Rank Progression
User XP (rating) is translated into rank tiers using `gamerRank.js`:
* **Novice Scout:** `0 – 19 XP`
* **Dungeon Crawler:** `20 – 49 XP`
* **Raid Veteran:** `50 – 99 XP`
* **Legendary Guildmaster:** `100+ XP`

The rank badge, level, and avatar border color update automatically across the header, post cards, and profile page.

### 3.3 Interactive Discussion and Inline Actions
* **Voting:** Click thumbs up/down to like or dislike. Score updates optimistically.
* **Inline Replies:** Clicking "Reply" expands a contextual reply box pre-populated with `@author_login`.
* **Author Comment Editing:** Authors can click the edit icon to modify their comment in place without leaving the page.
* **Favorites:** Bookmark any guide with one click for easy retrieval under the Favorites tab.

### 3.4 Responsive Mobile Adaptation
* **Breakpoints:** Responsive rules at `768px` (collapsing sidebar) and `480px` (mobile header, stacked layouts).
* **Minimum Width:** `min-width: 320px` prevents layout crushing on small smartphone screens.

---

## 4. Frontend Screenshots Guide

Save the following screenshots in `usof-frontend/docs/screenshots/`:

| Filename | Page / View | Action / State to Capture |
| :--- | :--- | :--- |
| `01-home-feed.png` | Home Page (`http://localhost:5173/`) | Full desktop feed showing the header, logo, search bar, sidebar with categories, and post cards with XP badges. |
| `02-login.png` | Sign In (`/login`) | Sign In form with GamerEars branding, inputs, and "Don't have an account? Register" link. |
| `03-post-detail.png` | Post Detail (`/posts/1`) | Discussion page showing topic title, author badge, content, vote buttons, and comment responses. |
| `04-post-preview.png` | Create Post (`/posts/new`) | Create guide screen with the **Preview tab** active showing formatted markdown. |
| `05-profile-page.png` | Profile Page (`/profile/1`) | User profile showing avatar, Gamer Rank title, XP count, and user's published topics. |
| `06-admin-dashboard.png` | Admin Panel (`/admin`) | Admin dashboard showing stat cards (Players, Discussions, Responses, Categories) and management tabs. |
| `07-email-verified.png` | Email Confirmation (`/confirm-email/...`) | "Email Verified!" success screen with the green checkmark and "Log In Now" button. |
| `08-mobile-view.png` | Home Page (Mobile width) | DevTools mobile view (iPhone/Android width) showing clean collapsed layout and responsive header. |

---

## 5. Frontend Requirements and Feature Checklist

All frontend objectives and requirements for Lab 2 (SPA) have been completed and verified:

### Architecture and Foundation
- [x] React 18 Single Page Application initialized with Vite 6.
- [x] Client-side routing with React Router v7 and RBAC route guarding (`ProtectedRoute.jsx`).
- [x] Global state management via Redux Toolkit with 6 modular slices (`auth`, `posts`, `comments`, `categories`, `users`, `admin`).
- [x] Axios instance configured with automatic JWT Bearer token attachment and unified error interceptors.
- [x] Zero bloated CSS frameworks: 100% bespoke native CSS with CSS variables, Flexbox, and CSS Grid.

### User Interface and Layout
- [x] Custom GamerEars branding: Black and burgundy aesthetic with champagne accents.
- [x] Responsive layout with mobile drawer collapse (`@media max-width: 768px`) and phone optimization (`@media max-width: 480px`).
- [x] Minimum layout width (`min-width: 320px`) preventing viewport crushing on mobile devices.
- [x] In-page collapsible sidebar with persistent state in `localStorage`.
- [x] Minimalist centered footer: `GamerEars © 2026`.

### Authentication and Account Flows
- [x] User registration with instant client validation and password confirmation match check.
- [x] Dedicated email verification screen (`ConfirmEmailPage.jsx`) with React StrictMode idempotency guard.
- [x] User login with token storage in `localStorage` and Redux state synchronization.
- [x] User logout clearing tokens and resetting user context.
- [x] Password reset request and confirmation forms.
- [x] Profile management with custom avatar file upload via Multer.

### Feed, Topics and Discussions
- [x] Feed with live search bar, keyboard shortcut focus (`/`), and clear indicators.
- [x] Sorting controls: sort by likes (score) or date, with ascending / descending toggle.
- [x] Dynamic category filtering chips reflecting top categories with real-time post counts.
- [x] Post creation and editing with interactive `[ Write ]` and `[ Preview ]` live markdown tabs.
- [x] Post and comment voting controls with optimistic score updates and active vote states.
- [x] Inline comment replies pre-populated with `@author_login` tag.
- [x] Author comment editing in place with Save and Cancel buttons.
- [x] One-click bookmarking of topics to user Favorites.

### Moderation and Progression
- [x] Dynamic RPG Gamer Rank calculator (`Novice Scout`, `Dungeon Crawler`, `Raid Veteran`, `Legendary Guildmaster`) displayed with tier colors and borders.
- [x] Admin Panel with live statistical metrics (total users, topics, responses, categories).
- [x] Admin user management: change roles (`user` vs `admin`) and delete accounts.
- [x] Admin category management: create, edit title/description, and remove game categories.
- [x] Content immutability enforcement: admins see category/status moderation UI instead of editable post content on others' posts.
