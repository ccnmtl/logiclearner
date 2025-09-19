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
    // e.g. pick some "max" in [6..10]
    const max = randomIntFromInterval(6, 10);
    return max;
}

export const hardTemplate_02 = {
    generateStatements() {
        const shape1 = getRandomElement(shapes);
        const shape2 = getRandomElement(shapes.filter(s => s !== shape1));
        const color1 = getRandomElement(colors);

        const valueThreshold = randomValueRange(); // e.g. 8
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

        // "For all shape1s that are color1, there exists shape2 with
        // value < threshold directly to the left of it."
        const naturalLanguageStatement = replacePlaceholders(
            'For all {shape1}s that are {color1}, there exists a {shape2} ' +
            '{valueConditionDescription} directly to the left of it.',
            { ...details, color1: colorName }
        );

        const formalFOLStatement = `∀x ((Shape(x, ${shape1}) ∧ 
            Color(x, ${colorName})) → ∃y (Shape(y, ${shape2}) ∧ 
            Value(y) < ${valueThreshold} ∧ Adjacency(y, LeftOf, x)))`.trim();

        return { naturalLanguageStatement, formalFOLStatement, details };
    },

    generateGrid(satisfies, details) {
        const { shape1, shape2, color1, valueThreshold } = details;

        // Build random grid
        const grid = Array.from({ length: gridSize * gridSize }, (_, i) => ({
            shape: getRandomElement(shapes),
            color: getRandomElement(colors),
            number: getRandomElement(numbers),
            position: {
                row: Math.floor(i / gridSize),
                col: i % gridSize
            }
        }));

        const cellToLeft = (cellX) => {
            const { row, col } = cellX.position;
            return grid.find(c => c.position.row === row
                && c.position.col === col - 1);
        };

        if (satisfies) {
            grid.forEach(cellX => {
                if (cellX.shape === shape1 && cellX.color === color1) {
                    // If col=0, no left neighbor => must fix X
                    // to not be shape1+color1
                    if (cellX.position.col === 0) {
                        cellX.color = getRandomElement(colors.filter(
                            c => c !== color1));
                    } else {
                        // ensure left cell has shape2 + number< valueThreshold
                        const leftCell = cellToLeft(cellX);
                        if (!leftCell) return;
                        if (leftCell.shape !== shape2
                            || leftCell.number >= valueThreshold) {
                            leftCell.shape = shape2;
                            leftCell.number = randomIntFromInterval(
                                1, valueThreshold - 1);
                            // color can be anything
                        }
                    }
                }
            });
        } else {
            // Partially satisfy
            grid.forEach(cellX => {
                if (cellX.shape === shape1 && cellX.color === color1
                    && cellX.position.col > 0) {
                    const lCell = cellToLeft(cellX);
                    if (lCell) {
                        lCell.shape = shape2;
                        if (lCell.number >= valueThreshold) {
                            lCell.number = randomIntFromInterval(
                                1, valueThreshold - 1);
                        }
                    }
                }
            });
            // Create violation
            const violatingX = grid.find(cellX => {
                if (cellX.shape === shape1 && cellX.color === color1
                    && cellX.position.col > 0) {
                    const lCell = cellToLeft(cellX);
                    if (lCell && lCell.shape === shape2
                        && lCell.number < valueThreshold) {
                        return true;
                    }
                }
                return false;
            });

            if (violatingX) {
                // break the adjacency
                const lCell = cellToLeft(violatingX);
                if (lCell) {
                    // e.g. change shape
                    lCell.shape = getRandomElement(
                        shapes.filter(s => s !== shape2));
                }
            } else {
                // fallback: put an X in col=0 => guaranteed no left neighbor
                const cellInFirstCol = grid.find(c => c.position.col === 0);
                if (cellInFirstCol) {
                    cellInFirstCol.shape = shape1;
                    cellInFirstCol.color = color1;
                }
            }
        }

        return { grid, satisfies };
    },

    verifyStatementWithGrid(grid, details) {
        const { shape1, color1, shape2, valueThreshold } = details;

        const cellToLeft = (cellX) => {
            const { row, col } = cellX.position;
            return grid.filter(c => c.position.row === row
                && c.position.col === col - 1);
        };

        // For each X with shape1+color1 => must have a Y to the left with
        //  shape2+ number< threshold
        for (const cellX of grid) {
            if (cellX.shape === shape1 && cellX.color === color1) {
                const neighbors = cellToLeft(cellX);
                // at least one neighbor meets shape2+ number< threshold
                const foundY = neighbors.some(y => y.shape === shape2
                    && y.number < valueThreshold);
                if (!foundY) return false;
            }
        }
        return true;
    },

    checkIfViolates(grid, details) {
        return !this.verifyStatementWithGrid(grid, details);
    }
};