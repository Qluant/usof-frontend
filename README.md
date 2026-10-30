# GamerEars (USOF) Frontend

Single Page Application (SPA) built with React 18, Vite, and Redux Toolkit for **GamerEars** - a gaming community and discussion forum.

## Features

- **Clean Minimal UI**: Minimalistic design with burgundy accents and full responsiveness for mobile and desktop screens.
- **Authentication**: Registration with email confirmation, login, logout, and token-based password reset.
- **Posts & Feed**: Feed with sorting (most liked, newest/oldest date), category filters, date filters, and search.
- **Topics & Questions**: Post creation and editing with Live Preview tabs, category multi-selection, and active/archived status toggling.
- **Discussions & Comments**: Voting system (likes & dislikes), nested inline replies, inline comment editing for authors, and comment moderation.
- **User Profiles & Reputation**: Custom avatar uploads, user post lists, and reputation rating tiers based on accumulated score.
- **Admin Panel**: Dedicated administration interface for managing users, roles, creating/editing categories, and platform statistics.
- **Sidebar & Navigation**: Expandable/collapsible sidebar with quick navigation and top categories ranked by post count.
- **Saved Topics**: Bookmarking system for saving favorite posts.

## Requirements

- Node.js 18+
- USOF Backend running at `http://localhost:3000`

## Setup

```bash
cp .env.example .env
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
│   └── logo.png
├── src/
│   ├── api/             # Axios instance & entity API modules
│   │   ├── auth.api.js
│   │   ├── client.js
│   │   ├── comments.api.js
│   │   ├── posts.api.js
│   │   ├── users.api.js
│   │   └── admin.api.js
│   ├── components/      # UI components
│   │   ├── comments/    # CommentItem, CommentForm, CommentList
│   │   ├── common/      # Header, Footer, Sidebar, Pagination, VoteButtons
│   │   └── posts/       # PostCard, PostFilter
│   ├── pages/           # Application views
│   ├── store/           # Redux Toolkit store and slices
│   ├── styles/          # Variables, layout, and global styling
│   └── utils/           # Utility helpers
```
