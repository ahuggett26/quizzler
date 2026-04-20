# Monorepo example

Structure:
- packages/shared: shared TypeScript types
- packages/frontend: React + Vite + TypeScript
- packages/backend: Express + TypeScript

Quick start:
1. npm install
2. npm run dev:frontend   # starts Vite dev server
3. npm run dev:backend    # starts Express with ts-node-dev

Notes:
- Each package uses workspace:* to reference @monorepo/shared locally.
- Tweak dependency versions as desired.