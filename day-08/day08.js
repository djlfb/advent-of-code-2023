const { lcm, report, readLines } = require('../util/util');

const mapping = (line) => {
    const [key, L, R] = line
        .replace('(', '')
        .replace(')', '')
        .replace(' = ', ' ')
        .replace(',', '')
        .split(' ');
    return { key, L, R };
};

const parseInput = (lines) => ({
    steps: lines[0].split('').map((dir, key) => ({ dir, key })),
    mappings: lines
        .splice(1)
        .map(mapping)
        .reduce((acc, mapping) => {
            acc[mapping.key] = mapping;
            return acc;
        }, {}),
});

const candidateStepsTaken = (startNode, data) => {
    const steps = [...data.steps];
    const results = [];
    const visited = {};
    let current = startNode;
    let stepsTaken = 0;
    let step = steps.shift();
    while (!(visited[current.key] ?? []).includes(step.key)) {
        visited[current.key] = (visited[current.key] ?? []).concat(step.key);
        stepsTaken++;
        steps.push(step);
        current = data.mappings[current[step.dir]];
        if (current.key.endsWith('Z')) {
            results.push(stepsTaken);
        }
        step = steps.shift();
    }
    return results;
};

const partOne = (data) => {
    const steps = [...data.steps];
    let current = data.mappings['AAA'];
    let stepsTaken = 0;
    let step = steps.shift();
    while (current.key !== 'ZZZ') {
        stepsTaken++;
        steps.push(step);
        current = data.mappings[current[step.dir]];
        step = steps.shift();
    }
    return stepsTaken;
};

const partTwo = (data) => {
    const startNodes = Object.values(data.mappings).filter((mapping) => mapping.key.endsWith('A'));
    const candidates = startNodes.map((startNode) => candidateStepsTaken(startNode, data)).flat();
    return lcm(Array.from(new Set(candidates)));
};

const data = parseInput(readLines());

report(1, () => partOne(data));
report(2, () => partTwo(data));
