const REGION_MULTIPLIERS = {
    us: 1.0,
    eu: 1.07,
    asia: 1.14
};

const AZURE_INSTANCES = {
    2:  { type: 'D2s_v3',  vcpu: 2,  ram: 8,   pricePerHour: 0.096  },
    4:  { type: 'D4s_v3',  vcpu: 4,  ram: 16,  pricePerHour: 0.192  },
    8:  { type: 'D8s_v3',  vcpu: 8,  ram: 32,  pricePerHour: 0.384  },
    16: { type: 'D16s_v3', vcpu: 16, ram: 64,  pricePerHour: 0.768  },
    32: { type: 'D32s_v3', vcpu: 32, ram: 128, pricePerHour: 1.536  },
    64: { type: 'D64s_v3', vcpu: 64, ram: 256, pricePerHour: 3.072  },
};

function getBestInstance(cpu) {
    const keys = Object.keys(AZURE_INSTANCES).map(Number).sort((a, b) => a - b);
    const match = keys.find(k => k >= cpu) || keys[keys.length - 1];
    return AZURE_INSTANCES[match];
}

async function getAzurePricing(cpu, ram, region = 'us') {
    const instance = getBestInstance(cpu);
    const multiplier = REGION_MULTIPLIERS[region] || 1.0;
    const finalPrice = instance.pricePerHour * multiplier;

    return {
        skuName: instance.type,
        vcpu: instance.vcpu,
        memory: instance.ram,
        pricePerHour: Math.round(finalPrice * 10000) / 10000,
        monthlyPrice: Math.round(finalPrice * 730 * 100) / 100,
        source: 'azure.microsoft.com/en-us/pricing/details/virtual-machines',
        region
    };
}

module.exports = { getAzurePricing };