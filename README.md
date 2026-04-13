# DevMate

![CI](https://github.com/YOUR_GITHUB_USERNAME/devmate/actions/workflows/ci.yml/badge.svg)

An AI-powered developer and job matching platform.

## Tech Stack

**Backend**
- Node.js + Express + TypeScript
- PostgreSQL + Prisma ORM + pgvector
- LangChain.js + Google Gemini (RAG-based AI matching)
- Redis (caching)
- Socket.IO (real-time notifications)
- Docker + Docker Compose
- Swagger/OpenAPI documentation
- Jest unit tests

**Frontend**
- React + TypeScript + Vite
- Tailwind CSS
- Axios + React Router
- Socket.IO client

**DevOps**
- Docker Compose (local development)
- GitHub Actions CI/CD

## How It Works

1. Developers create profiles with their skills and experience
2. Companies post job requirements
3. AI reads both sides using RAG architecture and ranks developers by match score with reasoning
4. Developers receive real-time Socket.IO notifications when matched
5. Developers can also manually apply to jobs

## Running Locally

```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Backend
cd backend
npm install
npx prisma migrate dev
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

## API Documentation

Swagger UI available at `http://localhost:8000/api-docs`
