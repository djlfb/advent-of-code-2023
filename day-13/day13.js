const {
    reduce: { sum },
    report,
} = require('../util/util');
const { readFileSync } = require('fs');

const parsePatterns = (lines) => {
    const patterns = [];
    let currentPattern = [];
    for (const line of lines) {
        if (line.length) {
            currentPattern.push(line);
        } else {
            patterns.push(currentPattern);
            currentPattern = [];
        }
    }
    patterns.push(currentPattern);
    return patterns;
};

const rotatePattern = (pattern) =>
    pattern[0].split('').map((_, colIndex) => pattern.map((row) => row[colIndex]).join(''));

const strDiff = (strOne, strTwo) =>
    strOne.split('').filter((char, idx) => char !== strTwo[idx]).length;

const hasSymmetry = (pattern, reflectionIdx, allowedDiff) => {
    const range = Math.min(reflectionIdx + 1, pattern.length - reflectionIdx - 1);
    let diff = 0;
    for (let i = 0; i < range; i++) {
        diff += strDiff(pattern[reflectionIdx - i], pattern[reflectionIdx + i + 1]);
        if (diff > allowedDiff) {
            return false;
        }
    }
    return diff === allowedDiff;
};

const findMirror = (pattern, allowedDiff) =>
    pattern
        .slice(0, pattern.length - 1)
        .findIndex((row, idx) => hasSymmetry(pattern, idx, allowedDiff)) + 1;

const solve = (patterns, allowedDiff = 0) => {
    const horizontal = [];
    const vertical = [];
    for (const pattern of patterns) {
        const horizontalMirror = findMirror(pattern, allowedDiff);
        if (horizontalMirror) {
            horizontal.push(horizontalMirror);
        } else {
            vertical.push(findMirror(rotatePattern(pattern), allowedDiff));
        }
    }
    return vertical.reduce(sum, 0) + horizontal.map((val) => val * 100).reduce(sum, 0);
};

const lines = readFileSync('./input.txt').toString().split('\n');
const patterns = parsePatterns(lines);

report(1, () => solve(patterns), 29130);
report(2, () => solve(patterns, 1), 33438);
