const fs = require('fs');
const path = require('path');

const REGION_MULTIPLIERS = {
    us: 1.0,
    eu: 1.08,
    asia: 1.15
};

const BURSTABLE_PREFIXES = ['t1.', 't2.', 't3.', 't3a.', 't4g.'];

let AWS_INSTANCES = {};

function isBurstable(instanceType) {
    return BURSTABLE_PREFIXES.some(prefix => instanceType.toLowerCase().startsWith(prefix));
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const ch = line[i];

        if (ch === '"') {
            inQuotes = !inQuotes;
        } else if (ch === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += ch;
        }
    }
    result.push(current.trim()); // push last field
    return result;
}

function loadAWSInstances() {
    try {
        const csvPath = path.join(__dirname, '../data/ec2_instances.csv');
        const csvData = fs.readFileSync(csvPath, 'utf8');
        const lines = csvData.split('\n');

        let loaded = 0;
        let skipped = 0;

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const values = parseCSVLine(line);

            // Need at least 10 columns (up to On Demand price)
            if (values.length < 10) { skipped++; continue; }

            const name    = values[0];
            const apiName = values[1];

            const memoryStr   = values[5].replace(/\s*GiB\s*/gi, '').trim();

            const vcpuStr     = values[6].replace(/\s*vCPUs?\s*/gi, '').trim();
 
            const onDemandStr = values[9].replace(/\$|\s*hourly\s*/gi, '').trim();

            const reservedStr = (values[10] || '').replace(/\$|\s*hourly\s*/gi, '').trim();
         
            const spotStr     = (values[11] || '').replace(/\$|\s*hourly\s*/gi, '').trim();

            const memory   = parseFloat(memoryStr);
            const vcpu     = parseInt(vcpuStr, 10);
            const onDemand = parseFloat(onDemandStr);
            const reserved = parseFloat(reservedStr);
            const spot     = parseFloat(spotStr);

            if (!apiName || isNaN(vcpu) || isNaN(memory) || isNaN(onDemand) || onDemand <= 0) {
                skipped++;
                continue;
            }

            AWS_INSTANCES[apiName] = {
                type:          apiName,
                name:          name,
                vcpu:          vcpu,
                ram:           memory,
                pricePerHour:  onDemand,
                spotPrice:     isNaN(spot)     ? onDemand * 0.30 : spot,
                reservedPrice: isNaN(reserved) ? onDemand * 0.60 : reserved,
                burstable:     isBurstable(apiName),
            };
            loaded++;
        }

        console.log(`AWS: loaded ${loaded}, skipped ${skipped}`);

        const sample = Object.values(AWS_INSTANCES).slice(0, 3);
        sample.forEach(inst =>
            console.log(`  AWS sample: ${inst.type} | ${inst.vcpu} vCPU | ${inst.ram} GB | $${inst.pricePerHour}/hr`)
        );

    } catch (err) {
        console.error('Error loading AWS CSV:', err);
    }
}

loadAWSInstances();

function getBestInstance(cpu, requestedRam, pricingType, allowBurstable = false) {
    const eligible = [];

    for (const key in AWS_INSTANCES) {
        const inst = AWS_INSTANCES[key];

        if (!allowBurstable && inst.burstable) continue;

        if (inst.vcpu >= cpu && inst.ram >= requestedRam) {
            eligible.push(inst);
        }
    }

    if (eligible.length === 0) {
        console.warn(`AWS: No instance for ${cpu} vCPU / ${requestedRam} GB — using largest`);
        let largest = null;
        for (const key in AWS_INSTANCES) {
            const inst = AWS_INSTANCES[key];
            if (!allowBurstable && inst.burstable) continue;
            if (!largest || inst.vcpu > largest.vcpu ||
               (inst.vcpu === largest.vcpu && inst.ram > largest.ram)) {
                largest = inst;
            }
        }
        return largest;
    }

    const priceKey = pricingType === 'spot'       ? 'spotPrice'     :
                     pricingType === 'reserved'    ? 'reservedPrice' : 'pricePerHour';

    eligible.sort((a, b) => a[priceKey] - b[priceKey]);
    return eligible[0];
}

async function getAWSPricing(cpu, ram, region = 'us', pricingType = 'onDemand') {
    const instance = getBestInstance(cpu, ram, pricingType, false);

    if (!instance) {
        throw new Error('No AWS instance found for the given requirements');
    }

    const multiplier = REGION_MULTIPLIERS[region] || 1.0;

    let finalPrice;
    if (pricingType === 'spot') {
        finalPrice = instance.spotPrice * multiplier;
    } else if (pricingType === 'reserved') {
        finalPrice = instance.reservedPrice * multiplier;
    } else if (pricingType === 'savingsPlan') {
        finalPrice = instance.pricePerHour * 0.70 * multiplier;
    } else {
        finalPrice = instance.pricePerHour * multiplier;
    }

    console.log(`AWS selected: ${instance.type} (${instance.vcpu} vCPU / ${instance.ram} GB) @ $${finalPrice.toFixed(4)}/hr`);

    return {
        instanceType:  instance.type,
        vcpu:          instance.vcpu,
        memory:        instance.ram,
        pricePerHour:  Math.round(finalPrice * 10000) / 10000,
        monthlyPrice:  Math.round(finalPrice * 730 * 100) / 100,
        source:        'aws.amazon.com/ec2/pricing/on-demand/',
        region,
        pricingType,
    };
}

module.exports = { getAWSPricing, AWS_INSTANCES, REGION_MULTIPLIERS };