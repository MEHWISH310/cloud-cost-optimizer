const https = require('https');

let awsPriceCache = null;
let lastFetchTime = null;
let isFetching = false;

function fetchAWSPrices() {
    return new Promise((resolve) => {
        const url = 'https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/current/us-east-1/index.json';
        
        const req = https.get(url, (response) => {
            let body = '';
            response.on('data', (chunk) => body += chunk);
            response.on('end', () => {
                try {
                    const data = JSON.parse(body);
                    const prices = {};
                    
                    for (const [sku, product] of Object.entries(data.products)) {
                        const attrs = product.attributes;
                        if (attrs && attrs.instanceType && attrs.tenancy === 'Shared' && attrs.operatingSystem === 'Linux') {
                            const instanceType = attrs.instanceType;
                            const vcpu = parseInt(attrs.vcpu) || 0;
                            const memory = parseFloat(attrs.memory) || vcpu * 4;
                            
                            const terms = data.terms.OnDemand;
                            if (terms && terms[sku]) {
                                const dimensions = terms[sku].priceDimensions;
                                for (const dim of Object.values(dimensions)) {
                                    if (dim.pricePerUnit && dim.pricePerUnit.USD) {
                                        prices[instanceType] = {
                                            pricePerHour: parseFloat(dim.pricePerUnit.USD),
                                            vcpu: vcpu,
                                            memory: memory
                                        };
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    
                    awsPriceCache = prices;
                    lastFetchTime = Date.now();
                    console.log(`AWS: Loaded ${Object.keys(prices).length} instance prices`);
                    resolve(prices);
                } catch (e) {
                    console.error('AWS parse error:', e.message);
                    resolve(null);
                }
            });
        });
        
        req.on('error', (e) => {
            console.error('AWS fetch error:', e.message);
            resolve(null);
        });
        req.setTimeout(15000, () => {
            req.destroy();
            resolve(null);
        });
    });
}

function getFallbackAWSPrice(cpu) {
    const basePrice = 0.096;
    const pricePerHour = basePrice * cpu;
    return {
        instanceType: `c${cpu}.large`,
        vcpu: cpu,
        memory: cpu * 4,
        pricePerHour: pricePerHour,
        monthlyPrice: pricePerHour * 730,
        source: 'Fallback'
    };
}

async function getAWSPricing(cpu, ram, region = 'us') {
    if (!awsPriceCache && !isFetching) {
        isFetching = true;
        await fetchAWSPrices();
        isFetching = false;
    }
    
    let bestMatch = null;
    let bestScore = Infinity;
    
    if (awsPriceCache) {
        for (const [instance, data] of Object.entries(awsPriceCache)) {
            if (data.vcpu === 0) continue;
            const cpuDiff = Math.abs(data.vcpu - cpu);
            const ramDiff = Math.abs((data.memory || data.vcpu * 4) - ram);
            const score = cpuDiff * 2 + ramDiff;
            if (score < bestScore) {
                bestScore = score;
                bestMatch = { instance, ...data };
            }
        }
    }
    
    let result;
    if (bestMatch && bestScore <= 4) {
        const regionMultiplier = { us: 1.0, eu: 1.05, asia: 1.12 };
        const multiplier = regionMultiplier[region] || 1.0;
        const finalPrice = bestMatch.pricePerHour * multiplier;
        result = {
            instanceType: bestMatch.instance,
            vcpu: bestMatch.vcpu,
            memory: bestMatch.memory,
            pricePerHour: finalPrice,
            monthlyPrice: finalPrice * 730,
            source: 'AWS Real-time API'
        };
    } else {
        result = getFallbackAWSPrice(cpu);
    }
    
    result.region = region;
    return result;
}

module.exports = { getAWSPricing };