const https = require('https');

let azurePriceCache = null;
let lastFetchTime = null;

function fetchAzurePrices() {
    return new Promise((resolve) => {
        const url = 'https://prices.azure.com/api/retail/prices?$filter=serviceName eq \'Virtual Machines\' and priceType eq \'Consumption\'&$top=500';
        
        const req = https.get(url, (response) => {
            let body = '';
            response.on('data', (chunk) => body += chunk);
            response.on('end', () => {
                try {
                    const data = JSON.parse(body);
                    const prices = {};
                    
                    for (const item of data.Items || []) {
                        const sku = item.skuName;
                        let vcpu = 0;
                        const match = sku.match(/D(\d+)/i) || sku.match(/F(\d+)/i) || sku.match(/E(\d+)/i);
                        if (match) vcpu = parseInt(match[1]);
                        
                        if (vcpu > 0 && item.unitPrice > 0 && item.unitPrice < 10) {
                            const key = `${sku}_${item.armRegionName || item.location}`;
                            if (!prices[key] || prices[key].price > item.unitPrice) {
                                prices[key] = {
                                    sku: sku,
                                    vcpu: vcpu,
                                    pricePerHour: item.unitPrice,
                                    region: item.armRegionName || item.location
                                };
                            }
                        }
                    }
                    
                    azurePriceCache = prices;
                    lastFetchTime = Date.now();
                    console.log(`Azure: Loaded ${Object.keys(prices).length} SKU prices`);
                    resolve(prices);
                } catch (e) {
                    console.error('Azure parse error:', e.message);
                    resolve(null);
                }
            });
        });
        
        req.on('error', (e) => {
            console.error('Azure fetch error:', e.message);
            resolve(null);
        });
        req.setTimeout(10000, () => {
            req.destroy();
            resolve(null);
        });
    });
}

function getFallbackAzurePrice(cpu) {
    const basePrice = 0.10;
    const pricePerHour = basePrice * cpu;
    return {
        skuName: `D${cpu}s_v3`,
        vcpu: cpu,
        memory: cpu * 4,
        pricePerHour: pricePerHour,
        monthlyPrice: pricePerHour * 730,
        source: 'Fallback'
    };
}

async function getAzurePricing(cpu, ram, region = 'us') {
    if (!azurePriceCache) {
        await fetchAzurePrices();
    }
    
    let bestMatch = null;
    let bestScore = Infinity;
    
    if (azurePriceCache) {
        for (const [key, data] of Object.entries(azurePriceCache)) {
            const cpuDiff = Math.abs(data.vcpu - cpu);
            if (cpuDiff <= 2 && cpuDiff < bestScore) {
                bestScore = cpuDiff;
                bestMatch = data;
            }
        }
    }
    
    let result;
    if (bestMatch) {
        const regionMultiplier = { us: 1.0, eu: 1.07, asia: 1.15 };
        const multiplier = regionMultiplier[region] || 1.0;
        const finalPrice = bestMatch.pricePerHour * multiplier;
        result = {
            skuName: bestMatch.sku,
            vcpu: bestMatch.vcpu,
            memory: bestMatch.vcpu * 4,
            pricePerHour: finalPrice,
            monthlyPrice: finalPrice * 730,
            source: 'Azure Real-time API'
        };
    } else {
        result = getFallbackAzurePrice(cpu);
    }
    
    result.region = region;
    return result;
}

module.exports = { getAzurePricing };