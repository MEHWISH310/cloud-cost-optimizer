import pandas as pd
import numpy as np

def generate_dataset(n=1500):
    np.random.seed(42)

    workloads = ["startup", "webapp", "enterprise", "ml"]
    scalability_levels = ["low", "medium", "high"]
    security_levels = ["basic", "moderate", "high"]
    regions = ["us", "eu", "asia"]

    workload_weights = [0.30, 0.35, 0.25, 0.10]
    scalability_weights = [0.25, 0.45, 0.30]
    security_weights = [0.35, 0.40, 0.25]

    records = []

    for _ in range(n):
        workload = np.random.choice(workloads, p=workload_weights)
        scalability = np.random.choice(scalability_levels, p=scalability_weights)
        security = np.random.choice(security_levels, p=security_weights)
        region = np.random.choice(regions)

        if workload == "startup":
            budget = np.random.lognormal(mean=5.5, sigma=0.8)
        elif workload == "webapp":
            budget = np.random.lognormal(mean=6.2, sigma=0.9)
        elif workload == "enterprise":
            budget = np.random.lognormal(mean=8.0, sigma=1.0)
        else:
            budget = np.random.lognormal(mean=7.5, sigma=1.1)

        budget = round(np.clip(budget, 50, 100000), 2)

        team_size = np.random.randint(1, 500)
        data_volume_gb = round(np.random.lognormal(mean=4.0, sigma=1.5), 2)
        uptime_requirement = round(np.random.uniform(95.0, 99.99), 2)
        compliance_required = 1 if security == "high" or (security == "moderate" and np.random.rand() > 0.6) else 0
        existing_infra = np.random.choice([0, 1], p=[0.6, 0.4])

        score_iaas = 0
        score_paas = 0
        score_saas = 0

        if workload == "ml":
            score_iaas += 3
        if workload == "enterprise":
            score_iaas += 1
            score_saas += 1
        if workload in ["startup", "webapp"]:
            score_paas += 3
        if security == "high":
            score_iaas += 2
        if security == "basic":
            score_paas += 1
            score_saas += 2
        if budget > 10000:
            score_iaas += 1
        if budget < 500:
            score_saas += 2
            score_paas += 1
        if team_size < 10:
            score_saas += 2
            score_paas += 1
        if team_size > 100:
            score_iaas += 1
        if compliance_required:
            score_iaas += 2
        if existing_infra:
            score_iaas += 1

        noise = np.random.normal(0, 0.5, 3)
        scores = np.array([score_iaas, score_paas, score_saas]) + noise
        service_model = ["IaaS", "PaaS", "SaaS"][np.argmax(scores)]

        score_public = 0
        score_private = 0
        score_hybrid = 0

        if security == "high":
            score_private += 3
            score_hybrid += 2
        if security == "basic":
            score_public += 3
        if scalability == "high":
            score_public += 2
            score_hybrid += 1
        if scalability == "low":
            score_private += 1
        if budget < 1000:
            score_public += 2
        if budget > 20000:
            score_private += 1
            score_hybrid += 1
        if compliance_required:
            score_private += 2
            score_hybrid += 1
        if existing_infra:
            score_hybrid += 2
        if workload == "startup":
            score_public += 2
        if workload == "enterprise":
            score_hybrid += 1
            score_private += 1

        noise = np.random.normal(0, 0.5, 3)
        scores = np.array([score_public, score_private, score_hybrid]) + noise
        deployment_model = ["Public Cloud", "Private Cloud", "Hybrid Cloud"][np.argmax(scores)]

        score_aws = 0
        score_azure = 0
        score_gcp = 0

        if workload == "ml":
            score_gcp += 3
        if workload == "enterprise":
            score_azure += 2
            score_aws += 1
        if workload in ["startup", "webapp"]:
            score_aws += 2
            score_gcp += 1
        if region == "eu":
            score_azure += 1
        if region == "asia":
            score_gcp += 1
        if budget > 20000:
            score_aws += 1
            score_azure += 1
        if budget < 500:
            score_gcp += 1
        if security == "high" and workload == "enterprise":
            score_azure += 2
        if data_volume_gb > 1000:
            score_aws += 1
            score_gcp += 1
        if existing_infra and workload == "enterprise":
            score_azure += 1

        noise = np.random.normal(0, 0.5, 3)
        scores = np.array([score_aws, score_azure, score_gcp]) + noise
        provider = ["AWS", "Azure", "GCP"][np.argmax(scores)]

        records.append({
            "budget": budget,
            "workload": workload,
            "scalability": scalability,
            "security": security,
            "region": region,
            "team_size": team_size,
            "data_volume_gb": data_volume_gb,
            "uptime_requirement": uptime_requirement,
            "compliance_required": compliance_required,
            "existing_infra": existing_infra,
            "service_model": service_model,
            "deployment_model": deployment_model,
            "provider": provider,
        })

    df = pd.DataFrame(records)
    df.to_csv("dataset.csv", index=False)
    print(f"Dataset generated: {len(df)} records")
    print("\nService Model distribution:")
    print(df["service_model"].value_counts())
    print("\nDeployment Model distribution:")
    print(df["deployment_model"].value_counts())
    print("\nProvider distribution:")
    print(df["provider"].value_counts())
    return df

if __name__ == "__main__":
    generate_dataset()