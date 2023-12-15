const {
    readLines,
    reduce: { sum },
    report,
} = require('../util/util');

const hashChar = (currentValue, char) => ((currentValue + char.charCodeAt(0)) * 17) % 256;

const hashStr = (str) => str.split('').reduce((res, value) => hashChar(res, value), 0);

const emptyBoxes = () => {
    const boxes = [];
    for (let i = 0; i < 256; i++) {
        boxes.push([]);
    }
    return boxes;
};

const fillBoxes = (initSequence) => {
    const boxes = emptyBoxes();
    for (const sequence of initSequence) {
        const dashIndex = sequence.indexOf('-');
        if (dashIndex >= 0) {
            const label = sequence.slice(0, dashIndex);
            const boxIdx = hashStr(label);
            boxes[boxIdx] = boxes[boxIdx].filter((lens) => lens.label !== label);
        } else {
            const [label, focalLength] = sequence.split('=');
            const boxIdx = hashStr(label);
            const existing = boxes[boxIdx].find((lens) => lens.label === label);
            if (existing) {
                existing.focalLength = focalLength;
            } else {
                boxes[boxIdx].push({ label, focalLength });
            }
        }
    }
    return boxes;
};

const totalFocusingPower = (boxes) =>
    boxes
        .map((lenses, boxIdx) =>
            lenses
                .map((lens, lensIdx) => (boxIdx + 1) * ((lensIdx + 1) * lens.focalLength))
                .reduce(sum, 0),
        )
        .reduce(sum, 0);

const partOne = (initSequence) => initSequence.map(hashStr).reduce(sum);

const partTwo = (initSequence) => totalFocusingPower(fillBoxes(initSequence));

const initSequence = readLines((line) => line.split(','))[0];
report(1, () => partOne(initSequence), 509152);
report(2, () => partTwo(initSequence), 244403);
