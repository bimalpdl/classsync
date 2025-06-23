#!/bin/bash

echo "🚀 Setting up Class Sync locally..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not installed. You'll need a database connection."
    echo "   Consider using a cloud database like Neon, Supabase, or Railway."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment file
if [ ! -f .env ]; then
    echo "📋 Creating environment file..."
    cp .env.example .env
    echo "✅ Please edit .env file with your database credentials"
else
    echo "✅ Environment file already exists"
fi

# Create uploads directory
mkdir -p uploads
echo "📁 Created uploads directory"

# Check if database is accessible
if [ -n "$DATABASE_URL" ]; then
    echo "🗄️  Testing database connection..."
    if psql "$DATABASE_URL" -c '\q' 2>/dev/null; then
        echo "✅ Database connection successful"
        
        # Run migrations
        echo "🔄 Running database migrations..."
        psql "$DATABASE_URL" -f migrations/0001_initial.sql
        echo "✅ Database setup complete"
    else
        echo "❌ Database connection failed. Please check your DATABASE_URL"
    fi
else
    echo "⚠️  DATABASE_URL not set. Please configure your database in .env file"
fi

echo ""
echo "🎉 Setup complete! "
echo ""
echo "Next steps:"
echo "1. Edit .env file with your database credentials"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Open http://localhost:5000 in your browser"
echo ""
echo "Demo accounts:"
echo "Teacher: teacher@patancampus.edu.np / password123"
echo "Student: niroj.thapa@student.patancampus.edu.np / password123"