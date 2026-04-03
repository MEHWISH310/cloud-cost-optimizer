import pickle
import numpy as np
import os

def load_artifacts():
    models = {}
    encoders = {}
    scalers = {}
    for target in ["service_model", "deployment_model", "provider"]:
        with open(f"model_{target}.pkl", "rb") as f:
            models[target] = pickle.load(f)
        with open(f"encoder_{target}.pkl", "rb") as f:
            encoders[target] = pickle.load(f)
        scaler_path = f"scaler_{target}.pkl"
        if os.path.exists(scaler_path):
            with open(scaler_path, "rb") as f:
                scalers[target] = pickle.load(f)
    with open("encoders.pkl", "rb") as f:
        encoders["features"] = pickle.load(f)
    return models, encoders, scalers

def encode_input(data, feature_encoders):
    fe = feature_encoders

    workload_enc = fe["workload"].index(data["workload"]) if data["workload"] in fe["workload"] else 0
    scalability_enc = fe["scalability"].index(data["scalability"]) if data["scalability"] in fe["scalability"] else 0
    security_enc = fe["security"].index(data["security"]) if data["security"] in fe["security"] else 0
    region_enc = fe["region"].index(data.get("region", "us")) if data.get("region", "us") in fe["region"] else 0

    return np.array([[
        float(data["budget"]),
        workload_enc,
        scalability_enc,
        security_enc,
        region_enc,
        float(data.get("team_size", 10)),
        float(data.get("data_volume_gb", 100)),
        float(data.get("uptime_requirement", 99.9)),
        float(data.get("compliance_required", 0)),
        float(data.get("existing_infra", 0)),
    ]])

def predict(data, models, encoders, scalers):
    X = encode_input(data, encoders["features"])

    results = {}
    for target in ["service_model", "deployment_model", "provider"]:
        Xi = scalers[target].transform(X) if target in scalers else X
        pred = models[target].predict(Xi)
        results[target] = encoders[target].inverse_transform(pred)[0]

    service = results["service_model"]
    deployment = results["deployment_model"]
    provider = results["provider"]

    reason_map = {
        ("GCP", "IaaS", "Public Cloud"): "GCP excels at ML and AI workloads with TPU access and competitive GPU pricing. IaaS gives full infrastructure control needed for custom ML pipelines.",
        ("AWS", "PaaS", "Public Cloud"): "AWS offers the most mature PaaS ecosystem. For scalable web applications, Elastic Beanstalk and ECS reduce operational overhead significantly.",
        ("Azure", "IaaS", "Private Cloud"): "Azure with private cloud deployment is the enterprise standard for high-compliance workloads. Deep integration with Active Directory and Microsoft tools is a major advantage.",
        ("AWS", "IaaS", "Hybrid Cloud"): "AWS Outposts enables a true hybrid architecture, keeping sensitive workloads on-premise while bursting to public cloud for scale.",
        ("GCP", "PaaS", "Public Cloud"): "GCP App Engine and Cloud Run provide a cost-effective PaaS environment backed by Google's global fiber network.",
        ("Azure", "SaaS", "Public Cloud"): "Azure SaaS offerings integrate natively with Microsoft 365, making it the natural choice for enterprise productivity workloads.",
        ("AWS", "SaaS", "Public Cloud"): "AWS Marketplace provides a rich SaaS ecosystem. For low-budget workloads, managed SaaS on AWS eliminates infrastructure management costs.",
        ("GCP", "IaaS", "Hybrid Cloud"): "GCP Anthos supports hybrid deployments with consistent management across on-premise and cloud, ideal for regulated industries adopting ML.",
        ("Azure", "PaaS", "Hybrid Cloud"): "Azure Arc extends PaaS capabilities to any infrastructure, providing a unified development experience across hybrid environments.",
    }

    reason = reason_map.get(
        (provider, service, deployment),
        f"Based on analysis of your budget, workload type, scalability needs, and security requirements, {provider} with {service} on {deployment} offers the optimal balance of cost efficiency, performance, and security compliance for your use case."
    )

    return {
        "provider": provider,
        "serviceModel": service,
        "deploymentModel": deployment,
        "reason": reason,
    }