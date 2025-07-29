import {
    getColorName,
    getRandomElement,
    randomIntFromInterval,
    gridSize,
    shapes,
    colors,
    numbers
} from '../../utils';

/**
 * Replace placeholders in the statement text, such as {shape1}, {shape2}, {color1}, {valueConditionDescription}
 */
function replacePlaceholders(template, details) {
    return template
        .replace(/{shape1}/g, details.shape1)
        .replace(/{shape2}/g, details.shape2)
        .replace(/{color1}/g, details.color1)
        .replace(/{valueConditionDescription}/g, details.valueConditionDescription);
}

/**
 * Chooses a random threshold in [1..5], used for ">= threshold"
 */
function randomValueThreshold() {
    return randomIntFromInterval(1, 5);
}

export const hardTemplate_05 = {
    generateStatements() {
        const shape1 = getRandomElement(shapes);
        const shape2 = getRandomElement(shapes.filter(s => s !== shape1));
        const color1 = getRandomElement(colors);

        const threshold = randomValueThreshold(); // e.g. 3
        const valueConditionDescription = `with a value greater than or equal to ${threshold}`;
        const colorName = getColorName(color1);

        const details = {
            shape1,
            shape2,
            color1,
            threshold,
            valueConditionDescription
        };

        // Natural language example:
        // "For all shape1s that are color1, there exists a shape2 with a value >= threshold diagonally top-left of it."
        const naturalLanguageStatement = replacePlaceholders(
            "For all {shape1}s that are {color1}, there exists a {shape2} {valueConditionDescription} diagonally top-left of it.",
            { ...details, color1: colorName }
        );

        // Formal FOL example:
        // "∀x( (Shape(x)=shape1 ∧ Color(x)=color1) → ∃y( Shape(y)=shape2 ∧ Value(y)>= threshold ∧ DiagTopLeft(y,x) ) )"
        const formalFOLStatement = `
        ∀x (
          (Shape(x, ${shape1}) ∧ Color(x, ${colorName}))
          → ∃y (Shape(y, ${shape2}) ∧ Value(y) ≥ ${threshold} ∧ TopLeftOf(y, x))
        )
      `.trim();

        return { naturalLanguageStatement, formalFOLStatement, details };
    },

    generateGrid(satisfies, details) {
        const { shape1, shape2, color1, threshold } = details;
        const grid = Array.from({ length: gridSize * gridSize }, (_, idx) => ({
            shape: getRandomElement(shapes),
            color: getRandomElement(colors),
            number: getRandomElement(numbers), // 1..10
            position: {
                row: Math.floor(idx / gridSize),
                col: idx % gridSize
            }
        }));

        // A helper: return the cell that is row(X)-1, col(X)-1
        function topLeftNeighbor(cell) {
            const { row, col } = cell.position;
            return grid.find(
                c => c.position.row === row - 1 && c.position.col === col - 1
            );
        }

        if (satisfies) {
            // For each X= shape1+color1, ensure there is a suitable Y diagonally top-left
            // If X is in row=0 or col=0, we can't place a top-left neighbor => must break X
            for (const cellX of grid) {
                if (cellX.shape === shape1 && cellX.color === color1) {
                    if (cellX.position.row === 0 || cellX.position.col === 0) {
                        // No diagonal top-left => remove X from condition
                        cellX.color = getRandomElement(colors.filter(c => c !== color1));
                    } else {
                        // Fix the top-left cell
                        const diagCell = topLeftNeighbor(cellX);
                        if (diagCell) {
                            if (diagCell.shape !== shape2 || diagCell.number < threshold) {
                                diagCell.shape = shape2;
                                diagCell.number = randomIntFromInterval(threshold, 10);
                            }
                        }
                    }
                }
            }
        } else {
            // We want at least one violation
            // Step 1: partially satisfy
            for (const cellX of grid) {
                if (cellX.shape === shape1 && cellX.color === color1) {
                    if (cellX.position.row > 0 && cellX.position.col > 0) {
                        const diagCell = topLeftNeighbor(cellX);
                        if (diagCell) {
                            diagCell.shape = shape2;
                            if (diagCell.number < threshold) {
                                diagCell.number = randomIntFromInterval(threshold, 10);
                            }
                        }
                    }
                }
            }
            // Step 2: create violation
            const violatingX = grid.find(x => {
                if (x.shape === shape1 && x.color === color1 && x.position.row > 0 && x.position.col > 0) {
                    const diagCell = topLeftNeighbor(x);
                    if (diagCell && diagCell.shape === shape2 && diagCell.number >= threshold) {
                        return true; // can break it
                    }
                }
                return false;
            });
            if (violatingX) {
                // break adjacency
                const diagCell = topLeftNeighbor(violatingX);
                if (diagCell) {
                    diagCell.shape = getRandomElement(shapes.filter(s => s !== shape2));
                }
            } else {
                // fallback: place an X in the top/left corner => no top-left neighbor
                const topLeftCornerCell = grid.find(c => c.position.row === 0 && c.position.col === 0);
                if (topLeftCornerCell) {
                    topLeftCornerCell.shape = shape1;
                    topLeftCornerCell.color = color1;
                }
            }
        }

        return { grid, satisfies };
    },

    verifyStatementWithGrid(grid, details) {
        const { shape1, color1, shape2, threshold } = details;
        function topLeftNeighbors(cellX) {
            // Might return 0 or 1 cell in a 5x5
            const rowNeeded = cellX.position.row - 1;
            const colNeeded = cellX.position.col - 1;
            return grid.filter(c => c.position.row === rowNeeded && c.position.col === colNeeded);
        }

        // For each X => must find Y with shape2 & number>= threshold diagonally top-left
        for (const x of grid) {
            if (x.shape === shape1 && x.color === color1) {
                const diagCells = topLeftNeighbors(x);
                const foundY = diagCells.some(y => y.shape === shape2 && y.number >= threshold);
                if (!foundY) return false;
            }
        }
        return true;
    },

    checkIfViolates(grid, details) {
        return !this.verifyStatementWithGrid(grid, details);
    }
};