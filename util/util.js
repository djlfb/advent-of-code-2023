const { readFileSync } = require('fs');

const readLines = (map = (line) => line, path = './input.txt') => {
    const file = readFileSync(path);
    return file
        .toString()
        .split('\n')
        .filter((line) => line.length > 0)
        .map(map);
};

const reverseStr = (str) => str.split('').reverse().join('');

const newArray = (length, initValue = 0) => Array(length).fill(initValue);

const isNumber = (chr) => typeof chr === 'number' || (chr >= '0' && chr <= '9');

const reduce = {
    sum: (a, b) => a + b,
    product: (a, b) => a * b,
};

const stringify = (value) => JSON.stringify(value);

const hasIntersection = (setOne, setTwo) => {
    if (setOne.length > setTwo.length) {
        return Array.from(setTwo).some((value) => setOne.has(value));
    }
    return Array.from(setOne).some((value) => setTwo.has(value));
};

const intersection = (setOne, setTwo) => {
    if (setOne.length > setTwo.length) {
        return Array.from(setTwo).filter((value) => setOne.has(value));
    }
    return Array.from(setOne).filter((value) => setTwo.has(value));
};

const parseNumbers = (str, delim = /\s+/) =>
    str
        .trim()
        .split(delim)
        .map((chr) => Number(chr));

const _quadratic = (a, b, c, positive = true) =>
    (-b + (positive ? 1 : -1) * Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
const quadratic = (a, b, c) => [_quadratic(a, b, c, false), _quadratic(a, b, c)];

const gcd = (x, y) => (!y ? x : gcd(y, x % y));

const _lcm = (x, y) => (x * y) / gcd(x, y);
const lcm = (values) => values.reduce((a, b) => _lcm(a, b), 1);

const time = (fn) => {
    const start = Date.now();
    return [fn(), Date.now() - start];
};

const checkAndLog = (part, result, expected, timeTaken) => {
    if (expected && result !== expected) {
        throw Error(`Expected ${expected} but result was ${result}`);
    }
    console.log(`Part ${part}: ${result} - ${timeTaken}ms`);
};

const report = (part, fn, expected) => {
    const [result, timeTaken] = time(fn);
    checkAndLog(part, result, expected, timeTaken);
};

const reportAll = (parts, timeTaken) =>
    parts.forEach(({ expected, result }, idx) => checkAndLog(idx + 1, result, expected, timeTaken));

module.exports = {
    gcd,
    hasIntersection,
    intersection,
    isNumber,
    lcm,
    newArray,
    parseNumbers,
    quadratic,
    readLines,
    reverseStr,
    reduce,
    report,
    reportAll,
    stringify,
    time,
};
