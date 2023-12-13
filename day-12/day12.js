const {
    readLines,
    reduce: { sum },
    report,
} = require('../util/util');

const parseLine = (line) => {
    const [springs, blockSizes] = line.split(' ');
    return {
        springs: springs.split(''),
        blockSizes: blockSizes.split(',').map(Number),
    };
};

const expandArray = (arr, join = null) => {
    let newArr = [];
    for (let i = 0; i < 5; i++) {
        if (i === 0 || !join) {
            newArr.push(...arr);
        } else {
            newArr.push(...[join, ...arr]);
        }
    }
    return newArr;
};

const possibleArrangements = (
    springs,
    blockSizes,
    springIdx = 0,
    blockIdx = 0,
    blockSize = 0,
    cache = new Map(),
) => {
    /**
     * The only variants are the spring index, block index and block size, so use this to cache results
     *  to avoid traversing any further
     */
    const cacheKey = JSON.stringify({ springIdx, blockIdx, blockSize });
    if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
    }

    // Base case, end of springs
    if (springIdx === springs.length) {
        /**
         * We've reached the end of the springs, the only states that mean the arrangement is valid are:
         * 1. The current block is the last block and it fits the block size
         * 2. All blocks have been assessed and we're not looking at a block
         */
        const inLastBlockAndFits = blockIdx === blockSizes.length - 1 && blockSizes[blockIdx] === blockSize;
        const allBlocksFit = blockIdx === blockSizes.length && blockSize === 0;
        return inLastBlockAndFits || allBlocksFit ? 1 : 0;
    }

    const nextSpringIdx = springIdx + 1;
    const next = (nextBlockIdx, blockSize) =>
        possibleArrangements(springs, blockSizes, nextSpringIdx, nextBlockIdx, blockSize, cache);

    let result = 0;
    const spring = springs[springIdx];
    const inGap = ['.', '?'].includes(spring);
    const inBlock = ['#', '?'].includes(spring);

    /**
     * Consider the possible further arrangements if we have reached a gap or a block
     * There are 4 possible states, 3 of which that allow us to continue:
     * 1. The current block is still being assessed (in a block and block size not met)
     *     -> Continue to next spring with a bigger block size
     * 2. We've satisfied a block fits the space (hit a gap and the block size matches the block being assessed
     *     -> Continue to next spring and start assessing the next block
     * 3. We're waiting to start assessing our block (in a gap)
     *     -> Continue to the next spring with the same block
     * 4. None of the above are satisfied
     *    -> No point in assessing the arrangement further
     */

    if (inBlock && blockSize < blockSizes[blockIdx]) {
        // We have reached a block (or potential)
        // And the block doesn't fill the space
        // Continue to the next spring with a larger block in
        result += next(blockIdx, blockSize + 1);
    }

    if (inGap) {
        // We have reached a gap (or could be)...
        if (blockSizes[blockIdx] === blockSize) {
            // ... and the current block fits the previous area we visited
            // Continue to the next spring with the next block
            result += next(blockIdx + 1, 0);
        } else if (blockSize === 0) {
            // ... and not currently considering a block
            // Continue to the next spring checking the same block
            result += next(blockIdx, blockSize);
        }
        // Otherwise we've hit a gap and the block we're assessing doesn't fit
        // The case where it may be a block continuation is already handled
    }

    cache.set(cacheKey, result);
    return result;
};

const solve = (data) =>
    data.map(({ springs, blockSizes }) => possibleArrangements(springs, blockSizes)).reduce(sum);

const partOne = (data) => solve(data);

const partTwo = (data) => {
    const adjustedData = data.map(({ springs, blockSizes }) => ({
        springs: expandArray(springs, '?'),
        blockSizes: expandArray(blockSizes),
    }));
    return solve(adjustedData);
};

const data = readLines(parseLine);

report(1, () => partOne(data), 7916);
report(2, () => partTwo(data), 37366887898686);
