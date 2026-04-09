const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const historyRoutes = require("./routes/history");
const { getAWSPricing } = require("./services/awsPricing");
const { getAzurePricing } = require("./services/azurePricing");
const { getGCPPricing } = require("./services/gcpPricing");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/history", historyRoutes);

app.post("/api/pricing/calculate", async (req, res) => {
    try {
        const { cpu, ram, storage, region, pricingType = 'onDemand' } = req.body;
        
        console.log(`Calculating pricing for: ${cpu} vCPUs, ${ram} GB RAM, ${storage} GB storage, region: ${region}, pricing: ${pricingType}`);
        
        // Get pricing from all three providers
        const aws = await getAWSPricing(cpu, ram, region, pricingType);
        const azure = await getAzurePricing(cpu, ram, region, pricingType);
        const gcp = await getGCPPricing(cpu, ram, region, pricingType);
        
        const monthlyCosts = {
            aws: aws.monthlyPrice,
            azure: azure.monthlyPrice,
            gcp: gcp.monthlyPrice
        };
        
        res.json({
            inputs: { cpu, ram, storage, region, pricingType },
            monthlyCosts,
            details: {
                aws,
                azure,
                gcp
            }
        });
    } catch (error) {
        console.error('Pricing calculation error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.use("/api/pricing", require("./routes/pricing"));

app.get("/", (req, res) => {
    res.json({ message: "Cloud Cost Optimizer API is running" });
});

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));