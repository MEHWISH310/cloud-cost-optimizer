from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import json
from model import load_artifacts, predict
from dataset import generate_dataset
from train import train_models
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

if not os.path.exists("dataset.csv"):
    generate_dataset()

if not os.path.exists("model_service_model.pkl"):
    train_models()

models, encoders, scalers = load_artifacts()

class InputData(BaseModel):
    budget: float
    workload: str
    scalability: str
    security: str
    region: Optional[str] = "us"
    team_size: Optional[float] = 10
    data_volume_gb: Optional[float] = 100
    uptime_requirement: Optional[float] = 99.9
    compliance_required: Optional[float] = 0
    existing_infra: Optional[float] = 0
    uses_microsoft_stack: Optional[float] = 0
    uses_google_workspace: Optional[float] = 0
    multi_region: Optional[float] = 0
    serverless_preference: Optional[float] = 0

@app.post("/recommend")
def recommend(data: InputData):
    result = predict(data.dict(), models, encoders, scalers)
    return result

@app.get("/metrics")
def get_metrics():
    with open("metrics.json", "r") as f:
        return json.load(f)

@app.get("/health")
def health():
    return {"status": "ok"}