# GamerEars Frontend

Single Page Application (SPA) built with React 18, Vite, and Redux Toolkit for **GamerEars** - an interactive gaming community discussion forum and guide exchange.

## Features

- **Gaming UI & Aesthetic**: Black and burgundy theme with responsive mobile breakpoints (`min-width: 320px`, phone breakpoint at 480px).
- **Authentication**: Registration with email confirmation, login, logout, and token-based password reset.
- **Feed & Exploration**: Feed with sorting (most liked, newest/oldest date), category filters, and instant keyboard search (`/` shortcut).
- **Interactive Topics**: Post creation and editing with Live Markdown Preview tabs, tags, and category multi-selection.
- **Discussion & Comments**: Vote on posts/comments (likes & dislikes), nested inline replies (`@username`), inline comment editing for authors, and status archiving.
- **Player Profiles & Ranks**: Custom avatar uploads, user post lists, and dynamic Gamer Rank tiers based on accumulated XP:
  - **Novice Scout** (0-19 XP)
  - **Dungeon Crawler** (20-49 XP)
  - **Raid Veteran** (50-99 XP)
  - **Legendary Guildmaster** (100+ XP)
- **Admin Panel**: Dedicated administration interface for managing user roles and creating/updating/deleting game categories.
- **Sidebar**: Smooth expandable/collapsible sidebar drawer with quick navigation and top game categories ranked by activity.

## Requirements

- Node.js 18+
- GamerEars Backend running at `http://localhost:3000`

## Setup

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
usof-frontend/
├── public/
│   ├── logo.png
│   └── gamerears-logo.png
├── src/
│   ├── api/             # Axios instance & entity API modules
│   │   ├── auth.api.js
│   │   ├── client.js
│   │   ├── comments.api.js
│   │   ├── posts.api.js
│   │   ├── users.api.js
│   │   └── admin.api.js
│   ├── components/      # Modular UI components
│   │   ├── comments/    # CommentItem, CommentForm, CommentList
│   │   ├── common/      # Header, Footer, Sidebar, Pagination, VoteButtons
│   │   └── posts/       # PostCard, PostFilter
│   ├── pages/           # Application views (14 pages)
│   ├── store/           # Redux Toolkit store & slices
│   │   ├── slices/      # auth, posts, comments, categories, users, admin
│   │   └── index.js
│   ├── styles/          # Plain CSS stylesheets
│   │   ├── variables.css
│   │   ├── global.css
│   │   └── main.css
│   ├── utils/           # Gamer rank and date formatting utilities
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## Documentation

For full frontend architecture, component data flows, and design decisions, see [docs/DOCUMENTATION.md](docs/DOCUMENTATION.md).

## Tech Stack

- **Core**: React 18, Vite
- **Routing**: React Router v7
- **State Management**: Redux Toolkit & React-Redux
- **HTTP Client**: Axios with request/response interceptors and JWT authorization header
- **Icons**: Lucide React
- **Styling**: Modern native CSS with CSS custom properties and responsive flex/grid layouts
