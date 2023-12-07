const { readLines, report, newArray } = require('../util/util');

const cardMappings = newArray(8)
    .map((_, idx) => idx + 2)
    .reduce(
        (acc, val) => {
            acc[val.toString()] = val;
            return acc;
        },
        { T: 10, J: 11, Q: 12, K: 13, A: 14 },
    );

const sortHands = (handOne, handTwo) => {
    for (const [index, card] of handOne.cards.entries()) {
        const otherCard = handTwo.cards[index];
        if (card > otherCard) {
            return 1;
        } else if (card < otherCard) {
            return -1;
        }
    }
    return 0;
};

const mapHand = (line) => {
    const [cards, bid] = line.split(' ');
    return { cards: cards.split('').map((card) => cardMappings[card]), bid };
};

const mapHands = (lines) => lines.map(mapHand);

const handTypeRank = (cardCounts) => {
    const mostOccurring = cardCounts[0];
    if (mostOccurring === 1) {
        return 1;
    } else if (mostOccurring === 2) {
        return cardCounts[1] === 1 ? 2 : 3;
    } else if (mostOccurring === 3) {
        return cardCounts[1] === 1 ? 4 : 5;
    }
    return mostOccurring + 2;
};

const bestHandType = (hand) => {
    const cardCounts = [];
    let wildcards = 0;
    for (const card of hand.cards) {
        if (card > 1) {
            cardCounts[card] = (cardCounts[card] ?? 0) + 1;
        } else {
            wildcards++;
        }
    }
    cardCounts.sort((a, b) => (a > b ? -1 : 1));
    cardCounts[0] = (cardCounts[0] ?? 0) + wildcards;
    return handTypeRank(cardCounts);
};

const groupHandsByType = (groupings, hand) => {
    const handType = bestHandType(hand);
    groupings[handType] = (groupings[handType] ?? []).concat(hand);
    return groupings;
};

const solve = (hands) =>
    Object.values(hands.reduce(groupHandsByType, {}))
        .flat()
        .reduce((result, { bid }, index) => result + bid * (index + 1), 0);

const lines = readLines();

const hands = mapHands(lines);

const partOneHands = hands.toSorted(sortHands);
report(1, () => solve(partOneHands), 246424613);

const partTwoHands = hands
    .map(({ cards, bid }) => ({
        cards: cards.map((card) => (card === 11 ? 1 : card)),
        bid,
    }))
    .toSorted(sortHands);
report(2, () => solve(partTwoHands), 248256639);
