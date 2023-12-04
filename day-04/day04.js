const {
    newArray,
    readLines,
    report,
    intersection,
    parseNumbers,
    reduce: { sum },
} = require('../util/util');

const parseCard = (line) => {
    const splitCardStr = line.substring(line.indexOf(':') + 2).split('|');
    return {
        numbers: new Set(parseNumbers(splitCardStr[0])),
        winningNumbers: new Set(parseNumbers(splitCardStr[1])),
    };
};

const cardPoints = (numMatches) =>
    newArray(numMatches).reduce((acc) => (acc === 0 ? 1 : acc * 2), 0);

const copiesWon = (cards) =>
    cards.reduce((acc, card, cardIdx) => {
        acc[cardIdx] = newArray(intersection(card.numbers, card.winningNumbers).length).map(
            (_, idx) => idx + cardIdx + 1,
        );
        return acc;
    }, {});

const partOne = (cards) =>
    cards
        .map((card) => intersection(card.numbers, card.winningNumbers).length)
        .map(cardPoints)
        .reduce(sum);

const partTwo = (cards) => {
    const cardCopies = copiesWon(cards);
    const stack = Object.values(cardCopies).reduce((acc, copies) => acc.concat(copies), []);
    let total = Object.keys(cardCopies).length;
    while (stack.length) {
        cardCopies[stack.pop()].forEach((card) => stack.push(card));
        total++;
    }
    return total;
};

const cards = readLines(parseCard);
report(1, () => partOne(cards), 23441);
report(2, () => partTwo(cards), 5923918);
