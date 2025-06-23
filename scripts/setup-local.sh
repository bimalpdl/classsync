#!/bin/bash

echo "🚀 Setting up Class Sync locally..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# No database required!
echo "✅ No database setup needed - using JSON file storage"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment file (optional)
if [ ! -f .env ]; then
    echo "📋 Creating environment file (optional)..."
    cp .env.example .env
    echo "✅ Environment file created (you can customize SESSION_SECRET if needed)"
else
    echo "✅ Environment file already exists"
fi

# Create directories
mkdir -p uploads data
echo "📁 Created uploads and data directories"

# Initialize data files
echo "📊 Data will be automatically initialized on first run"

echo ""
echo "🎉 Setup complete! "
echo ""
echo "Next steps:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Open http://localhost:5000 in your browser"
echo "3. Data will be stored in JSON files in the data/ directory"
echo ""
echo "Demo accounts:"
echo "Teacher: teacher@patancampus.edu.np / password123"
echo "Student: niroj.thapa@student.patancampus.edu.np / password123"