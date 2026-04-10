const fs = require('fs');
const path = require('path');

const REGION_MULTIPLIERS = {
    us: 1.0,
    eu: 1.08,
    asia: 1.13
};

const BURSTABLE_TYPES = ['e2-micro', 'e2-small', 'e2-medium'];
const BURSTABLE_PREFIXES = ['f1-', 'g1-'];  

let GCP_INSTANCES = {};

function isBurstable(instanceType) {
    const lower = instanceType.toLowerCase();
    if (BURSTABLE_TYPES.includes(lower)) return true;
    return BURSTABLE_PREFIXES.some(prefix => lower.startsWith(prefix));
}

function loadGCPInstances() {
    try {
        const csvPath = path.join(__dirname, '../data/gcp_instances.csv');
        const csvData = fs.readFileSync(csvPath, 'utf8');
        const lines = csvData.split('\n');

        let loaded = 0;
        let skipped = 0;

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const values = line.split(',');
            if (values.length < 5) { skipped++; continue; }

            const name    = values[0].trim();
            const apiName = values[1].trim();

            const memoryStr   = values[2].replace(/\s*GiB\s*/gi, '').trim();
            const vcpuStr     = values[3].replace(/\s*vCPUs?\s*/gi, '').trim();

            const onDemandRaw = values[4].trim();
            const onDemandStr = onDemandRaw.replace(/\$|\s*hourly\s*/gi, '').trim();

            const spotRaw     = (values[5] || '').trim();
            const spotStr     = spotRaw.replace(/\$|\s*hourly\s*/gi, '').trim();

            const memory   = parseFloat(memoryStr);
            const vcpu     = parseInt(vcpuStr, 10);
            const onDemand = parseFloat(onDemandStr);
            const spot     = parseFloat(spotStr);

            if (!apiName || isNaN(vcpu) || isNaN(memory) || isNaN(onDemand) || onDemand <= 0) {
                skipped++;
                continue;
            }

            const committedPrice = onDemand * 0.70; 

            GCP_INSTANCES[apiName] = {
                type:            apiName,
                name:            name,
                vcpu:            vcpu,
                ram:             memory,
                pricePerHour:    onDemand,
                spotPrice:       isNaN(spot) ? onDemand * 0.4 : spot,
                committedPrice:  committedPrice,
                burstable:       isBurstable(apiName),
            };
            loaded++;
        }

        console.log(`GCP: loaded ${loaded}, skipped ${skipped} (total lines: ${lines.length - 1})`);
    } catch (err) {
        console.error('Error loading GCP CSV:', err);
    }
}

loadGCPInstances();

function getBestInstance(cpu, requestedRam, pricingType, allowBurstable = false) {
    const eligible = [];

    for (const key in GCP_INSTANCES) {
        const inst = GCP_INSTANCES[key];

        if (!allowBurstable && inst.burstable) continue;

        if (inst.vcpu >= cpu && inst.ram >= requestedRam) {
            eligible.push(inst);
        }
    }

    if (eligible.length === 0) {
        console.warn(`GCP: No eligible instance found for ${cpu} vCPUs / ${requestedRam} GB RAM — using largest`);
        let largest = null;
        for (const key in GCP_INSTANCES) {
            const inst = GCP_INSTANCES[key];
            if (!allowBurstable && inst.burstable) continue;
            if (!largest || inst.vcpu > largest.vcpu || (inst.vcpu === largest.vcpu && inst.ram > largest.ram)) {
                largest = inst;
            }
        }
        return largest;
    }

    const priceKey = pricingType === 'spot'                        ? 'spotPrice'      :
                     pricingType === 'reserved' ||
                     pricingType === 'savingsPlan'                  ? 'committedPrice' : 'pricePerHour';

    eligible.sort((a, b) => a[priceKey] - b[priceKey]);
    return eligible[0];
}

async function getGCPPricing(cpu, ram, region = 'us', pricingType = 'onDemand') {
    const instance = getBestInstance(cpu, ram, pricingType, false);

    if (!instance) {
        throw new Error('No GCP instance found for the given requirements');
    }

    const multiplier = REGION_MULTIPLIERS[region] || 1.0;

    let finalPrice;
    if (pricingType === 'spot') {
        finalPrice = instance.spotPrice * multiplier;
    } else if (pricingType === 'reserved' || pricingType === 'savingsPlan') {
        finalPrice = instance.committedPrice * multiplier;
    } else {
        finalPrice = instance.pricePerHour * multiplier;
    }

    console.log(`GCP selected: ${instance.type} (${instance.vcpu} vCPU / ${instance.ram} GB) @ $${finalPrice.toFixed(4)}/hr`);

    return {
        machineType:  instance.type,
        vcpu:         instance.vcpu,
        memory:       instance.ram,
        pricePerHour: Math.round(finalPrice * 10000) / 10000,
        monthlyPrice: Math.round(finalPrice * 730 * 100) / 100,
        source:       'cloud.google.com/compute/vm-instance-pricing',
        region,
        pricingType,
    };
}

module.exports = { getGCPPricing, GCP_INSTANCES, REGION_MULTIPLIERS };