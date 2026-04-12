import pandas as pd
import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split, learning_curve
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import (accuracy_score, precision_score, recall_score,
                             f1_score, classification_report, confusion_matrix,
                             ConfusionMatrixDisplay)
import pickle
import json
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import os

# ── Plotting helpers ──────────────────────────────────────────────────────────

def plot_learning_curve(model, X, y, target_name, use_scaled=False, scaler=None):
    """
    Plots training vs validation accuracy learning curve
    and saves to learning_curve_<target>.png
    """
    if use_scaled and scaler is not None:
        X_plot = scaler.transform(X)
    else:
        X_plot = X

    train_sizes, train_scores, val_scores = learning_curve(
        model,
        X_plot, y,
        cv=5,
        scoring='accuracy',
        n_jobs=-1,
        train_sizes=np.linspace(0.1, 1.0, 10),
        shuffle=True,
        random_state=42
    )

    train_mean = train_scores.mean(axis=1)
    train_std  = train_scores.std(axis=1)
    val_mean   = val_scores.mean(axis=1)
    val_std    = val_scores.std(axis=1)

    fig, ax = plt.subplots(figsize=(8, 5))
    ax.plot(train_sizes, train_mean, 'o-', color='#2196F3', linewidth=2, label='Training Accuracy')
    ax.plot(train_sizes, val_mean,   's-', color='#FF9800', linewidth=2, label='Validation Accuracy')
    ax.fill_between(train_sizes, train_mean - train_std, train_mean + train_std,
                    alpha=0.15, color='#2196F3')
    ax.fill_between(train_sizes, val_mean - val_std, val_mean + val_std,
                    alpha=0.15, color='#FF9800')
    ax.set_xlabel('Training Set Size', fontsize=12)
    ax.set_ylabel('Accuracy', fontsize=12)
    ax.set_title(f'Learning Curve — {target_name}', fontsize=13, fontweight='bold')
    ax.legend(fontsize=11)
    ax.set_ylim([0.6, 1.05])
    ax.grid(True, linestyle='--', alpha=0.5)
    plt.tight_layout()

    fname = f'learning_curve_{target_name.replace(" ", "_").lower()}.png'
    plt.savefig(fname, dpi=150, bbox_inches='tight')
    plt.close()
    print(f'  Saved: {fname}')


def plot_confusion_matrix(y_test, y_pred, classes, target_name):
    """
    Plots and saves confusion matrix as confusion_matrix_<target>.png
    """
    cm = confusion_matrix(y_test, y_pred)
    fig, ax = plt.subplots(figsize=(6, 5))
    disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=classes)
    disp.plot(ax=ax, colorbar=True, cmap='Blues', values_format='d')
    ax.set_title(f'Confusion Matrix — {target_name}', fontsize=13, fontweight='bold')
    plt.tight_layout()

    fname = f'confusion_matrix_{target_name.replace(" ", "_").lower()}.png'
    plt.savefig(fname, dpi=150, bbox_inches='tight')
    plt.close()
    print(f'  Saved: {fname}')


def plot_model_comparison(model_comparison, target_name):
    """
    Bar chart comparing all 4 models' accuracy for a given target.
    Saves as model_comparison_<target>.png
    """
    names    = list(model_comparison.keys())
    accs     = [model_comparison[n]['accuracy'] for n in names]
    f1scores = [model_comparison[n]['f1_score'] for n in names]

    x = np.arange(len(names))
    width = 0.35

    fig, ax = plt.subplots(figsize=(9, 5))
    bars1 = ax.bar(x - width/2, accs,     width, label='Accuracy',  color='#2196F3', alpha=0.85)
    bars2 = ax.bar(x + width/2, f1scores, width, label='F1-Score',  color='#4CAF50', alpha=0.85)

    ax.set_xlabel('Model', fontsize=12)
    ax.set_ylabel('Score', fontsize=12)
    ax.set_title(f'Model Comparison — {target_name}', fontsize=13, fontweight='bold')
    ax.set_xticks(x)
    ax.set_xticklabels(['Decision\nTree', 'Random\nForest', 'Gradient\nBoosting', 'Logistic\nRegression'],
                       fontsize=10)
    ax.legend(fontsize=11)
    ax.set_ylim([0.7, 1.02])
    ax.grid(True, axis='y', linestyle='--', alpha=0.5)

    for bar in bars1:
        ax.annotate(f'{bar.get_height():.3f}',
                    xy=(bar.get_x() + bar.get_width() / 2, bar.get_height()),
                    xytext=(0, 3), textcoords='offset points', ha='center', fontsize=8)
    for bar in bars2:
        ax.annotate(f'{bar.get_height():.3f}',
                    xy=(bar.get_x() + bar.get_width() / 2, bar.get_height()),
                    xytext=(0, 3), textcoords='offset points', ha='center', fontsize=8)

    plt.tight_layout()
    fname = f'model_comparison_{target_name.replace(" ", "_").lower()}.png'
    plt.savefig(fname, dpi=150, bbox_inches='tight')
    plt.close()
    print(f'  Saved: {fname}')


