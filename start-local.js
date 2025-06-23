#!/usr/bin/env node

const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Class Sync...');

// Create necessary directories
const dirs = ['uploads', 'data'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created ${dir} directory`);
  }
});

// Set default environment if not exists
if (!process.env.SESSION_SECRET) {
  process.env.SESSION_SECRET = 'local-development-secret-' + Math.random().toString(36);
}

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

console.log('✅ Environment configured');
console.log('📊 Data will be stored in JSON files');
console.log('🌐 Starting server at http://localhost:5000');

// Start the application
const child = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env }
});

child.on('close', (code) => {
  console.log(`\n📋 Server stopped with code ${code}`);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down...');
  child.kill('SIGINT');
});