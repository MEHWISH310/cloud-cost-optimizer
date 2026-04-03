# Setup Guide

## Prerequisites
- Node.js v14+
- Python 3.8+
- Git

## First Time Setup

### Frontend
```bash
cd frontend
npm install
```

### Backend
```bash
cd backend
npm install
```

### AI Service
```bash
cd ai-service
pip install -r ai-service/requirements.txt
```

## Running the Project

Simply run the batch file from the root:
```bash
start.bat
```

This opens three terminal windows for frontend, backend, and AI service automatically.

## Environment Variables

### frontend/.env

REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=

### backend/.env

PORT=5000
MONGO_URI=