# ── Main training function ────────────────────────────────────────────────────

def train_models():
    df = pd.read_csv("dataset.csv")

    workload_le    = LabelEncoder()
    scalability_le = LabelEncoder()
    security_le    = LabelEncoder()
    region_le      = LabelEncoder()

    df["workload_enc"]    = workload_le.fit_transform(df["workload"])
    df["scalability_enc"] = scalability_le.fit_transform(df["scalability"])
    df["security_enc"]    = security_le.fit_transform(df["security"])
    df["region_enc"]      = region_le.fit_transform(df["region"])

    feature_encoders = {
        "workload":    list(workload_le.classes_),
        "scalability": list(scalability_le.classes_),
        "security":    list(security_le.classes_),
        "region":      list(region_le.classes_),
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

    TARGET_LABELS = {
        "service_model":    "Service Model",
        "deployment_model": "Deployment Model",
        "provider":         "Cloud Provider",
    }

    for target in ["service_model", "deployment_model", "provider"]:
        label = TARGET_LABELS[target]
        print(f"\n{'='*50}")
        print(f"Training models for: {label}")
        print('='*50)

        le_target = LabelEncoder()
        y = le_target.fit_transform(df[target])

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )

        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled  = scaler.transform(X_test)

        models = {
            "Decision Tree":      (DecisionTreeClassifier(max_depth=10, min_samples_split=8, random_state=42), False),
            "Random Forest":      (RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42), False),
            "Gradient Boosting":  (GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, max_depth=5, random_state=42), False),
            "Logistic Regression":(LogisticRegression(max_iter=1000, random_state=42), True),
        }

        best_model      = None
        best_acc        = 0
        best_use_scaler = False
        model_comparison = {}

        for name, (model, use_scaled) in models.items():
            print(f"  Training {name}...")
            Xtr = X_train_scaled if use_scaled else X_train
            Xte = X_test_scaled  if use_scaled else X_test
            model.fit(Xtr, y_train)
            y_pred = model.predict(Xte)
            acc  = accuracy_score(y_test, y_pred)
            prec = precision_score(y_test, y_pred, average="weighted", zero_division=0)
            rec  = recall_score(y_test, y_pred, average="weighted", zero_division=0)
            f1   = f1_score(y_test, y_pred, average="weighted", zero_division=0)

            model_comparison[name] = {
                "accuracy":  round(float(acc),  4),
                "precision": round(float(prec), 4),
                "recall":    round(float(rec),  4),
                "f1_score":  round(float(f1),   4),
            }
            print(f"    {name}: Acc={acc:.4f}  F1={f1:.4f}")

            if acc > best_acc:
                best_acc        = acc
                best_model      = model
                best_use_scaler = use_scaled

        # ── Best model evaluation ──────────────────────────────────────────
        Xte_best   = X_test_scaled if best_use_scaler else X_test
        y_pred_best = best_model.predict(Xte_best)
        cm     = confusion_matrix(y_test, y_pred_best).tolist()
        report = classification_report(
            y_test, y_pred_best,
            target_names=le_target.classes_,
            output_dict=True,
            zero_division=0
        )

        print(f"\n  Best: {type(best_model).__name__}  |  Accuracy: {best_acc:.4f}  |  Uses scaler: {best_use_scaler}")

        # ── Generate plots ─────────────────────────────────────────────────
        print(f"\n  Generating plots for {label}...")

        # 1. Learning curve
        plot_learning_curve(
            best_model, X_train,
            le_target.transform(df.loc[X_train.index, target]),
            label,
            use_scaled=best_use_scaler,
            scaler=scaler
        )

        # 2. Confusion matrix
        plot_confusion_matrix(y_test, y_pred_best, le_target.classes_, label)

        # 3. Model comparison bar chart
        plot_model_comparison(model_comparison, label)

        results[target] = {
            "best_model":             type(best_model).__name__,
            "accuracy":               round(float(best_acc), 4),
            "confusion_matrix":       cm,
            "classification_report":  {k: v for k, v in report.items()},
            "model_comparison":       model_comparison,
            "classes":                list(le_target.classes_),
        }

        # ── Save artifacts ─────────────────────────────────────────────────
        with open(f"model_{target}.pkl", "wb") as f:
            pickle.dump(best_model, f)
        with open(f"encoder_{target}.pkl", "wb") as f:
            pickle.dump(le_target, f)
        with open(f"scaler_{target}.pkl", "wb") as f:
            pickle.dump(scaler, f)
        with open(f"use_scaler_{target}.json", "w") as f:
            json.dump({"use": best_use_scaler}, f)

    with open("encoders.pkl", "wb") as f:
        pickle.dump(feature_encoders, f)
    with open("metrics.json", "w") as f:
        json.dump(results, f, indent=2)

    print("\n" + "="*50)
    print("All models trained, plots saved, artifacts saved.")
    print("="*50)
    return results


if __name__ == "__main__":
    train_models()