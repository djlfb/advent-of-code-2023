const {
    newArray,
    readLines,
    reduce: { sum },
    report,
} = require('../util/util');

const hash = (str) =>
    str.split('').reduce((current, char) => ((current + char.charCodeAt(0)) * 17) % 256, 0);

const fillBoxes = (initSequence) => {
    const boxes = newArray(256, () => new Map());
    for (const sequence of initSequence) {
        const dashIdx = sequence.indexOf('-');
        if (dashIdx >= 0) {
            const label = sequence.slice(0, dashIdx);
            boxes[hash(label)].delete(label);
        } else {
            const [label, focalLength] = sequence.split('=');
            boxes[hash(label)].set(label, focalLength);
        }
    }
    return boxes;
};

const focusingPower = (boxes) =>
    boxes
        .map((lenses, boxIdx) =>
            Array.from(lenses.values())
                .map((focalLength, lensIdx) => (boxIdx + 1) * ((lensIdx + 1) * focalLength))
                .reduce(sum, 0),
        )
        .reduce(sum, 0);

const partOne = (initSequence) => initSequence.map(hash).reduce(sum);

const partTwo = (initSequence) => focusingPower(fillBoxes(initSequence));

const initSequence = readLines((line) => line.split(','))[0];
report(1, () => partOne(initSequence), 509152);
report(2, () => partTwo(initSequence), 244403);
