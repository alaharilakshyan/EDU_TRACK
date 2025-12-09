#!/bin/bash

echo "Setting up Student Activity Platform..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "Warning: MongoDB is not installed. Please install MongoDB for local development."
    echo "You can use MongoDB Atlas as an alternative."
fi

# Setup backend
echo "Setting up backend..."
cd backend
npm install

# Copy environment file
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created backend/.env - Please update with your configuration"
fi

cd ..

# Setup frontend
echo "Setting up frontend..."
cd frontend
npm install

# Copy environment file
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created frontend/.env - Please update with your configuration"
fi

cd ..

echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your database and API keys"
echo "2. Update frontend/.env if needed"
echo "3. Start MongoDB: mongod"
echo "4. Start backend: cd backend && npm run dev"
echo "5. Start frontend: cd frontend && npm start"
