const { inBounds, readLines, report } = require('../util/util');

const DIR = {
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
};

const progressFns = {
    '.': {
        [DIR.UP]: ({ x, y, dir }) => [{ x, y: y - 1, dir }],
        [DIR.DOWN]: ({ x, y, dir }) => [{ x, y: y + 1, dir }],
        [DIR.LEFT]: ({ x, y, dir }) => [{ x: x - 1, y, dir }],
        [DIR.RIGHT]: ({ x, y, dir }) => [{ x: x + 1, y, dir }],
    },
    '|': {
        [DIR.UP]: ({ x, y, dir }) => [{ x, y: y - 1, dir }],
        [DIR.DOWN]: ({ x, y, dir }) => [{ x, y: y + 1, dir }],
        [DIR.LEFT]: ({ x, y }) => [
            { x, y: y + 1, dir: DIR.DOWN },
            { x, y: y - 1, dir: DIR.UP },
        ],
        [DIR.RIGHT]: ({ x, y }) => [
            { x, y: y + 1, dir: DIR.DOWN },
            { x, y: y - 1, dir: DIR.UP },
        ],
    },
    '-': {
        [DIR.UP]: ({ x, y }) => [
            { x: x + 1, y, dir: DIR.RIGHT },
            { x: x - 1, y, dir: DIR.LEFT },
        ],
        [DIR.DOWN]: ({ x, y }) => [
            { x: x + 1, y, dir: DIR.RIGHT },
            { x: x - 1, y, dir: DIR.LEFT },
        ],
        [DIR.LEFT]: ({ x, y, dir }) => [{ x: x - 1, y, dir }],
        [DIR.RIGHT]: ({ x, y, dir }) => [{ x: x + 1, y, dir }],
    },
    '/': {
        [DIR.UP]: ({ x, y }) => [{ x: x + 1, y, dir: DIR.RIGHT }],
        [DIR.DOWN]: ({ x, y }) => [{ x: x - 1, y, dir: DIR.LEFT }],
        [DIR.LEFT]: ({ x, y }) => [{ x, y: y + 1, dir: DIR.DOWN }],
        [DIR.RIGHT]: ({ x, y }) => [{ x, y: y - 1, dir: DIR.UP }],
    },
    '\\': {
        [DIR.UP]: ({ x, y }) => [{ x: x - 1, y, dir: DIR.LEFT }],
        [DIR.DOWN]: ({ x, y }) => [{ x: x + 1, y, dir: DIR.RIGHT }],
        [DIR.LEFT]: ({ x, y }) => [{ x, y: y - 1, dir: DIR.UP }],
        [DIR.RIGHT]: ({ x, y }) => [{ x, y: y + 1, dir: DIR.DOWN }],
    },
};

const beamProgressions = (grid, { x, y, dir }) => progressFns[grid[y][x]][dir]({ x, y, dir });

const traceBeam = (grid, beam, visited) => {
    const beams = [beam];
    while (beams.length) {
        const beam = beams.pop();
        const { x, y, dir } = beam;
        const visitedCoord = JSON.stringify({ x, y });
        const visitedCoordDirs = visited.get(visitedCoord) ?? new Set();
        if (!visitedCoordDirs.has(dir) && inBounds(grid, x, y)) {
            visitedCoordDirs.add(dir);
            visited.set(visitedCoord, visitedCoordDirs);
            beams.push(...beamProgressions(grid, beam));
        }
    }
};

const solve = (grid, beamStart) => {
    const visited = new Map();
    traceBeam(grid, beamStart, visited);
    return visited.size;
};

const partOne = (grid) => solve(grid, { x: 0, y: 0, dir: DIR.RIGHT });

const partTwo = (grid) => {
    const scenarios = [];
    for (const x of grid[0].keys()) {
        scenarios.push(solve(grid, { x, y: 0, dir: DIR.DOWN }));
        scenarios.push(solve(grid, { x, y: grid.length - 1, dir: DIR.UP }));
    }
    for (const y of grid.keys()) {
        scenarios.push(solve(grid, { x: 0, y, dir: DIR.RIGHT }));
        scenarios.push(solve(grid, { x: grid[0].length - 1, y, dir: DIR.LEFT }));
    }
    return Math.max(...scenarios);
};

const grid = readLines((line) => line.split(''));
report(1, () => partOne(grid), 6816);
report(2, () => partTwo(grid), 8163);
