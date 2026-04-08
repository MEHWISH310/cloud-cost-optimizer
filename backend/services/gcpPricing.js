const REGION_MULTIPLIERS = {
    us: 1.0,
    eu: 1.08,
    asia: 1.13
};

const GCP_INSTANCES = {
    2:  { type: 'n2-standard-2',  vcpu: 2,  ram: 8,   pricePerHour: 0.0971 },
    4:  { type: 'n2-standard-4',  vcpu: 4,  ram: 16,  pricePerHour: 0.1942 },
    8:  { type: 'n2-standard-8',  vcpu: 8,  ram: 32,  pricePerHour: 0.3885 },
    16: { type: 'n2-standard-16', vcpu: 16, ram: 64,  pricePerHour: 0.7769 },
    32: { type: 'n2-standard-32', vcpu: 32, ram: 128, pricePerHour: 1.5539 },
    64: { type: 'n2-standard-64', vcpu: 64, ram: 256, pricePerHour: 3.1078 },
};

function getBestInstance(cpu) {
    const keys = Object.keys(GCP_INSTANCES).map(Number).sort((a, b) => a - b);
    const match = keys.find(k => k >= cpu) || keys[keys.length - 1];
    return GCP_INSTANCES[match];
}

async function getGCPPricing(cpu, ram, region = 'us') {
    const instance = getBestInstance(cpu);
    const multiplier = REGION_MULTIPLIERS[region] || 1.0;
    const finalPrice = instance.pricePerHour * multiplier;

    return {
        machineType: instance.type,
        vcpu: instance.vcpu,
        memory: instance.ram,
        pricePerHour: Math.round(finalPrice * 10000) / 10000,
        monthlyPrice: Math.round(finalPrice * 730 * 100) / 100,
        source: 'cloud.google.com/compute/vm-instance-pricing',
        region
    };
}

module.exports = { getGCPPricing };