import pandas as pd
import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import (accuracy_score, precision_score, recall_score,
                             f1_score, classification_report, confusion_matrix)
import pickle
import json

def train_models():
    df = pd.read_csv("dataset.csv")

    workload_le = LabelEncoder()
    scalability_le = LabelEncoder()
    security_le = LabelEncoder()
    region_le = LabelEncoder()

    df["workload_enc"] = workload_le.fit_transform(df["workload"])
    df["scalability_enc"] = scalability_le.fit_transform(df["scalability"])
    df["security_enc"] = security_le.fit_transform(df["security"])
    df["region_enc"] = region_le.fit_transform(df["region"])

    feature_encoders = {
        "workload": list(workload_le.classes_),
        "scalability": list(scalability_le.classes_),
        "security": list(security_le.classes_),
        "region": list(region_le.classes_),
    }

    features = [
        "budget", "workload_enc", "scalability_enc", "security_enc",
        "region_enc", "team_size", "data_volume_gb",
        "uptime_requirement", "compliance_required", "existing_infra",
        "uses_microsoft_stack", "uses_google_workspace",
        "ml_focus", "multi_region", "serverless_preference"
    ]

    X = df[features]
    results = {}

    for target in ["service_model", "deployment_model", "provider"]:
        print(f"\nTraining models for: {target}")
        le_target = LabelEncoder()
        y = le_target.fit_transform(df[target])

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )

        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)

        models = {
            "Decision Tree": (DecisionTreeClassifier(max_depth=10, min_samples_split=8, random_state=42), False),
            "Random Forest": (RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42), False),
            "Gradient Boosting": (GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, max_depth=5, random_state=42), False),
            "Logistic Regression": (LogisticRegression(max_iter=1000, random_state=42), True),
        }

        best_model = None
        best_acc = 0
        best_use_scaler = False
        model_comparison = {}

        for name, (model, use_scaled) in models.items():
            print(f"  Training {name}...")
            Xtr = X_train_scaled if use_scaled else X_train
            Xte = X_test_scaled if use_scaled else X_test
            model.fit(Xtr, y_train)
            y_pred = model.predict(Xte)
            acc = accuracy_score(y_test, y_pred)
            prec = precision_score(y_test, y_pred, average="weighted", zero_division=0)
            rec = recall_score(y_test, y_pred, average="weighted", zero_division=0)
            f1 = f1_score(y_test, y_pred, average="weighted", zero_division=0)

            model_comparison[name] = {
                "accuracy": round(float(acc), 4),
                "precision": round(float(prec), 4),
                "recall": round(float(rec), 4),
                "f1_score": round(float(f1), 4),
            }
            print(f"  {name}: Acc={acc:.4f}")

            if acc > best_acc:
                best_acc = acc
                best_model = model
                best_use_scaler = use_scaled  # KEY FIX: track which model won

        Xte_best = X_test_scaled if best_use_scaler else X_test
        y_pred_best = best_model.predict(Xte_best)
        cm = confusion_matrix(y_test, y_pred_best).tolist()
        report = classification_report(
            y_test, y_pred_best,
            target_names=le_target.classes_,
            output_dict=True,
            zero_division=0
        )

        results[target] = {
            "best_model": type(best_model).__name__,
            "accuracy": round(float(best_acc), 4),
            "confusion_matrix": cm,
            "classification_report": {k: v for k, v in report.items()},
            "model_comparison": model_comparison,
            "classes": list(le_target.classes_),
        }

        with open(f"model_{target}.pkl", "wb") as f:
            pickle.dump(best_model, f)
        with open(f"encoder_{target}.pkl", "wb") as f:
            pickle.dump(le_target, f)
        with open(f"scaler_{target}.pkl", "wb") as f:
            pickle.dump(scaler, f)
        with open(f"use_scaler_{target}.json", "w") as f:
            json.dump({"use": best_use_scaler}, f)

        print(f"Best: {type(best_model).__name__} | Accuracy: {best_acc:.4f} | Uses scaler: {best_use_scaler}")

    with open("encoders.pkl", "wb") as f:
        pickle.dump(feature_encoders, f)

    with open("metrics.json", "w") as f:
        json.dump(results, f, indent=2)

    print("\nAll models trained and saved successfully.")
    return results

if __name__ == "__main__":
    train_models()