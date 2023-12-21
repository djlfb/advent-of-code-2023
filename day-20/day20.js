const { lcm, readLines, report } = require('../util/util');

const PULSE = {
    LOW: 'LOW',
    HIGH: 'HIGH',
};

const parseModule = (line) => {
    const parts = line.replaceAll(' ', '').split('->');
    const name = parts[0].slice(1);
    const type = parts[0][0];
    const targets = parts[1].split(',');
    if (type === '%') {
        return { name, type, on: false, targets };
    } else if (type === '&') {
        return { name, type, pulseRecords: {}, targets };
    }
    return { name, type, targets };
};

const parseBroadcaster = (lines) =>
    lines
        .filter((line) => line.startsWith('broadcaster'))
        .map((line) => line.replaceAll(' ', '').split('->')[1].split(','))[0];

const parseModules = (lines) => {
    const modules = lines
        .filter((line) => !line.startsWith('broadcaster'))
        .map(parseModule)
        .reduce((acc, module) => {
            acc[module.name] = module;
            return acc;
        }, {});

    // Set all module pulse record input sources for conjunctions to a low pulse
    Object.values(modules).forEach((module) => {
        module.targets.forEach((target) => {
            if (modules[target] && modules[target].type === '&') {
                modules[target].pulseRecords[module.name] = PULSE.LOW;
            }
        });
    });

    return modules;
};

const parseLines = (lines) => [parseBroadcaster(lines), parseModules(lines)];

const broadcast = (
    broadcastTargets,
    modules,
    cycle,
    { rxConjSourceName = null, rxConjSourceHighCycles = null } = {}, // Part 2 only
) => {
    let lowCount = 0;
    let highCount = 0;
    const queue = broadcastTargets.map((target) => ({
        moduleName: target,
        pulse: PULSE.LOW,
        source: 'broadcaster',
    }));
    while (
        queue.length &&
        // For part 2, check if all rx conjunction sources have emitted a high pulse cycle so we can stop searching
        (!rxConjSourceHighCycles ||
            Object.values(rxConjSourceHighCycles).some((cycles) => cycles.length === 0))
    ) {
        const { moduleName, pulse, source } = queue.shift();
        if (pulse === PULSE.LOW) {
            lowCount++;
        } else {
            highCount++;
        }
        if (!modules[moduleName]) {
            continue;
        }
        const module = modules[moduleName];
        const { name, type, targets } = module;
        let nextPulse = null;
        if (type === '%') {
            if (pulse === PULSE.HIGH) {
                continue;
            }
            module.on = !module.on;
            nextPulse = module.on ? PULSE.HIGH : PULSE.LOW;
        } else if (type === '&') {
            module.pulseRecords[source] = pulse;
            nextPulse = Object.values(module.pulseRecords).every((record) => record === PULSE.HIGH)
                ? PULSE.LOW
                : PULSE.HIGH;
        }

        targets.forEach((target) => {
            queue.push({ moduleName: target, pulse: nextPulse, source: name });
            // For part 2, if the target is the rx's conjunction source target and it's a high pulse, record the cycle
            if (target === rxConjSourceName && nextPulse === PULSE.HIGH) {
                rxConjSourceHighCycles[name].push(cycle);
            }
        });
    }
    return [
        lowCount,
        highCount,
        // For part 2, return LCM of all cycles where a high pulse for all of rx's conjunction sources have a received a high pulse
        rxConjSourceHighCycles &&
        Object.values(rxConjSourceHighCycles).every((cycles) => cycles.length > 0)
            ? lcm(Object.values(rxConjSourceHighCycles).flat())
            : null,
    ];
};

const partOne = (broadcasterTargets, modules) => {
    let lowCount = 0;
    let highCount = 0;
    for (let cycle = 0; cycle < 1000; cycle++) {
        const [low, high] = broadcast(broadcasterTargets, modules, cycle);
        lowCount += low + 1;
        highCount += high;
    }
    return lowCount * highCount;
};

const partTwo = (broadcasterTargets, modules) => {
    const rxConjSourceName = Object.values(modules).find(({ targets }) =>
        targets.includes('rx'),
    ).name;
    const rxConjunctionTracking = {
        rxConjSourceName,
        rxConjSourceHighCycles: Object.keys(modules[rxConjSourceName].pulseRecords).reduce(
            (acc, sourceName) => ({ ...acc, [sourceName]: [] }),
            {},
        ),
    };

    let cycle = 0;
    let lcm = null;
    while (!lcm) {
        [_, _, lcm] = broadcast(broadcasterTargets, modules, ++cycle, rxConjunctionTracking);
    }
    return lcm;
};

const [broadcasterTargets, modules] = parseLines(readLines());
report(1, () => partOne(broadcasterTargets, JSON.parse(JSON.stringify(modules))), 944750144);
report(2, () => partTwo(broadcasterTargets, JSON.parse(JSON.stringify(modules))), 222718819437131);
