const {
    reduce: { sum },
    readLines,
    report,
} = require('../util/util');

const DIR = {
    R: 'R',
    D: 'D',
    L: 'L',
    U: 'U',
};

// Shoelace -> https://en.wikipedia.org/wiki/Shoelace_formula
const area = (coords) => {
    let sum = 0;
    for (const [idx, { x: x1, y: y1 }] of coords.entries()) {
        const { x: x2, y: y2 } = coords[(idx + 1) % coords.length];
        sum += x1 * y2 - y1 * x2;
    }
    return Math.abs(sum) / 2;
};

const edgeLength = (directions) => directions.map(({ distance }) => distance).reduce(sum);

const digCoords = (directions) => {
    const coords = [{ x: 0, y: 0 }];
    for (const { dir, distance } of directions.slice(1)) {
        const { x, y } = coords[coords.length - 1];
        if (dir === DIR.L) {
            coords.push({ x: x - distance, y });
        } else if (dir === DIR.R) {
            coords.push({ x: x + distance, y });
        } else if (dir === DIR.U) {
            coords.push({ x, y: y - distance });
        } else {
            coords.push({ x, y: y + distance });
        }
    }
    return coords;
};

const partOneDirections = () =>
    readLines((line) => {
        [dir, distance] = line.split(' ');
        return { dir, distance: Number(distance) };
    });

const partTwoDirections = () =>
    readLines((line) => {
        const hex = line.replace('(', '').replace(')', '').split(' ')[2];
        return {
            dir: Object.values(DIR)[hex[hex.length - 1]],
            distance: parseInt(hex.slice(1, hex.length - 1), 16),
        };
    });

const solve = (directions) => area(digCoords(directions)) + (edgeLength(directions) / 2 + 1);

report(1, () => solve(partOneDirections()), 38188);
report(2, () => solve(partTwoDirections()), 93325849869340);
