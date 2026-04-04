@echo off
start cmd /k "cd backend && npm run dev"
start cmd /k "cd frontend && npm start"
start cmd /k "cd ai-service && pip install -r requirements.txt && python -m uvicorn app:app --host 0.0.0.0 --port 5001 --reload"