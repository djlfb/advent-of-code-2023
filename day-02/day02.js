const {
    readLines,
    report,
    reduce: { sum, product },
} = require('../util/util');

const mapSelectionColors = (selection) =>
    selection.split(', ').reduce(
        (selection, selectionStr) => {
            const [count, color] = selectionStr.split(' ');
            selection[color] = Number(count);
            return selection;
        },
        { red: 0, green: 0, blue: 0 },
    );

const mapLineToGame = (line) =>
    line
        .substring(line.indexOf(':') + 2)
        .split('; ')
        .map(mapSelectionColors);

const gamePossible = (max, gameTotals) =>
    Object.entries(max).every(([colorKey, maxValue]) => gameTotals[colorKey] <= maxValue);

const maxColorValues = (game) =>
    game.reduce(
        (max, candidate) => ({
            red: Math.max(max.red, candidate.red),
            green: Math.max(max.green, candidate.green),
            blue: Math.max(max.blue, candidate.blue),
        }),
        { red: 0, green: 0, blue: 0 },
    );

const partOne = (games, max) =>
    games.reduce(
        (acc, game, index) =>
            acc + (game.every((selection) => gamePossible(max, selection)) ? index + 1 : 0),
        0,
    );

const partTwo = (games) =>
    games
        .map(maxColorValues)
        .map((maxColorValues) => Object.values(maxColorValues).reduce(product))
        .reduce(sum);

const games = readLines(mapLineToGame);
report(1, () => partOne(games, { red: 12, green: 13, blue: 14 }), 2617);
report(2, () => partTwo(games), 59795);
