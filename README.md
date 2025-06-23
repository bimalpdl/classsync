# Class Sync - Standalone Assignment Management

A self-contained academic collaboration platform for colleges featuring assignment management with zero external dependencies.

## Features

- **Zero Setup**: No database, no configuration files needed
- **Role-based Access**: Teachers create assignments, students submit work  
- **File Upload**: Documents, images, and project files
- **Dashboard**: Progress tracking and statistics
- **Responsive Design**: Works on all devices
- **Portable**: Copy folder and run anywhere

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Storage**: JSON files (no database)
- **Sessions**: Memory-based
- **File Upload**: Local storage

## Quick Start

1. **Download and Install**
   ```bash
   git clone <repo-url>
   cd class-sync
   npm install
   ```

2. **Run Application**
   ```bash
   npm run dev
   ```

3. **Access Application**
   Open `http://localhost:5000` in your browser

## What Makes This Special

- **No Database**: Uses JSON files for data persistence
- **No Configuration**: Works immediately after npm install
- **Self-Contained**: All data stored locally in the project folder
- **Portable**: Move the folder anywhere and it still works
- **Educational Perfect**: Ideal for schools without IT infrastructure

## Ready-to-Use Demo Accounts

**Teacher Account:**
- Email: `teacher@patancampus.edu.np`
- Password: `password123`

**Student Accounts:**
- Email: `niroj.thapa@student.patancampus.edu.np` / Password: `password123`
- Email: `bimal.paudel@student.patancampus.edu.np` / Password: `password123`
- Email: `priya.adhikari@student.patancampus.edu.np` / Password: `password123`

## Data Storage

All your data is automatically saved in:
- `data/users.json` - User accounts and profiles
- `data/assignments.json` - All assignments and details
- `data/submissions.json` - Student submissions and grades
- `uploads/` - All uploaded files and documents

## File Structure

```
class-sync/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # App pages
│   │   └── lib/            # Utilities
├── server/                 # Express backend
│   ├── routes.ts           # API endpoints
│   ├── memoryStorage.ts    # JSON file storage
│   └── replitAuth.ts       # Authentication
├── shared/                 # Shared types
├── data/                   # JSON database files (auto-created)
├── uploads/                # File uploads (auto-created)
└── start-local.js          # Easy startup script
```

## Deployment

**Replit**: Just push the code - works instantly
**Any Cloud Provider**: Upload folder and run `npm install && npm run dev`
**Local Network**: Run locally and access from other devices on your network

## Perfect For

- Educational institutions
- Small teams and classrooms  
- Quick demos and prototypes
- Offline environments
- Anyone wanting a hassle-free setup

## Support

This is a self-contained system designed to work out of the box. All data is stored locally in JSON files, making it completely portable and dependency-free.