const REGION_MULTIPLIERS = {
    us: 1.0,
    eu: 1.08,
    asia: 1.15
};

const AWS_INSTANCES = {
    2:  { type: 't3.large',    vcpu: 2,  ram: 8,   pricePerHour: 0.0832 },
    4:  { type: 'm5.xlarge',   vcpu: 4,  ram: 16,  pricePerHour: 0.192  },
    8:  { type: 'm5.2xlarge',  vcpu: 8,  ram: 32,  pricePerHour: 0.384  },
    16: { type: 'm5.4xlarge',  vcpu: 16, ram: 64,  pricePerHour: 0.768  },
    32: { type: 'm5.8xlarge',  vcpu: 32, ram: 128, pricePerHour: 1.536  },
    64: { type: 'm5.16xlarge', vcpu: 64, ram: 256, pricePerHour: 3.072  },
};

function getBestInstance(cpu) {
    const keys = Object.keys(AWS_INSTANCES).map(Number).sort((a, b) => a - b);
    const match = keys.find(k => k >= cpu) || keys[keys.length - 1];
    return AWS_INSTANCES[match];
}

async function getAWSPricing(cpu, ram, region = 'us') {
    const instance = getBestInstance(cpu);
    const multiplier = REGION_MULTIPLIERS[region] || 1.0;
    const finalPrice = instance.pricePerHour * multiplier;

    return {
        instanceType: instance.type,
        vcpu: instance.vcpu,
        memory: instance.ram,
        pricePerHour: Math.round(finalPrice * 10000) / 10000,
        monthlyPrice: Math.round(finalPrice * 730 * 100) / 100,
        source: 'aws.amazon.com/ec2/pricing',
        region
    };
}

module.exports = { getAWSPricing };