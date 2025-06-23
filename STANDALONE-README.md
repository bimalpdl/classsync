# Class Sync - Self-Contained Version

**Zero Dependencies Setup** - No database required! This version uses JSON file storage.

## Quick Start (3 Steps)

1. **Download & Install**
   ```bash
   # Download the project
   git clone <repo-url>
   cd class-sync
   
   # Install dependencies
   npm install
   ```

2. **Run the Application**
   ```bash
   # Option 1: Auto-setup and start
   npm run start-local
   
   # Option 2: Manual start
   npm run dev
   ```

3. **Open in Browser**
   - Go to `http://localhost:5000`
   - Use demo accounts to login

## Demo Accounts

**Teacher Account:**
- Email: `teacher@patancampus.edu.np`
- Password: `password123`

**Student Accounts:**
- Email: `niroj.thapa@student.patancampus.edu.np` / Password: `password123`
- Email: `bimal.paudel@student.patancampus.edu.np` / Password: `password123`
- Email: `priya.adhikari@student.patancampus.edu.np` / Password: `password123`

## What's Different from Database Version

✅ **No PostgreSQL required** - Uses JSON files in `data/` folder
✅ **No environment setup needed** - Works out of the box
✅ **Portable** - Copy folder and run anywhere
✅ **All features intact** - Assignment management, file uploads, authentication

## Data Storage

Your data is automatically saved in:
- `data/users.json` - User accounts
- `data/assignments.json` - Assignments 
- `data/submissions.json` - Student submissions
- `uploads/` - Uploaded files

## Features

- **Role-based Access**: Teachers create assignments, students submit work
- **File Upload Support**: Documents, images, and other files
- **Dashboard**: Statistics and progress tracking
- **Responsive Design**: Works on desktop and mobile
- **Offline Capable**: No internet required after initial setup

## Deployment Options

### 1. Local Network Sharing
```bash
# Edit server to bind to 0.0.0.0 instead of localhost
# Then access via your IP address from other devices
```

### 2. Cloud Deployment
- **Replit**: Push code directly, works instantly
- **Heroku**: `git push heroku main`
- **Vercel**: Connect GitHub repo
- **Railway**: One-click deploy

### 3. Docker
```bash
docker-compose up
```

## Troubleshooting

**App won't start?**
- Ensure Node.js 18+ is installed
- Run `npm install` again
- Check that ports 5000 is available

**Data not saving?**
- Verify `data/` folder is writable
- Check disk space
- Restart the application

**Can't access from other devices?**
- The app binds to localhost by default
- For network access, modify the server configuration

## Technical Details

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express
- **Storage**: JSON files + Memory sessions
- **File Handling**: Multer with local storage
- **Authentication**: Session-based with demo accounts

This version is perfect for:
- Educational institutions without IT infrastructure
- Quick demos and prototypes
- Development and testing
- Offline environments
- Small teams and classrooms