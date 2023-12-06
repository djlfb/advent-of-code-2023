const { parseNumbers, readLines, report } = require('../util/util');

const toMappingDetails = (numbers) => ({
    sourceStart: numbers[1],
    sourceEnd: numbers[1] + numbers[2],
    destinationStart: numbers[0],
    destinationEnd: numbers[0] + numbers[2],
});

const parseMappings = (lines) => {
    const allMappings = [];
    for (const line of lines) {
        if (line.indexOf('map') > 0) {
            allMappings.push([]);
        } else {
            allMappings[allMappings.length - 1].push(toMappingDetails(parseNumbers(line)));
        }
    }
    return allMappings;
};

const seedsToRanges = (seeds) => {
    const ranges = [];
    for (let i = 0; i < seeds.length - 1; i += 2) {
        ranges.push({ start: seeds[i], end: seeds[i] + seeds[i + 1] });
    }
    return ranges;
};

const hasNonEmptyInterval = ({ start, end }) => end > start;

const nextValue = (value, rangeMapping) =>
    rangeMapping
        .filter((mapping) => value >= mapping.sourceStart && value < mapping.sourceEnd)
        .map((mapping) => mapping.destinationStart + (value - mapping.sourceStart))[0] ?? value;

const nextRangesToCheck = (ranges, mappings) => {
    const intersectionRanges = [];
    for (const { sourceStart, sourceEnd, destinationStart } of mappings) {
        const differenceRanges = [];
        while (ranges.length) {
            const { start, end } = ranges.pop();

            intersectionRanges.push(
                ...[
                    {
                        start: Math.max(start, sourceStart) - sourceStart + destinationStart,
                        end: Math.min(sourceEnd, end) - sourceStart + destinationStart,
                    },
                ].filter(hasNonEmptyInterval),
            );

            differenceRanges.push(
                ...[
                    { start, end: Math.min(sourceStart, end) },
                    { start: Math.max(sourceEnd, start), end },
                ].filter(hasNonEmptyInterval),
            );
        }
        ranges = differenceRanges;
    }
    return ranges.concat(intersectionRanges);
};

const partOne = (seeds, mappings) =>
    seeds
        .map((seed) =>
            mappings.reduce((value, rangeMapping) => nextValue(value, rangeMapping), seed),
        )
        .reduce((lowest, value) => Math.min(lowest ?? value, value));

const partTwo = (seeds, allMappings) =>
    seedsToRanges(seeds)
        .map((seedRange) =>
            allMappings.reduce(
                (ranges, mappings) => nextRangesToCheck(ranges, mappings),
                [seedRange],
            ),
        )
        .flat()
        .reduce((lowest, { start }) => Math.min(lowest ?? start, start), null);

const lines = readLines();
const seeds = parseNumbers(lines[0].replace('seeds: ', ''));
const allMappings = parseMappings(lines.slice(1));

report(1, () => partOne(seeds, allMappings), 650599855);
report(2, () => partTwo(seeds, allMappings), 1240035);
