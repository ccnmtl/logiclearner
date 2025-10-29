import {
    getColorName,
    getRandomElement,
    randomIntFromInterval,
    gridSize,
    shapes,
    colors,
    numbers
} from '../../utils';

function replacePlaceholders(template, details) {
    return template
        .replace(/{shape1}/g, details.shape1)
        .replace(/{shape2}/g, details.shape2)
        .replace(/{color1}/g, details.color1)
        .replace(
            /{valueConditionDescription}/g,
            details.valueConditionDescription
        );
}

function randomValueRange() {
    // pick a threshold in [1..5] for "value < threshold"
    const max = randomIntFromInterval(1, 5);
    return max;
}

export const hardTemplate_04 = {
    generateStatements() {
        const shape1 = getRandomElement(shapes);
        const shape2 = getRandomElement(shapes.filter(s => s !== shape1));
        const color1 = getRandomElement(colors);

        const valueThreshold = randomValueRange();
        const valueConditionDescription =
            `with a value less than ${valueThreshold}`;
        const colorName = getColorName(color1);

        const details = {
            shape1,
            shape2,
            color1,
            valueThreshold,
            valueConditionDescription
        };

        // "For all shape1 that are color1, there exists shape2 with
        // value< threshold directly below it."
        const naturalLanguageStatement = replacePlaceholders(
            'For all {shape1}s that are {color1}, there exists a {shape2} '
            + '{valueConditionDescription} directly below it.',
            { ...details, color1: colorName }
        );

        const formalFOLStatement = `∀x ((Shape(x, ${shape1}) ∧ 
            Color(x, ${colorName})) → ∃y (Shape(y, ${shape2}) ∧ 
            Value(y) < ${valueThreshold} ∧ Adjacency(y, Below, x)))`.trim();

        return { naturalLanguageStatement, formalFOLStatement, details };
    },

    generateGrid(satisfies, details) {
        const { shape1, shape2, color1, valueThreshold } = details;

        const grid = Array.from({ length: gridSize * gridSize }, (_, i) => ({
            shape: getRandomElement(shapes),
            color: getRandomElement(colors),
            number: getRandomElement(numbers),
            position: {
                row: Math.floor(i / gridSize),
                col: i % gridSize
            }
        }));

        // cellBelow(x): row+1, same col
        const cellBelow = (cellX) => {
            const { row, col } = cellX.position;
            return grid.find(
                c => c.position.row === row + 1 && c.position.col === col);
        };

        if (satisfies) {
            grid.forEach(cellX => {
                if (cellX.shape === shape1 && cellX.color === color1) {
                    // if row=4, no below => must fix X
                    if (cellX.position.row === gridSize - 1) {
                        cellX.color = getRandomElement(
                            colors.filter(c => c !== color1));
                    } else {
                        const below = cellBelow(cellX);
                        if (below) {
                            // must be shape2 + number< threshold
                            if (below.shape !== shape2
                                || below.number >= valueThreshold) {
                                below.shape = shape2;
                                below.number = randomIntFromInterval(
                                    0, valueThreshold - 1);
                            }
                        }
                    }
                }
            });
        } else {
            // partially satisfy
            grid.forEach(cellX => {
                if (cellX.shape === shape1 && cellX.color === color1
                    && cellX.position.row < gridSize - 1) {
                    const bCell = cellBelow(cellX);
                    if (bCell) {
                        bCell.shape = shape2;
                        if (bCell.number >= valueThreshold) {
                            bCell.number = randomIntFromInterval(
                                0, valueThreshold - 1);
                        }
                    }
                }
            });
            // introduce violation
            const violatingX = grid.find(cellX => {
                if (cellX.shape === shape1 && cellX.color === color1
                    && cellX.position.row < gridSize - 1) {
                    const bCell = cellBelow(cellX);
                    if (bCell && bCell.shape === shape2
                        && bCell.number < valueThreshold) {
                        return true;
                    }
                }
                return false;
            });
            if (violatingX) {
                const bCell = cellBelow(violatingX);
                if (bCell) {
                    bCell.number = randomIntFromInterval(valueThreshold, 9);
                }
            } else {
                // fallback: place X in row=4 => can't have below neighbor
                const bottomCell = grid.find(
                    c => c.position.row === gridSize - 1);
                if (bottomCell) {
                    bottomCell.shape = shape1;
                    bottomCell.color = color1;
                }
            }
        }

        return { grid, satisfies };
    },

    verifyStatementWithGrid(grid, details) {
        const { shape1, color1, shape2, valueThreshold } = details;

        const belowCells = (cellX) => {
            return grid.filter(c =>
                c.position.col === cellX.position.col &&
                c.position.row === cellX.position.row + 1
            );
        };

        // For each X => must find a Y below with shape2 + number< threshold
        for (const x of grid) {
            if (x.shape === shape1 && x.color === color1) {
                const neighbors = belowCells(x);
                const foundY = neighbors.some(
                    y => y.shape === shape2 && y.number < valueThreshold);
                if (!foundY) return false;
            }
        }
        return true;
    },

    checkIfViolates(grid, details) {
        return !this.verifyStatementWithGrid(grid, details);
    }
};