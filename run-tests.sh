#!/usr/bin/env bash
set -e

# Kill any existing processes on 3001 and 8080
fuser -k 3001/tcp 8080/tcp 2>/dev/null || true
sleep 1

echo "Starting HTTP backend via tsx..."
pnpm --filter http-backend exec tsx src/index.ts &
HTTP_PID=$!

echo "Starting WS backend via tsx..."
pnpm --filter ws-backend exec tsx src/index.ts &
WS_PID=$!

cleanup() {
  echo "Shutting down servers (PIDs: $HTTP_PID, $WS_PID)..."
  kill $HTTP_PID $WS_PID 2>/dev/null || true
}
trap cleanup EXIT

# Wait for HTTP server to respond
echo "Waiting for servers to be ready..."
for i in {1..30}; do
  if curl -s http://localhost:3001 > /dev/null 2>&1; then
    break
  fi
  sleep 0.3
done
sleep 1

echo ""
echo "Running Original Backend Tests..."
NODE_PATH=/home/baibhavraj/cohord/week-22/draw-app/apps/ws-backend/node_modules node test-backends.mjs

echo ""
echo "Running Collaborative Whiteboard Tests..."
NODE_PATH=/home/baibhavraj/cohord/week-22/draw-app/apps/ws-backend/node_modules node test-collaborative-whiteboard.mjs

echo "All tests passed successfully!"


