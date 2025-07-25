# Class Sync - SQLite Database Assignment Management

A self-contained academic collaboration platform for colleges featuring assignment management with SQLite database storage.

## Features

- **SQLite Database**: Robust relational database storage with ACID compliance
- **Role-based Access**: Teachers create assignments, students submit work  
- **File Upload**: Documents, images, and project files
- **Dashboard**: Progress tracking and statistics
- **Responsive Design**: Works on all devices
- **Portable**: Copy folder and run anywhere

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: SQLite with better-sqlite3
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

- **SQLite Database**: Uses robust relational database for data persistence
- **No External Dependencies**: Self-contained with SQLite database file
- **Data Integrity**: Foreign key constraints and ACID compliance
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
- `data/classsync.db` - SQLite database with all data
- `uploads/` - All uploaded files and documents

## Database Schema

The application uses a relational database with three main tables:

- **Users**: Teacher and student accounts with authentication
- **Assignments**: Course assignments with metadata and due dates
- **Submissions**: Student work submissions with grades and feedback

## File Structure

```
classsync/
├── client/                 # React frontend
├── server/                 # Node.js backend
│   ├── sqliteStorage.ts   # SQLite database operations
│   ├── routes.ts          # API endpoints
│   └── index.ts           # Server entry point
├── data/
│   └── classsync.db       # SQLite database file
├── uploads/               # File uploads directory
└── shared/                # Shared TypeScript types
```

## Migration from JSON Files

This application was migrated from JSON file storage to SQLite database. The migration provides:

- **Better Performance**: Indexed queries vs file parsing
- **Data Integrity**: Foreign key constraints and ACID compliance
- **Scalability**: Handles larger datasets efficiently
- **Concurrent Access**: Proper database locking

See `SQLITE-MIGRATION.md` for detailed migration information.

## Development

### Database Operations
```bash
# View database contents
sqlite3 data/classsync.db "SELECT * FROM users;"

# Backup database
cp data/classsync.db data/backup.db

# Reset database (if needed)
rm data/classsync.db && npm run dev
```

### API Endpoints
- `GET /api/assignments` - List assignments
- `POST /api/assignments` - Create assignment (teachers only)
- `GET /api/dashboard/stats` - Dashboard statistics
- `POST /api/simple-login` - User authentication

## Deployment

### Local Network
```bash
# Edit server to bind to 0.0.0.0
# Then access via your IP address from other devices
```

### Cloud Deployment
- **Replit**: Push code directly, works instantly
- **Vercel**: Deploy with database file included
- **Railway**: Supports SQLite databases

## Support

For issues or questions:
1. Check the `SQLITE-MIGRATION.md` file for database details
2. Verify the database file exists in `data/classsync.db`
3. Check server logs for error messages

## License

MIT License - Feel free to use and modify for your educational needs.