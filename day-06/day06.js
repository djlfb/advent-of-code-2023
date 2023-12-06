const {
    readLines,
    report,
    parseNumbers,
    quadratic,
    reduce: { product },
} = require('../util/util');

const mergeNumbers = (input) => Number(input.join(''));

const waysToBeatRecord = ({ time, record }) => {
    const [lower, upper] = quadratic(1, time, record);
    return Math.floor(upper) - Math.ceil(lower) + 1;
};

const solve = (races) => races.map(waysToBeatRecord).reduce(product);

const partOne = (inputs) => {
    const races = [];
    for (let i = 0; i < inputs[0].length; i++) {
        races.push({ time: inputs[0][i], record: inputs[1][i] + 1 });
    }
    return solve(races);
};

const partTwo = (inputs) =>
    solve([{ time: mergeNumbers(inputs[0]), record: mergeNumbers(inputs[1]) + 1 }]);

const inputs = readLines((line) => parseNumbers(line.split(':')[1].trim()));

report(1, () => partOne(inputs), 5133600);
report(2, () => partTwo(inputs), 40651271);
