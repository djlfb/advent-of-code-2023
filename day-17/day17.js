const { inBounds, stringify, readLines, report } = require('../util/util');
const { MinPriorityQueue } = require('@datastructures-js/priority-queue');

const DIR = {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    UP: 'UP',
    DOWN: 'DOWN',
};

const allMoves = {
    [DIR.LEFT]: ({ x, y }) => [
        { x, y: y - 1, dir: DIR.UP },
        { x, y: y + 1, dir: DIR.DOWN },
        { x: x - 1, y, dir: DIR.LEFT },
    ],
    [DIR.RIGHT]: ({ x, y }) => [
        { x, y: y - 1, dir: DIR.UP },
        { x, y: y + 1, dir: DIR.DOWN },
        { x: x + 1, y, dir: DIR.RIGHT },
    ],
    [DIR.UP]: ({ x, y }) => [
        { x: x - 1, y, dir: DIR.LEFT },
        { x: x + 1, y, dir: DIR.RIGHT },
        { x, y: y - 1, dir: DIR.UP },
    ],
    [DIR.DOWN]: ({ x, y }) => [
        { x: x - 1, y, dir: DIR.LEFT },
        { x: x + 1, y, dir: DIR.RIGHT },
        { x, y: y + 1, dir: DIR.DOWN },
    ],
};

const coordKey = ({ x, y }) => stringify({ x, y });

const dirKey = ({ dir, dirCount }) => stringify({ dir, dirCount });

const invalidEnd = (grid, { x, y, dirCount }, minInDir) =>
    dirCount < (minInDir ?? 0) && x === grid[0].length - 1 && y === grid.length - 1;

const getPotentialAdjacent = ({ x, y, dir, dirCount }, maxInDir, minInDir) => {
    const moves = dir
        ? allMoves[dir]({ x, y })
        : allMoves[DIR.RIGHT]({ x, y }).concat(...allMoves[DIR.DOWN]({ x, y }));
    if (dirCount < minInDir) {
        return dir ? [moves[moves.length - 1]] : [moves[1], moves[4]];
    } else if (dirCount === maxInDir) {
        return moves.slice(0, moves.length - 1);
    }
    return moves;
};

const getAdjacent = (grid, node, maxInDir, minInDir) =>
    getPotentialAdjacent(node, maxInDir, minInDir).filter(({ x, y }) => inBounds(grid, x, y));

const shortestPath = (grid, maxInDir, minInDir = null) => {
    const visited = new Map();
    const queue = new MinPriorityQueue(({ distance }) => distance);
    queue.enqueue({ x: 0, y: 0, distance: 0, dir: null, dirCount: 0 });
    while (!queue.isEmpty()) {
        const currentNode = queue.dequeue();
        const coordsKey = coordKey(currentNode);
        const visitedVariantKey = dirKey(currentNode);
        if (
            visited.get(coordsKey)?.has(visitedVariantKey) ||
            invalidEnd(grid, currentNode, minInDir)
        ) {
            continue;
        }
        const visitedVariants = visited.get(coordsKey) ?? new Map();
        visitedVariants.set(visitedVariantKey, currentNode.distance);
        visited.set(coordsKey, visitedVariants);
        const adjacent = getAdjacent(grid, currentNode, maxInDir, minInDir);
        for (const { x, y, dir } of adjacent) {
            const distance = currentNode.distance + Number(grid[y][x]);
            const dirCount = currentNode.dir === dir ? currentNode.dirCount + 1 : 1;
            queue.enqueue({ x, y, distance, dir, dirCount });
        }
    }
    const endCoordKey = coordKey({ x: grid[0].length - 1, y: grid.length - 1 });
    return Math.min(...Array.from(visited.get(endCoordKey).values()));
};

const grid = readLines((line) => line.split(''));
report(1, () => shortestPath(grid, 3), 861);
report(2, () => shortestPath(grid, 10, 4), 1037);
