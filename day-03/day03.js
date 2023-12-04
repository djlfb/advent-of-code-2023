const {
    hasIntersection,
    isNumber,
    readLines,
    reduce: { sum, product },
    report,
    stringify,
} = require('../util/util');

const adjacentCoords = ({ numX1, numX2, numY }, { maxX, maxY }) => {
    const coords = [];
    for (let y = Math.max(numY - 1, 0); y <= Math.min(numY + 1, maxY); y++) {
        for (let x = Math.max(numX1 - 1, 0); x <= Math.min(numX2 + 1, maxX); x++) {
            if (y !== numY || x < numX1 || x > numX2) {
                coords.push(stringify({ x, y }));
            }
        }
    }
    return new Set(coords);
};

const data = (lines, isSymbol) => {
    const upperBounds = { maxX: lines[0].length - 1, maxY: lines.length - 1 };
    const numberDetails = [];
    const symbolCoords = [];
    for (const [y, line] of lines.entries()) {
        const chars = line.split('');
        let numberSeq = [];

        for (const [x, chr] of chars.entries()) {
            const isNum = isNumber(chr);
            if (isNum) {
                numberSeq.push(chr);
            } else if (isSymbol(chr)) {
                symbolCoords.push(stringify({ x, y }));
            }

            if (numberSeq.length > 0 && (!isNum || x === upperBounds.maxX)) {
                const numX2 = isNum ? x : x - 1;
                numberDetails.push({
                    number: Number(numberSeq.join('')),
                    adjacentCoords: adjacentCoords(
                        { numX1: numX2 - (numberSeq.length - 1), numX2, numY: y },
                        upperBounds,
                    ),
                });
                numberSeq = [];
            }
        }
    }
    return [numberDetails, symbolCoords];
};

const partOne = (lines) => {
    const [numberDetails, symbolCoords] = data(lines, (char) => char !== '.');
    const symbolCoordsSet = new Set(symbolCoords);
    return numberDetails
        .filter((details) => hasIntersection(details.adjacentCoords, symbolCoordsSet))
        .map((details) => details.number)
        .reduce(sum);
};

const partTwo = (lines) => {
    const [numberDetails, gearCoords] = data(lines, (char) => char === '*');
    const gearAdjacentNumbers = numberDetails.reduce((acc, details) => {
        gearCoords
            .filter((gearCoord) => details.adjacentCoords.has(gearCoord))
            .forEach(
                (gearCoord) => (acc[gearCoord] = (acc[gearCoord] ?? []).concat(details.number)),
            );
        return acc;
    }, {});
    return Object.values(gearAdjacentNumbers)
        .filter((gearNumbers) => gearNumbers.length === 2)
        .map((gearNumbers) => gearNumbers.reduce(product))
        .reduce(sum);
};

const lines = readLines();

report(1, () => partOne(lines), 530495);
report(2, () => partTwo(lines), 80253814);
