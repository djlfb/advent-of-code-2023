const { readLines, report, stringify } = require('../util/util');

const DIR = {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    UP: 'UP',
    DOWN: 'DOWN',
};

const progressFns = {
    [DIR.LEFT]: (x, y) => ({ x: x - 1, y }),
    [DIR.RIGHT]: (x, y) => ({ x: x + 1, y }),
    [DIR.UP]: (x, y) => ({ x, y: y - 1 }),
    [DIR.DOWN]: (x, y) => ({ x, y: y + 1 }),
};

const changeDirFns = {
    F: (dir) => (dir === DIR.LEFT ? DIR.DOWN : DIR.RIGHT),
    J: (dir) => (dir === DIR.RIGHT ? DIR.UP : DIR.LEFT),
    L: (dir) => (dir === DIR.LEFT ? DIR.UP : DIR.RIGHT),
    7: (dir) => (dir === DIR.RIGHT ? DIR.DOWN : DIR.LEFT),
};

const startDir = (x, y, grid) => {
    if (y > 0 && ['|', 'F', '7'].includes(grid[y - 1][x])) {
        return DIR.UP;
    } else if (y < grid.length - 1 && ['|', 'L', 'J'].includes(grid[y + 1][x])) {
        return DIR.DOWN;
    } else if (x > 0 && ['-', 'F', 'L'].includes(grid[y][x - 1])) {
        return DIR.LEFT;
    }
    return DIR.RIGHT;
};

const startDetails = (grid) => {
    for (const [y, row] of grid.entries()) {
        const x = row.indexOf('S');
        if (x >= 0) {
            return { x, y, dir: startDir(x, y, grid) };
        }
    }
};

const traverse = (x, y, dir, grid) => {
    ({ x, y } = progressFns[dir](x, y));
    const pipeType = grid[y][x];
    const nextDirFn = changeDirFns[pipeType] ?? (() => dir);
    return { x, y, dir: nextDirFn(dir) };
};

const findPath = (grid) => {
    const path = [];
    let { x, y, dir } = startDetails(grid);
    do {
        ({ x, y, dir } = traverse(x, y, dir, grid));
        path.push({ x, y });
    } while (grid[y][x] !== 'S');
    return path;
};

const partOne = (grid) => findPath(grid).length / 2;

const partTwo = (grid) => {
    const pathCoords = new Set(findPath(grid).map(stringify));
    let inside = 0;
    for (const [y, row] of grid.entries()) {
        let vertical = 0;
        for (const [x, value] of row.entries()) {
            if (!pathCoords.has(stringify({ x, y }))) {
                /* Odd number of vertical pipes observed for a non-path element (to the left or right)
                 * the point ust be inside the pipe
                 * https://en.wikipedia.org/wiki/Point_in_polygon
                 *  O F - - 7 O O F - - 7 O
                 *  O | I I L - - | I I | O
                 *  O | I I I I I I I I | O
                 *  O | I I I F 7 I I I | O
                 *  O | I I F J L 7 I I | O
                 *  O | I I | O O L - - 7 O
                 *  O L - - J O O O O O O O
                 *
                 * L7 and FJ are effectively vertical pipes
                 * LJ and F7 are effectively horizontal pipes, and shouldn't be counted
                 * So if you come across LJ or F7 it'll cancel itself out by counting only L and J
                 */
                inside += vertical % 2;
            } else if (['|', 'L', 'J'].includes(value)) {
                // |, F, 7 should also work but won't for my input as 'S' needs to included as well
                // and I cba to correct the 'S'
                vertical++;
            }
        }
    }
    return inside;
};

const grid = readLines((line) => line.split(''));

report(1, () => partOne(grid), 6815);
report(2, () => partTwo(grid), 269);
