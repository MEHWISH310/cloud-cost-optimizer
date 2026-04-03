# Cloud Cost Optimizer

A full-stack web application for real-time cloud cost estimation, multi-cloud comparison, and AI-based recommendations for selecting the right cloud service and deployment models.

## Features

- Google authentication
- Real-time cost calculator for AWS, Azure, and GCP
- Multi-cloud comparison engine
- AI-based recommendation system for service and deployment models
- ML-based prediction module
- Visual analytics with charts
- Educational module on cloud models
- Cost optimization tips

## Tech Stack

- Frontend: React.js, Tailwind CSS, Chart.js, Axios
- Backend: Node.js, Express.js
- AI/ML: Python, FastAPI, Scikit-learn
- Auth: Firebase Authentication
- Database: MongoDB
- APIs: AWS Pricing API, Azure Pricing API, GCP Pricing API
- DevOps: Docker

## Project Structure

cloud-cost-optimizer/
├── frontend/
├── backend/
├── ai-service/
└── docker-compose.yml

## Getting Started

### Prerequisites

- Node.js v14+
- Python 3.8+
- Git

### Installation
```bash
git clone https://github.com/YOUR_USERNAME/cloud-cost-optimizer.git
cd cloud-cost-optimizer
```

### Run the entire project

On Windows, just double-click `start.bat` or run in terminal:
```bash
start.bat
```

This starts the backend, frontend, and AI service in separate terminal windows automatically.

### Manual Setup (if needed)

#### Backend
```bash
cd backend
npm install
npm start
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

#### AI Service
```bash
cd ai-service
pip install -r requirements.txt
python app.py
```
