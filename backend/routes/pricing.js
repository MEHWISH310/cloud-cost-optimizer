const express = require('express');
const router = express.Router();
const { getAWSPricing } = require('../services/awsPricing');
const { getAzurePricing } = require('../services/azurePricing');
const { getGCPPricing } = require('../services/gcpPricing');

const TIMEOUT_MS = 5000;

function withTimeout(promise, timeoutMs, fallback) {
    return Promise.race([
        promise,
        new Promise((resolve) => setTimeout(() => resolve(fallback), timeoutMs))
    ]);
}

const FALLBACK_PRICES = {
    aws: { monthlyPrice: 70.08, pricePerHour: 0.096, instanceType: 't3.medium', source: 'Fallback (fast mode)' },
    azure: { monthlyPrice: 73.00, pricePerHour: 0.10, skuName: 'D4s v3', source: 'Fallback (fast mode)' },
    gcp: { monthlyPrice: 69.35, pricePerHour: 0.095, machineType: 'n2-standard-4', source: 'Fallback (fast mode)' }
};

router.post('/calculate', async (req, res) => {
    const startTime = Date.now();
    
    try {
        const { cpu, ram, storage, region = 'us', hoursPerMonth = 730 } = req.body;
        
        const vcpus = parseFloat(cpu) || 2;
        const ramGb = parseFloat(ram) || 8;
        const storageGb = parseFloat(storage) || 100;
        
        const storageCostPerGb = { aws: 0.10, azure: 0.09, gcp: 0.085 };
        
        const [awsData, azureData, gcpData] = await Promise.all([
            withTimeout(getAWSPricing(vcpus, ramGb, region), TIMEOUT_MS, FALLBACK_PRICES.aws),
            withTimeout(getAzurePricing(vcpus, ramGb, region), TIMEOUT_MS, FALLBACK_PRICES.azure),
            withTimeout(getGCPPricing(vcpus, ramGb, region), TIMEOUT_MS, FALLBACK_PRICES.gcp)
        ]);
        
        const awsMonthly = awsData.monthlyPrice + (storageGb * storageCostPerGb.aws);
        const azureMonthly = azureData.monthlyPrice + (storageGb * storageCostPerGb.azure);
        const gcpMonthly = gcpData.monthlyPrice + (storageGb * storageCostPerGb.gcp);
        
        const costs = {
            aws: Math.round(awsMonthly * 100) / 100,
            azure: Math.round(azureMonthly * 100) / 100,
            gcp: Math.round(gcpMonthly * 100) / 100
        };
        
        const cheapest = Object.entries(costs).sort((a, b) => a[1] - b[1])[0][0];
        
        res.json({
            inputs: { cpu: vcpus, ram: ramGb, storage: storageGb, region, hoursPerMonth },
            monthlyCosts: costs,
            yearlyCosts: {
                aws: Math.round(costs.aws * 12 * 100) / 100,
                azure: Math.round(costs.azure * 12 * 100) / 100,
                gcp: Math.round(costs.gcp * 12 * 100) / 100
            },
            cheapestProvider: cheapest,
            currency: 'USD',
            responseTime: `${Date.now() - startTime}ms`,
            details: {
                aws: { instanceType: awsData.instanceType || 't3.medium', pricePerHour: awsData.pricePerHour, source: awsData.source },
                azure: { skuName: azureData.skuName || 'D4s v3', pricePerHour: azureData.pricePerHour, source: azureData.source },
                gcp: { machineType: gcpData.machineType || 'n2-standard-4', pricePerHour: gcpData.pricePerHour, source: gcpData.source }
            }
        });
        
    } catch (error) {
        console.error('Pricing error:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/compare', async (req, res) => {
    try {
        const { vmType = 'medium', region = 'us' } = req.body;
        
        const vmConfigs = {
            small: { cpu: 2, ram: 8, storage: 100 },
            medium: { cpu: 4, ram: 16, storage: 250 },
            large: { cpu: 8, ram: 32, storage: 500 },
            xlarge: { cpu: 16, ram: 64, storage: 1000 }
        };
        
        const results = {};
        
        for (const [size, specs] of Object.entries(vmConfigs)) {
            const storageCostPerGb = { aws: 0.10, azure: 0.09, gcp: 0.085 };
            
            const awsPrice = FALLBACK_PRICES.aws.monthlyPrice + (specs.storage * storageCostPerGb.aws);
            const azurePrice = FALLBACK_PRICES.azure.monthlyPrice + (specs.storage * storageCostPerGb.azure);
            const gcpPrice = FALLBACK_PRICES.gcp.monthlyPrice + (specs.storage * storageCostPerGb.gcp);
            
            results[size] = {
                aws: Math.round(awsPrice * 100) / 100,
                azure: Math.round(azurePrice * 100) / 100,
                gcp: Math.round(gcpPrice * 100) / 100
            };
        }
        
        res.json({
            region,
            vmConfigs,
            monthlyCosts: results,
            recommendation: 'Compare prices across all providers to find the best value for your workload.'
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'pricing-api', timestamp: new Date().toISOString() });
});

module.exports = router;