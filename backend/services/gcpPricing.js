const https = require('https');

let gcpPriceCache = null;
let lastFetchTime = null;

const GCP_FALLBACK_PRICES = {
    2: { price: 0.097, type: 'n2-standard-2' },
    4: { price: 0.194, type: 'n2-standard-4' },
    8: { price: 0.388, type: 'n2-standard-8' },
    16: { price: 0.776, type: 'n2-standard-16' },
    32: { price: 1.552, type: 'n2-standard-32' },
    64: { price: 3.104, type: 'n2-standard-64' },
    96: { price: 4.656, type: 'n2-standard-96' }
};

function fetchGCPPrices() {
    return new Promise((resolve) => {
        const url = 'https://cloudbilling.googleapis.com/v1/services/6F81-5844-456A/skus?key=demo';
        
        const req = https.get(url, (response) => {
            let body = '';
            response.on('data', (chunk) => body += chunk);
            response.on('end', () => {
                try {
                    const data = JSON.parse(body);
                    const prices = {};
                    
                    for (const sku of data.skus || []) {
                        const desc = sku.description || '';
                        const match = desc.match(/(\d+)\s*vCPU/i);
                        if (match) {
                            const vcpu = parseInt(match[1]);
                            if (vcpu > 0 && sku.pricingInfo && sku.pricingInfo[0]) {
                                const pricing = sku.pricingInfo[0].pricingExpression;
                                if (pricing && pricing.tieredRates && pricing.tieredRates[0]) {
                                    const unitPrice = pricing.tieredRates[0].unitPrice;
                                    let price = 0;
                                    if (unitPrice) {
                                        price = (unitPrice.units || 0) + (unitPrice.nanos || 0) / 1000000000;
                                    }
                                    if (price > 0 && price < 10) {
                                        prices[vcpu] = { vcpu: vcpu, pricePerHour: price };
                                    }
                                }
                            }
                        }
                    }
                    
                    gcpPriceCache = prices;
                    lastFetchTime = Date.now();
                    console.log(`GCP: Loaded ${Object.keys(prices).length} machine type prices`);
                    resolve(prices);
                } catch (e) {
                    console.error('GCP parse error:', e.message);
                    resolve(null);
                }
            });
        });
        
        req.on('error', (e) => {
            console.error('GCP fetch error:', e.message);
            resolve(null);
        });
        req.setTimeout(10000, () => {
            req.destroy();
            resolve(null);
        });
    });
}

function getFallbackGCPPrice(cpu) {
    const targetCpu = Math.min(Math.max(Math.ceil(cpu), 2), 96);
    let match = GCP_FALLBACK_PRICES[targetCpu];
    if (!match) {
        const keys = Object.keys(GCP_FALLBACK_PRICES).map(Number);
        const closest = keys.reduce((prev, curr) => Math.abs(curr - targetCpu) < Math.abs(prev - targetCpu) ? curr : prev);
        match = GCP_FALLBACK_PRICES[closest];
    }
    return {
        machineType: match.type,
        vcpu: targetCpu,
        memory: targetCpu * 4,
        pricePerHour: match.price,
        monthlyPrice: match.price * 730,
        source: 'Fallback'
    };
}

async function getGCPPricing(cpu, ram, region = 'us') {
    if (!gcpPriceCache) {
        await fetchGCPPrices();
    }
    
    const targetCpu = Math.ceil(cpu);
    let bestMatch = null;
    
    if (gcpPriceCache) {
        for (const [vcpu, data] of Object.entries(gcpPriceCache)) {
            const vcpuNum = parseInt(vcpu);
            if (vcpuNum >= targetCpu && (!bestMatch || vcpuNum < bestMatch.vcpu)) {
                bestMatch = { vcpu: vcpuNum, pricePerHour: data.pricePerHour };
            }
        }
    }
    
    let result;
    if (bestMatch) {
        const regionMultiplier = { us: 1.0, eu: 1.08, asia: 1.12 };
        const multiplier = regionMultiplier[region] || 1.0;
        const finalPrice = bestMatch.pricePerHour * multiplier;
        result = {
            machineType: `n2-standard-${bestMatch.vcpu}`,
            vcpu: bestMatch.vcpu,
            memory: bestMatch.vcpu * 4,
            pricePerHour: finalPrice,
            monthlyPrice: finalPrice * 730,
            source: 'GCP Real-time API'
        };
    } else {
        result = getFallbackGCPPrice(cpu);
    }
    
    result.region = region;
    return result;
}

module.exports = { getGCPPricing };