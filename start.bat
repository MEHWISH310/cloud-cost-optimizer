@echo off
start cmd /k "cd backend && npm run dev"
start cmd /k "cd frontend && npm start"
start cmd /k "cd ai-service && pip install -r requirements.txt && python app.py"