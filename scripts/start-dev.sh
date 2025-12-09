#!/bin/bash

echo "Starting Student Activity Platform in development mode..."

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "Starting MongoDB..."
    mongod --fork --logpath /var/log/mongodb.log --dbpath /var/lib/mongodb
    sleep 2
fi

# Start backend
echo "Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Start frontend
echo "Starting frontend..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo ""
echo "Development servers started!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop all servers"

# Function to cleanup processes
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Trap Ctrl+C and call cleanup
trap cleanup INT

# Wait for processes
wait
