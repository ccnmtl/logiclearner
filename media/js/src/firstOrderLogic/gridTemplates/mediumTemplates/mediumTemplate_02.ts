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
        .replace(/{color1}/g, details.color1)
        .replace(/{parity}/g, details.parity)
        .replace(/{positionDescription}/g, details.positionDescription);
}

// Generates a random region: “left 2 columns,” etc.
function generateRandomPosition() {
    const direction = getRandomElement(['left', 'right', 'top', 'bottom']);
    const numUnits = randomIntFromInterval(2, Math.floor(gridSize / 2) + 1);
    const dimension = (direction === 'left' || direction === 'right') ? 'columns' : 'rows';
    const positionDescription = `${direction} ${numUnits} ${dimension}`;

    return { direction, numUnits, positionDescription };
}

export const mediumTemplate_02 = {
    generateStatements() {
        const shape1 = getRandomElement(shapes);
        const color1 = getRandomElement(colors);
        const parity = getRandomElement(['odd', 'even']);
        const { direction, numUnits, positionDescription } = generateRandomPosition();

        const colorName = getColorName(color1);

        const details = {
            shape1,
            color1,
            parity,
            direction,
            numUnits,
            positionDescription
        };

        // "All circles with odd values are Red and located in the left 2 columns of the grid."
        const naturalLanguageStatement = replacePlaceholders(
            "All {shape1}s with {parity} values are {color1} and located in the {positionDescription} of the grid.",
            { ...details, color1: colorName }
        );

        // FOL
        // "∀x ((Shape(x,circle) ∧ Odd(Value(x))) → (Color(x,Red) ∧ Location(x,left 2 columns)))"
        const formalFOLStatement = `
        ∀x (
          (Shape(x, ${shape1}) ∧ ${parity === 'odd' ? 'Odd' : 'Even'}(Value(x)))
          → (Color(x, ${colorName}) ∧ Location(x, ${positionDescription}))
        )
      `.trim();

        return { naturalLanguageStatement, formalFOLStatement, details };
    },

    generateGrid(satisfies, details) {
        const grid = Array.from({ length: gridSize * gridSize }, (_, idx) => ({
            shape: getRandomElement(shapes),
            color: getRandomElement(colors),
            number: getRandomElement(numbers),
            position: {
                row: Math.floor(idx / gridSize),
                col: idx % gridSize
            }
        }));

        const { shape1, color1, parity, direction, numUnits } = details;

        const inRegion = (cell) => {
            switch (direction) {
                case 'left':
                    return cell.position.col < numUnits;
                case 'right':
                    return cell.position.col >= gridSize - numUnits;
                case 'top':
                    return cell.position.row < numUnits;
                case 'bottom':
                    return cell.position.row >= gridSize - numUnits;
                default:
                    return false;
            }
        };
        const parityMatches = (val) => parity === 'odd' ? (val % 2 !== 0) : (val % 2 === 0);

        if (satisfies) {
            // Enforce the statement
            grid.forEach(cell => {
                if (cell.shape === shape1 && parityMatches(cell.number)) {
                    // must be color1, must be in region
                    cell.color = color1;
                    if (!inRegion(cell)) {
                        // break the condition so it's not shape1 + parity
                        cell.shape = getRandomElement(shapes.filter(s => s !== shape1));
                    }
                } else {
                    // If it's in region, ensure it doesn't accidentally fulfill shape1+parity => color1
                    if (inRegion(cell)) {
                        if (cell.shape === shape1 && parityMatches(cell.number)) {
                            cell.color = color1;
                        }
                    } else {
                        // outside region => can't have shape1+parity+color1
                        if (cell.shape === shape1 && parityMatches(cell.number) && cell.color === color1) {
                            cell.color = getRandomElement(colors.filter(c => c !== color1));
                        }
                    }
                }
            });
        } else {
            // Partially satisfy, then create violation
            grid.forEach(cell => {
                if (cell.shape === shape1 && parityMatches(cell.number) && inRegion(cell)) {
                    cell.color = color1;
                }
            });
            // Introduce violation
            const violatingCell = grid.find(
                c => c.shape === shape1 && parityMatches(c.number) && inRegion(c) && c.color === color1
            );
            if (violatingCell) {
                // break color
                violatingCell.color = getRandomElement(colors.filter(c => c !== color1));
            }
        }

        return { grid, satisfies };
    },

    verifyStatementWithGrid(grid, details) {
        const { shape1, color1, parity, direction, numUnits } = details;
        const inRegion = (cell) => {
            switch (direction) {
                case 'left':
                    return cell.position.col < numUnits;
                case 'right':
                    return cell.position.col >= gridSize - numUnits;
                case 'top':
                    return cell.position.row < numUnits;
                case 'bottom':
                    return cell.position.row >= gridSize - numUnits;
                default:
                    return false;
            }
        };
        const parityMatches = (val) => parity === 'odd' ? (val % 2 !== 0) : (val % 2 === 0);

        // For all shape1 + parityMatches => must be color1 + inRegion
        return grid.every(cell => {
            if (cell.shape === shape1 && parityMatches(cell.number)) {
                if (cell.color !== color1) return false;
                if (!inRegion(cell)) return false;
            }
            return true;
        });
    },

    checkIfViolates(grid, details) {
        return !this.verifyStatementWithGrid(grid, details);
    }
};