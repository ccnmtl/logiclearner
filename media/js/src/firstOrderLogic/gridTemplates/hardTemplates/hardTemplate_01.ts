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
    // Example placeholders: {shape1}, {shape2}, {color1},
    // {valueConditionDescription}
    return template
        .replace(/{shape1}/g, details.shape1)
        .replace(/{shape2}/g, details.shape2)
        .replace(/{color1}/g, details.color1)
        .replace(/{valueConditionDescription}/g,
            details.valueConditionDescription);
}

/**
 * Returns a random threshold in [1..5], and a statement like "value > min"
 * or "value greater than min" for the wording.
 */
function randomValueRange() {
    // e.g. pick min in [1..5] for "Value(y) > min"
    const min = randomIntFromInterval(1, 5);
    return min;
}

export const hardTemplate_01 = {
    generateStatements() {
        // shape1, shape2 must be distinct
        const shape1 = getRandomElement(shapes);
        const shape2 = getRandomElement(shapes.filter(s => s !== shape1));
        const color1 = getRandomElement(colors);

        // Pick a threshold
        const valueThreshold = randomValueRange(); // e.g. 3
        const valueConditionDescription =
            `with a value greater than ${valueThreshold}`;

        const colorName = getColorName(color1);

        const details = {
            shape1,
            shape2,
            color1,
            valueThreshold,
            valueConditionDescription
        };

        // Natural language
        // "For all shape1s that are color1, there exists a shape2 with
        // value > threshold directly to the right."
        const naturalLanguageStatement = replacePlaceholders(
            'For all {shape1}s that are {color1}, there exists a {shape2} '
            + '{valueConditionDescription} directly to the right of it.',
            { ...details, color1: colorName }
        );

        // FOL: ∀x((shape(x)=shape1 ∧ color(x)=color1) → ∃y(shape(y)=shape2
        // ∧ value(y)>threshold ∧ RightOf(y,x)))
        const formalFOLStatement = `
        ∀x (
          (Shape(x, ${shape1}) ∧ Color(x, ${colorName}))
          → ∃y (
            Shape(y, ${shape2}) ∧ Value(y) > ${valueThreshold} ∧ RightOf(y, x)
          )
        )
      `.trim();

        return { naturalLanguageStatement, formalFOLStatement, details };
    },

    generateGrid(satisfies, details) {
        const { shape1, shape2, color1, valueThreshold } = details;

        // Build random 5x5
        const grid = Array.from({ length: gridSize * gridSize }, (_, i) => ({
            shape: getRandomElement(shapes),
            color: getRandomElement(colors),
            number: getRandomElement(numbers), // [1..10]
            position: {
                row: Math.floor(i / gridSize),
                col: i % gridSize
            }
        }));

        // Helper: returns the cell directly to the right of x (if any)
        const cellToRight = (cellX) => {
            const { row, col } = cellX.position;
            return grid.find(c => c.position.row === row
                && c.position.col === col + 1);
        };

        if (satisfies) {
            // We want: for every X that is shape1+color1, ∃ Y to its right
            // that is shape2 and number>valueThreshold.
            // If X is in col=4 (last column), we cannot find a right neighbor,
            // so we must fix X so it doesn’t match shape1+color1.

            grid.forEach(cellX => {
                if (cellX.shape === shape1 && cellX.color === color1) {
                    // If it's in last column, break X
                    if (cellX.position.col === gridSize - 1) {
                        // remove from "X" condition: e.g. change color
                        cellX.color = getRandomElement(
                            colors.filter(c => c !== color1));
                    } else {
                        // Ensure there's a suitable Y
                        const theRight = cellToRight(cellX);
                        // If theRight doesn’t meet shape2 + number>threshold,
                        // fix it
                        // eslint-disable-next-line max-len
                        if (!theRight) return; // theoretically won't happen except col=4
                        if (theRight.shape !== shape2
                            || theRight.number <= valueThreshold) {
                            theRight.shape = shape2;
                            theRight.number = randomIntFromInterval(
                                valueThreshold + 1, 10);
                            // color can be anything as it's not
                            // relevant to the statement
                        }
                    }
                }
            });
        } else {
            // We want at least one violation. That means at least one
            // X (shape1+color1) that does NOT have a suitable Y to the right
            // Step 1: partially satisfy
            grid.forEach(cellX => {
                if (cellX.shape === shape1 && cellX.color === color1
                    && cellX.position.col < gridSize - 1) {
                    const rightCell = cellToRight(cellX);
                    if (rightCell) {
                        // make that cell shape2 + number>threshold to
                        // "correctly" satisfy
                        rightCell.shape = shape2;
                        if (rightCell.number <= valueThreshold) {
                            rightCell.number = randomIntFromInterval(
                                valueThreshold + 1, 10);
                        }
                    }
                }
            });

            // Step 2: pick at least one valid X and break its adjacency
            const violatingX = grid.find(cellX => {
                if (cellX.shape === shape1 && cellX.color === color1
                    && cellX.position.col < gridSize - 1) {
                    const rightCell = cellToRight(cellX);
                    if (rightCell && rightCell.shape === shape2
                        && rightCell.number > valueThreshold) {
                        return true;
                    }
                    return false;
                }
                return false;
            });

            if (violatingX) {
                // break the adjacency: e.g. modify the right cell's shape
                //  so it no longer meets shape2
                const rightCell = cellToRight(violatingX);
                if (rightCell) {
                    rightCell.shape = getRandomElement(shapes.filter(
                        s => s !== shape2));
                }
            } else {
                // If we didn't find such an X, we can also break an X in the
                // last column by making sure it's shape1+color1
                // This ensures there's no right neighbor. That alone is a
                // violation because "∃y to the right" can't be satisfied.
                const cellInLastCol = grid.find(
                    c => c.position.col === gridSize - 1
                );
                if (cellInLastCol) {
                    cellInLastCol.shape = shape1;
                    cellInLastCol.color = color1;
                }
            }
        }

        return { grid, satisfies };
    },

    verifyStatementWithGrid(grid, details) {
        const { shape1, color1, shape2, valueThreshold } = details;

        // For every X that is shape1+color1, there must exist a Y to the right
        // with shape2 & number>threshold
        const cellToRight = (cellX) => {
            const { row, col } = cellX.position;
            return grid.filter(c => c.position.row === row
                && c.position.col === col + 1);
        };

        // Check each X
        for (const cellX of grid) {
            if (cellX.shape === shape1 && cellX.color === color1) {
                const neighbors = cellToRight(cellX);
                // We need at least 1 neighbor Y fulfilling shape2
                //  + number>threshold
                const foundY = neighbors.some(y => y.shape === shape2
                    && y.number > valueThreshold);
                if (!foundY) return false;
            }
        }
        return true;
    },

    checkIfViolates(grid, details) {
        return !this.verifyStatementWithGrid(grid, details);
    }
};