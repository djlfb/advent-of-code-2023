const { parseNumbers, readLines, reportAll, time } = require('../util/util');

const seqDiff = (seq) => {
    const diff = [];
    for (let i = 0; i < seq.length - 1; i++) {
        diff.push(seq[i + 1] - seq[i]);
    }
    return diff;
};

const seqPrevNext = (input) => {
    const seqs = [input];
    while (seqs[seqs.length - 1].some((n) => n !== 0)) {
        seqs.push(seqDiff(seqs[seqs.length - 1]));
    }
    return seqs.reverse().reduce(
        ({ prev, next }, seq) => ({
            prev: seq[0] - prev,
            next: seq[seq.length - 1] + next,
        }),
        { prev: 0, next: 0 },
    );
};

const solve = (inputs) =>
    inputs
        .map(seqPrevNext)
        .reduce((acc, { prev, next }) => ({ prev: acc.prev + prev, next: acc.next + next }), {
            prev: 0,
            next: 0,
        });

const inputs = readLines((line) => parseNumbers(line, ' '));
const [{ next: partOneResult, prev: partTwoResult }, timeTaken] = time(() => solve(inputs));
reportAll(
    [
        { result: partOneResult, expected: 2175229206 },
        { result: partTwoResult, expected: 942 },
    ],
    timeTaken,
);
