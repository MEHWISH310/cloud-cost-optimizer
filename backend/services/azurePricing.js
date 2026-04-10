const fs = require('fs');
const path = require('path');

const REGION_MULTIPLIERS = {
    us: 1.0,
    eu: 1.08,
    asia: 1.15
};

const BURSTABLE_PREFIXES = ['b1', 'b2', 'b4', 'b8', 'b12', 'b16', 'b20', 'b32'];

let AZURE_INSTANCES = {};

function isBurstable(instanceType) {
    const lower = instanceType.toLowerCase();
    return BURSTABLE_PREFIXES.some(prefix => lower.startsWith(prefix));
}

function loadAzureInstances() {
    try {
        const csvPath = path.join(__dirname, '../data/azure_instances.csv');
        const csvData = fs.readFileSync(csvPath, 'utf8');
        const lines = csvData.split('\n');

        let loaded = 0;
        let skipped = 0;

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const values = line.split(',');
            if (values.length < 6) { skipped++; continue; }

            const name    = values[0].trim();
            const apiName = values[1].trim();

            const memoryStr    = values[2].replace(/\s*GiB\s*/gi, '').trim();
            const vcpuStr      = values[3].replace(/\s*vCPUs?\s*/gi, '').trim();

            const onDemandRaw  = values[5].trim();
            const onDemandStr  = onDemandRaw.replace(/\$|\s*hourly\s*/gi, '').trim();

            const reservedRaw  = (values[7] || '').trim();
            const reservedStr  = reservedRaw.replace(/\$|\s*hourly\s*/gi, '').trim();

            const spotRaw      = (values[8] || '').trim();
            const spotStr      = spotRaw.replace(/\$|\s*hourly\s*/gi, '').trim();

            const savingsRaw   = (values[6] || '').trim();
            const savingsStr   = savingsRaw.replace(/\$|\s*hourly\s*/gi, '').trim();

            const memory   = parseFloat(memoryStr);
            const vcpu     = parseInt(vcpuStr, 10);
            const onDemand = parseFloat(onDemandStr);
            const reserved = parseFloat(reservedStr);
            const spot     = parseFloat(spotStr);
            const savings  = parseFloat(savingsStr);

            if (!apiName || isNaN(vcpu) || isNaN(memory) || isNaN(onDemand) || onDemand <= 0) {
                skipped++;
                continue;
            }

            AZURE_INSTANCES[apiName] = {
                type:          apiName,
                name:          name,
                vcpu:          vcpu,
                ram:           memory,
                pricePerHour:  onDemand,
                spotPrice:     isNaN(spot)     ? onDemand * 0.35 : spot,
                reservedPrice: isNaN(reserved) ? onDemand * 0.55 : reserved,
                savingsPrice:  isNaN(savings)  ? onDemand * 0.60 : savings,
                burstable:     isBurstable(apiName),
            };
            loaded++;
        }

        console.log(`Azure: loaded ${loaded}, skipped ${skipped} (total lines: ${lines.length - 1})`);
    } catch (err) {
        console.error('Error loading Azure CSV:', err);
    }
}

loadAzureInstances();

function getBestInstance(cpu, requestedRam, pricingType, allowBurstable = false) {
    const eligible = [];

    for (const key in AZURE_INSTANCES) {
        const inst = AZURE_INSTANCES[key];

        if (!allowBurstable && inst.burstable) continue;

        if (inst.vcpu >= cpu && inst.ram >= requestedRam) {
            eligible.push(inst);
        }
    }

    if (eligible.length === 0) {
        console.warn(`Azure: No eligible instance found for ${cpu} vCPUs / ${requestedRam} GB RAM — using largest`);
        let largest = null;
        for (const key in AZURE_INSTANCES) {
            const inst = AZURE_INSTANCES[key];
            if (!allowBurstable && inst.burstable) continue;
            if (!largest || inst.vcpu > largest.vcpu || (inst.vcpu === largest.vcpu && inst.ram > largest.ram)) {
                largest = inst;
            }
        }
        return largest;
    }

    const priceKey = pricingType === 'spot'        ? 'spotPrice'     :
                     pricingType === 'reserved'     ? 'reservedPrice' :
                     pricingType === 'savingsPlan'  ? 'savingsPrice'  : 'pricePerHour';

    eligible.sort((a, b) => a[priceKey] - b[priceKey]);
    return eligible[0];
}

async function getAzurePricing(cpu, ram, region = 'us', pricingType = 'onDemand') {
    const instance = getBestInstance(cpu, ram, pricingType, false);

    if (!instance) {
        throw new Error('No Azure instance found for the given requirements');
    }

    const multiplier = REGION_MULTIPLIERS[region] || 1.0;

    let finalPrice;
    if (pricingType === 'spot') {
        finalPrice = instance.spotPrice * multiplier;
    } else if (pricingType === 'reserved') {
        finalPrice = instance.reservedPrice * multiplier;
    } else if (pricingType === 'savingsPlan') {
        finalPrice = instance.savingsPrice * multiplier;
    } else {
        finalPrice = instance.pricePerHour * multiplier;
    }

    console.log(`Azure selected: ${instance.type} (${instance.vcpu} vCPU / ${instance.ram} GB) @ $${finalPrice.toFixed(4)}/hr`);

    return {
        skuName:      instance.type,
        vcpu:         instance.vcpu,
        memory:       instance.ram,
        pricePerHour: Math.round(finalPrice * 10000) / 10000,
        monthlyPrice: Math.round(finalPrice * 730 * 100) / 100,
        source:       'azure.microsoft.com/en-us/pricing/details/virtual-machines/linux/',
        region,
        pricingType,
    };
}

module.exports = { getAzurePricing, AZURE_INSTANCES, REGION_MULTIPLIERS };