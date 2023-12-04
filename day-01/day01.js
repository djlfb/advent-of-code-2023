const {
    newArray,
    readLines,
    report,
    reduce: { sum },
} = require('../util/util');

const extractNumber = (line, numberValues) => {
    let firstNumIdx = null;
    let lastNumIdx = null;
    let bestFirstIndex = line.length;
    let bestLastIndex = -1;

    for (const [numIndex, numberValue] of numberValues.entries()) {
        const firstIndexOfNum = line.indexOf(numberValue);
        if (firstIndexOfNum >= 0) {
            bestFirstIndex = Math.min(firstIndexOfNum, bestFirstIndex);
            firstNumIdx = firstIndexOfNum === bestFirstIndex ? numIndex : firstNumIdx;

            const lastIndexOfNum = line.lastIndexOf(numberValue);
            bestLastIndex = Math.max(lastIndexOfNum, bestLastIndex);
            lastNumIdx = lastIndexOfNum === bestLastIndex ? numIndex : lastNumIdx;
        }
    }

    return Number(`${(firstNumIdx % 9) + 1}${(lastNumIdx % 9) + 1}`);
};

const solve = (lines, numberValues) =>
    lines.map((line) => extractNumber(line, numberValues)).reduce(sum);

const lines = readLines();
const numberValues = newArray(9).map((_, idx) => idx + 1);
const numberWordValues = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

report(1, () => solve(lines, numberValues), 54697);
report(2, () => solve(lines, numberValues.concat(numberWordValues)), 54885);
