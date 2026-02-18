# Church CMS - Frontend

A modern React frontend for the Church Management System built with:

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Axios** for API communication

## Features

- 🔐 JWT Authentication with role-based access
- 🌓 Dark/Light theme support
- 👥 Member management (CRUD operations)
- 📱 Responsive design
- 🎨 Modern UI with shadcn/ui components
- 🔄 Real-time state management with Redux

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create a `.env` file in the client directory:

```env
VITE_API_URL=http://localhost:8000
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout.tsx      # Main layout component
│   ├── header.tsx      # Header with navigation
│   ├── sidebar.tsx     # Sidebar navigation
│   └── theme-provider.tsx # Theme context provider
├── pages/              # Page components
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── MembersPage.tsx
│   └── ...
├── store/              # Redux store and slices
│   ├── slices/
│   │   ├── authSlice.ts
│   │   ├── membersSlice.ts
│   │   └── themeSlice.ts
│   └── store.ts
├── lib/                # Utility functions
│   ├── api.ts          # Axios configuration
│   └── utils.ts        # Helper functions
└── App.tsx             # Main app component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Authentication

The app uses JWT tokens for authentication. Default admin credentials:

- Username: `admin`
- Password: `Admin@123`

## API Integration

The frontend communicates with the FastAPI backend running on `http://localhost:8000`. Make sure the backend server is running before starting the frontend.

## Theme Support

The app supports light/dark themes with system preference detection. Users can toggle between themes using the theme switcher in the header.

## Role-Based Access

- **Admin**: Full access to all features including user management
- **User**: Access to member management features only

## Development

The app uses modern React patterns:

- Functional components with hooks
- TypeScript for type safety
- Redux Toolkit for predictable state management
- React Router for client-side routing
- Tailwind CSS for utility-first styling
