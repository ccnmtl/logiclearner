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
        .replace(/{valueConditionDescription}/g, details.valueConditionDescription);
}

/**
 * Picks a random threshold in [2..6], used for "value < threshold"
 */
function randomValueThreshold() {
    return randomIntFromInterval(2, 6);
}

export const hardTemplate_06 = {
    generateStatements() {
        const shape1 = getRandomElement(shapes);
        const shape2 = getRandomElement(shapes.filter(s => s !== shape1));
        const color1 = getRandomElement(colors);

        const threshold = randomValueThreshold();
        const valueConditionDescription = `with a value less than ${threshold}`;
        const colorName = getColorName(color1);

        const details = {
            shape1,
            shape2,
            color1,
            threshold,
            valueConditionDescription
        };

        // Natural language:
        // "For all shape1 that are color1, there exists shape2 with value<threshold diagonally top-right of it."
        const naturalLanguageStatement = replacePlaceholders(
            "For all {shape1}s that are {color1}, there exists a {shape2} {valueConditionDescription} diagonally top-right of it.",
            { ...details, color1: colorName }
        );

        // FOL example:
        // "∀x( (Shape(x)=s1 ∧ Color(x)=c1) → ∃y( Shape(y)=s2 ∧ Value(y)<threshold ∧ TopRightDiagonalOf(y,x) ) )"
        const formalFOLStatement = `
        ∀x (
          (Shape(x, ${shape1}) ∧ Color(x, ${colorName}))
          → ∃y (Shape(y, ${shape2}) ∧ Value(y) < ${threshold} ∧ TopRightDiagonalOf(y, x))
        )
      `.trim();

        return { naturalLanguageStatement, formalFOLStatement, details };
    },

    generateGrid(satisfies, details) {
        const { shape1, shape2, color1, threshold } = details;
        const grid = Array.from({ length: gridSize * gridSize }, (_, idx) => ({
            shape: getRandomElement(shapes),
            color: getRandomElement(colors),
            number: getRandomElement(numbers),
            position: {
                row: Math.floor(idx / gridSize),
                col: idx % gridSize
            }
        }));

        // Helper: top-right diagonal => row-1, col+1
        function topRightNeighbor(cell) {
            const { row, col } = cell.position;
            return grid.find(
                c => c.position.row === row - 1 && c.position.col === col + 1
            );
        }

        if (satisfies) {
            // For each X= shape1+color1 => ensure top-right neighbor Y with shape2 & number<threshold
            for (const cellX of grid) {
                if (cellX.shape === shape1 && cellX.color === color1) {
                    // if col=4 (last col) or row=0 => no top-right => break X
                    if (cellX.position.row === 0 || cellX.position.col === gridSize - 1) {
                        cellX.color = getRandomElement(colors.filter(c => c !== color1));
                    } else {
                        const diagTR = topRightNeighbor(cellX);
                        if (diagTR) {
                            if (diagTR.shape !== shape2 || diagTR.number >= threshold) {
                                diagTR.shape = shape2;
                                diagTR.number = randomIntFromInterval(1, threshold - 1);
                            }
                        }
                    }
                }
            }
        } else {
            // We want a violation
            // Step 1: partially satisfy
            for (const cellX of grid) {
                if (cellX.shape === shape1 && cellX.color === color1) {
                    if (cellX.position.row > 0 && cellX.position.col < gridSize - 1) {
                        const trCell = topRightNeighbor(cellX);
                        if (trCell) {
                            trCell.shape = shape2;
                            if (trCell.number >= threshold) {
                                trCell.number = randomIntFromInterval(1, threshold - 1);
                            }
                        }
                    }
                }
            }

            // Step 2: find one to break
            const violatingX = grid.find(x => {
                if (x.shape === shape1 && x.color === color1 && x.position.row > 0 && x.position.col < gridSize - 1) {
                    const trCell = topRightNeighbor(x);
                    if (trCell && trCell.shape === shape2 && trCell.number < threshold) {
                        return true;
                    }
                }
                return false;
            });
            if (violatingX) {
                // break adjacency
                const trCell = topRightNeighbor(violatingX);
                if (trCell) {
                    trCell.shape = getRandomElement(shapes.filter(s => s !== shape2));
                }
            } else {
                // fallback: place an X in top row or rightmost col => no diagonal top-right
                const fallbackCell = grid.find(
                    c => c.position.row === 0 || c.position.col === gridSize - 1
                );
                if (fallbackCell) {
                    fallbackCell.shape = shape1;
                    fallbackCell.color = color1;
                }
            }
        }

        return { grid, satisfies };
    },

    verifyStatementWithGrid(grid, details) {
        const { shape1, color1, shape2, threshold } = details;

        function topRightNeighbors(cellX) {
            const { row, col } = cellX.position;
            // Typically 0 or 1 potential neighbor
            return grid.filter(
                c => c.position.row === row - 1 && c.position.col === col + 1
            );
        }

        // For each X => must find Y top-right with shape2 & number < threshold
        for (const x of grid) {
            if (x.shape === shape1 && x.color === color1) {
                const diagCells = topRightNeighbors(x);
                const foundY = diagCells.some(y => y.shape === shape2 && y.number < threshold);
                if (!foundY) return false;
            }
        }
        return true;
    },

    checkIfViolates(grid, details) {
        return !this.verifyStatementWithGrid(grid, details);
    }
};