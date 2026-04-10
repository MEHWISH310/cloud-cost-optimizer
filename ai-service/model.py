import pickle
import numpy as np
import os
import json


def load_artifacts():
    models = {}
    encoders = {}
    scalers = {}
    use_scalers = {}

    for target in ["service_model", "deployment_model", "provider"]:
        with open(f"model_{target}.pkl", "rb") as f:
            models[target] = pickle.load(f)
        with open(f"encoder_{target}.pkl", "rb") as f:
            encoders[target] = pickle.load(f)
        # KEY FIX: always load scaler + the flag
        with open(f"scaler_{target}.pkl", "rb") as f:
            scalers[target] = pickle.load(f)
        with open(f"use_scaler_{target}.json", "r") as f:
            use_scalers[target] = json.load(f)["use"]

    with open("encoders.pkl", "rb") as f:
        encoders["features"] = pickle.load(f)

    return models, encoders, scalers, use_scalers


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
        float(data.get("uses_microsoft_stack", 0)),
        float(data.get("uses_google_workspace", 0)),
        1.0 if data["workload"] == "ml" else 0.0,
        float(data.get("multi_region", 0)),
        float(data.get("serverless_preference", 0)),
    ]])


def build_reason(data, provider, service, deployment):
    reasons = []

    workload_map = {
        "ml": "your ML/AI workload requires high-performance compute with GPU/TPU support",
        "enterprise": "your enterprise workload demands robust SLAs and enterprise-grade support",
        "startup": "your startup workload benefits from pay-as-you-go pricing with minimal upfront cost",
        "webapp": "your web application workload needs reliable hosting with auto-scaling capabilities",
    }
    if data.get("workload") in workload_map:
        reasons.append(workload_map[data["workload"]])

    if data.get("uses_microsoft_stack"):
        reasons.append("your use of Microsoft stack (Windows, .NET, Active Directory) integrates natively with Azure services")
    if data.get("uses_google_workspace"):
        reasons.append("your use of Google Workspace provides seamless integration with GCP services and APIs")

    security_map = {
        "high": "your high security requirement demands dedicated infrastructure with strict access controls",
        "moderate": "your moderate security needs are met with standard cloud security controls and compliance tools",
        "basic": "your basic security needs are efficiently covered by standard public cloud security features",
    }
    if data.get("security") in security_map:
        reasons.append(security_map[data["security"]])

    if data.get("compliance_required"):
        reasons.append("your compliance requirements (GDPR, HIPAA) necessitate data residency controls and audit logging")

    if data.get("existing_infra"):
        reasons.append("your existing on-premise infrastructure is best extended through a hybrid deployment rather than full migration")

    scalability_map = {
        "high": "your high scalability needs require elastic infrastructure that can scale instantly with demand",
        "medium": "your medium scalability needs are well served by managed services with configurable auto-scaling",
        "low": "your low scalability needs allow for fixed-size reserved instances which reduces cost significantly",
    }
    if data.get("scalability") in scalability_map:
        reasons.append(scalability_map[data["scalability"]])

    region_map = {
        "eu": "your European region preference aligns with Azure's extensive EU data center presence and GDPR compliance infrastructure",
        "asia": "your Asia Pacific region preference is best served by GCP's strong network presence in the region",
        "us": "your US region preference benefits from all three providers' strongest infrastructure presence",
    }
    if data.get("region") in region_map:
        reasons.append(region_map[data["region"]])

    budget = float(data.get("budget", 0))
    if budget < 500:
        reasons.append(f"your budget of ${budget:.0f}/month is best optimized through cost-efficient public cloud pricing with no upfront commitment")
    elif budget > 20000:
        reasons.append(f"your budget of ${budget:.0f}/month supports enterprise-tier reserved instances and dedicated support plans")
    else:
        reasons.append(f"your budget of ${budget:.0f}/month fits well within standard on-demand pricing for the recommended configuration")

    team_size = int(data.get("team_size", 10))
    if team_size < 10:
        reasons.append(f"your small team of {team_size} people benefits from managed services that reduce operational overhead")
    elif team_size > 100:
        reasons.append(f"your large team of {team_size} people justifies the investment in enterprise agreements and volume discounts")

    if data.get("multi_region"):
        reasons.append("your multi-region deployment requirement is supported by the provider's global infrastructure")

    if data.get("serverless_preference"):
        reasons.append("your preference for serverless architecture reduces infrastructure management and scales automatically to zero")

    provider_summary = {
        "AWS": "AWS provides the broadest service catalog, strongest ecosystem, and most mature tooling",
        "Azure": "Azure offers the deepest enterprise integration, especially for Microsoft-centric organizations",
        "GCP": "GCP leads in ML/AI capabilities, data analytics, and offers highly competitive pricing",
    }

    service_summary = {
        "IaaS": "IaaS gives you full control over the infrastructure stack, ideal for custom and complex workloads",
        "PaaS": "PaaS abstracts infrastructure management so your team can focus entirely on application development",
        "SaaS": "SaaS eliminates all infrastructure responsibility, providing ready-to-use software on a subscription basis",
    }

    deployment_summary = {
        "Public Cloud": "Public Cloud deployment offers maximum scalability and cost efficiency with no capital expenditure",
        "Private Cloud": "Private Cloud deployment provides dedicated resources with the highest level of security and control",
        "Hybrid Cloud": "Hybrid Cloud deployment gives you the flexibility to run sensitive workloads privately while using public cloud for scalable operations",
    }

    intro = f"{provider_summary[provider]}. {service_summary[service]}. {deployment_summary[deployment]}."
    details = " Additionally, " + ", and ".join(reasons) + "." if reasons else ""

    return intro + details


def predict(data, models, encoders, scalers, use_scalers):
    X = encode_input(data, encoders["features"])

    results = {}
    for target in ["service_model", "deployment_model", "provider"]:
        Xi = scalers[target].transform(X) if use_scalers[target] else X
        pred = models[target].predict(Xi)
        results[target] = encoders[target].inverse_transform(pred)[0]

    service = results["service_model"]
    deployment = results["deployment_model"]
    provider = results["provider"]

    reason = build_reason(data, provider, service, deployment)

    return {
        "provider": provider,
        "serviceModel": service,
        "deploymentModel": deployment,
        "reason": reason,
    }