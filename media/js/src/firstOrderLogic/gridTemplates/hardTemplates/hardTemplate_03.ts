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
    // pick a threshold for "value >= threshold" in [1..5]
    const min = randomIntFromInterval(1, 5);
    return min;
}

export const hardTemplate_03 = {
    generateStatements() {
        const shape1 = getRandomElement(shapes);
        const shape2 = getRandomElement(shapes.filter(s => s !== shape1));
        const color1 = getRandomElement(colors);

        const valueThreshold = randomValueRange();
        const valueConditionDescription =
            `with a value greater than or equal to ${valueThreshold}`;
        const colorName = getColorName(color1);

        const details = {
            shape1,
            shape2,
            color1,
            valueThreshold,
            valueConditionDescription
        };

        // Natural language
        // "For all shape1 that are color1, there exists shape2 with
        // value>= threshold directly above it."
        const naturalLanguageStatement = replacePlaceholders(
            'For all {shape1}s that are {color1}, there exists a '
            + '{shape2} {valueConditionDescription} directly above it.',
            { ...details, color1: colorName }
        );
        const formalFOLStatement = `∀x ((Shape(x, ${shape1}) ∧ 
            Color(x, ${colorName})) → ∃y (Shape(y, ${shape2}) ∧ 
            Value(y) ≥ ${valueThreshold} ∧ Adjacency(y, Above, x)))`.trim();

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

        // cellAbove(x): the cell that is row-1, same col
        const cellAbove = (cellX) => {
            const { row, col } = cellX.position;
            return grid.find(c => c.position.col === col
                && c.position.row === row - 1);
        };

        if (satisfies) {
            // for each X that is shape1+color1, ensure there's a Y above
            //  with shape2 + number>= threshold
            grid.forEach(cellX => {
                if (cellX.shape === shape1 && cellX.color === color1) {
                    if (cellX.position.row === 0) {
                        // no cell above => must break X
                        cellX.color = getRandomElement(
                            colors.filter(c => c !== color1));
                    } else {
                        const aboveCell = cellAbove(cellX);
                        if (aboveCell) {
                            if (aboveCell.shape !== shape2
                                || aboveCell.number < valueThreshold) {
                                aboveCell.shape = shape2;
                                aboveCell.number = randomIntFromInterval(
                                    valueThreshold, 10);
                            }
                        }
                    }
                }
            });
        } else {
            // partially satisfy
            grid.forEach(cellX => {
                if (cellX.shape === shape1 && cellX.color === color1
                    && cellX.position.row > 0) {
                    const aCell = cellAbove(cellX);
                    if (aCell) {
                        aCell.shape = shape2;
                        if (aCell.number < valueThreshold) {
                            aCell.number = randomIntFromInterval(
                                valueThreshold, 10);
                        }
                    }
                }
            });

            // introduce violation
            const violatingX = grid.find(cellX => {
                if (cellX.shape === shape1 && cellX.color === color1
                    && cellX.position.row > 0) {
                    const aCell = cellAbove(cellX);
                    if (aCell && aCell.shape === shape2
                        && aCell.number >= valueThreshold) {
                        return true;
                    }
                }
                return false;
            });
            if (violatingX) {
                // break adjacency
                const aCell = cellAbove(violatingX);
                if (aCell) {
                    aCell.shape = getRandomElement(
                        shapes.filter(s => s !== shape2));
                }
            } else {
                // fallback: place an X in row=0 => no above cell => violation
                const topCell = grid.find(c => c.position.row === 0);
                if (topCell) {
                    topCell.shape = shape1;
                    topCell.color = color1;
                }
            }
        }

        return { grid, satisfies };
    },

    verifyStatementWithGrid(grid, details) {
        const { shape1, color1, shape2, valueThreshold } = details;

        const aboveCells = (cellX) => {
            // could be multiple if we consider row-1? Typically just 1 cell
            return grid.filter(c =>
                c.position.col === cellX.position.col &&
                c.position.row === cellX.position.row - 1
            );
        };

        // For each X => must find a Y above with shape2+ number>= threshold
        for (const x of grid) {
            if (x.shape === shape1 && x.color === color1) {
                // find a cell in row-1, same col
                const asAbove = aboveCells(x);
                const foundY = asAbove.some(y => y.shape === shape2
                    && y.number >= valueThreshold);
                if (!foundY) return false;
            }
        }
        return true;
    },

    checkIfViolates(grid, details) {
        return !this.verifyStatementWithGrid(grid, details);
    }
};