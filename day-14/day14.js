const {
    newArray,
    readLines,
    reduce: { sum },
    report,
} = require('../util/util');

const rotate = (grid) => {
    const rotated = newArray(grid.length);
    rotated.forEach((_, i) => (rotated[i] = newArray(grid[0].length)));
    for (let rIdx = 0; rIdx < grid.length; rIdx++) {
        for (let cIdx = 0; cIdx < grid[0].length; cIdx++) {
            rotated[cIdx][grid.length - 1 - rIdx] = grid[rIdx][cIdx];
        }
    }
    return rotated;
};

const tilt = (grid) => {
    const tilted = JSON.parse(JSON.stringify(grid).replaceAll('O', '.'));
    for (const [_y, row] of grid.entries()) {
        for (const [x, value] of row.entries()) {
            if (value === 'O') {
                let y = _y;
                while (y > 0 && tilted[y - 1][x] === '.') {
                    y--;
                }
                tilted[y][x] = 'O';
            }
        }
    }
    return tilted;
};

const calcLoad = (grid) =>
    grid
        .map((row, rowIdx) => row.filter((value) => value === 'O').length * (grid.length - rowIdx))
        .reduce(sum);

const partOne = (grid) => calcLoad(tilt(grid));

const partTwo = (grid) => {
    const cycles = 1000000000;
    const lastSeenCycle = new Map();
    let currentGrid = grid;
    let cycle = 0;
    while (cycle < cycles) {
        for (let i = 0; i < 4; i++) {
            currentGrid = rotate(tilt(currentGrid));
        }
        cycle++;
        const lastSeenKey = JSON.stringify(currentGrid);
        if (lastSeenCycle.has(lastSeenKey)) {
            const repeatCycleLength = cycle - lastSeenCycle.get(lastSeenKey);
            cycle += repeatCycleLength * Math.floor((cycles - cycle) / repeatCycleLength);
        }
        lastSeenCycle.set(lastSeenKey, cycle);
    }
    return calcLoad(currentGrid);
};

const grid = readLines((line) => line.split(''));

report(1, () => partOne(grid), 109638);
report(2, () => partTwo(grid), 102657);
