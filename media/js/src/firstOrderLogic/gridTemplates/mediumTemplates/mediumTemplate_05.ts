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
 * Replace placeholders in the statement text:
 *   - {shape1}, {color1}, {positionDescription}
 */
function replacePlaceholders(template, details) {
    return template
        .replace(/{shape1}/g, details.shape1)
        .replace(/{color1}/g, details.color1)
        .replace(/{positionDescription}/g, details.positionDescription);
}

/**
 * Create a random "region" description like "left 2 columns" or "bottom 3 rows."
 */
function generateRandomPosition() {
    const direction = getRandomElement(['left', 'right', 'top', 'bottom']);
    const numUnits = randomIntFromInterval(2, Math.floor(gridSize / 2) + 1);
    const dimension = (direction === 'left' || direction === 'right') ? 'columns' : 'rows';
    const positionDescription = `${direction} ${numUnits} ${dimension}`;
    return { direction, numUnits, positionDescription };
}

/**
 * Check if a number is prime in the [1..10] range.
 */
function isPrime(n) {
    // Quick prime check for small n
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    for (let i = 3; i <= Math.sqrt(n); i += 2) {
        if (n % i === 0) return false;
    }
    return true;
}

export const mediumTemplate_05 = {
    generateStatements() {
        const shape1 = getRandomElement(shapes);
        const color1 = getRandomElement(colors);
        const { direction, numUnits, positionDescription } = generateRandomPosition();

        const colorName = getColorName(color1);

        const details = {
            shape1,
            color1,
            direction,
            numUnits,
            positionDescription
        };

        // e.g. "All circles with prime values are Red and located in the left 2 columns of the grid."
        const naturalLanguageStatement = replacePlaceholders(
            "All {shape1}s with prime values are {color1} and located in the {positionDescription} of the grid.",
            { ...details, color1: colorName }
        );

        // FOL: "∀x ((Shape(x, shape1) ∧ Prime(Value(x))) → (Color(x, colorName) ∧ Location(x, region)))"
        const formalFOLStatement = `
        ∀x (
          (Shape(x, ${shape1}) ∧ Prime(Value(x)))
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

        const { shape1, color1, direction, numUnits } = details;

        function inRegion(cell) {
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
        }

        if (satisfies) {
            // Ensure shape1 + prime => color1 + region
            grid.forEach(cell => {
                if (cell.shape === shape1 && isPrime(cell.number)) {
                    // must be color1 + in region
                    cell.color = color1;
                    if (!inRegion(cell)) {
                        // break the condition so it's not shape1+prime anymore
                        cell.shape = getRandomElement(shapes.filter(s => s !== shape1));
                    }
                } else {
                    // if in region, ensure no accidental partial match
                    if (inRegion(cell)) {
                        // If shape1+prime => color1
                        if (cell.shape === shape1 && isPrime(cell.number)) {
                            cell.color = color1;
                        }
                    } else {
                        // outside region => can't have shape1+prime+color1
                        if (cell.shape === shape1 && isPrime(cell.number) && cell.color === color1) {
                            cell.color = getRandomElement(colors.filter(c => c !== color1));
                        }
                    }
                }
            });
        } else {
            // partially satisfy
            grid.forEach(cell => {
                if (cell.shape === shape1 && isPrime(cell.number) && inRegion(cell)) {
                    cell.color = color1;
                }
            });
            // then introduce violation
            const violatingCell = grid.find(
                c => c.shape === shape1 && isPrime(c.number) && inRegion(c) && c.color === color1
            );
            if (violatingCell) {
                violatingCell.color = getRandomElement(colors.filter(cc => cc !== color1));
            }
        }

        return { grid, satisfies };
    },

    verifyStatementWithGrid(grid, details) {
        const { shape1, color1, direction, numUnits } = details;

        function inRegion(cell) {
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
        }

        // For all shape1 with prime -> must be color1 + inRegion
        return grid.every(cell => {
            if (cell.shape === shape1 && isPrime(cell.number)) {
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