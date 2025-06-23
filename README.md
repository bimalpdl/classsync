# Class Sync - Assignment Management System

A comprehensive academic collaboration platform for Nepali colleges featuring assignment management built with the MERN stack.

## Features

- **User Authentication**: Role-based access for teachers and students
- **Assignment Management**: Create, view, and manage assignments
- **File Upload**: Support for assignment files and student submissions
- **Dashboard**: Statistics and progress tracking
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL (Neon)
- **Authentication**: Replit Auth + Simple Login
- **File Upload**: Multer
- **UI Components**: shadcn/ui

## Prerequisites

- Node.js 18+ 
- npm or yarn

**No database required!** The application uses JSON file storage for complete self-dependency.

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd class-sync
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup (Optional)

Create a `.env` file for custom configuration:

```env
# Session Secret (Optional - has default)
SESSION_SECRET=your-super-secret-session-key-here

# Replit Auth (Optional - for production)
REPLIT_DOMAINS=localhost:5000,your-domain.com
REPL_ID=your-repl-id
ISSUER_URL=https://replit.com/oidc

# Development
NODE_ENV=development
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5000`

**Data Storage**: The app automatically creates a `data/` directory with JSON files to store all data. No database setup required!

## Demo Accounts

For testing purposes, use these accounts:

**Teacher Account:**
- Email: `teacher@patancampus.edu.np`
- Password: `password123`

**Student Accounts:**
- Email: `niroj.thapa@student.patancampus.edu.np` / Password: `password123`
- Email: `bimal.paudel@student.patancampus.edu.np` / Password: `password123`
- Email: `priya.adhikari@student.patancampus.edu.np` / Password: `password123`

## Production Deployment

### 1. Replit Deployment
- Push your code to Replit
- Set environment variables in Replit Secrets
- Configure Replit Auth in your Replit account
- The app will auto-deploy

### 2. Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### 3. Railway Deployment
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### 4. Render Deployment
1. Connect your GitHub repository to Render
2. Set environment variables
3. Deploy as a Web Service

## Project Structure

```
class-sync/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
├── server/                 # Express backend
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Database operations
│   ├── db.ts              # Database connection
│   └── replitAuth.ts      # Authentication
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema
├── migrations/            # Database migrations
└── uploads/              # File uploads (auto-created)
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Data Storage

The application uses JSON files for data persistence:
- `data/users.json` - User accounts (teachers and students)
- `data/assignments.json` - Assignment details
- `data/submissions.json` - Student submissions
- Memory store for user sessions

## File Upload

Files are stored in the `uploads/` directory. In production, consider using cloud storage like:
- AWS S3
- Cloudinary
- Google Cloud Storage

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SESSION_SECRET` | Secret for session encryption | No (has default) |
| `REPLIT_DOMAINS` | Domains for Replit Auth | No |
| `REPL_ID` | Replit application ID | No |
| `NODE_ENV` | Environment (development/production) | No |

## Troubleshooting

### Data Storage Issues
- Ensure the `data/` directory is writable
- Check that JSON files aren't corrupted
- Data files are created automatically on first run

### Authentication Issues
- Make sure `SESSION_SECRET` is set
- Clear browser cookies and try again
- Verify demo account credentials

### File Upload Issues
- Check that `uploads/` directory exists and is writable
- Verify file size limits (25MB default)
- Ensure proper file types are allowed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please create an issue on the GitHub repository.