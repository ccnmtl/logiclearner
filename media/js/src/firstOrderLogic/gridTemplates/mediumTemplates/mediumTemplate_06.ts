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
        .replace(/{factor}/g, details.factor)
        .replace(/{positionDescription}/g, details.positionDescription);
}

function generateRandomPosition() {
    const direction = getRandomElement(['left', 'right', 'top', 'bottom']);
    const numUnits = randomIntFromInterval(2, Math.floor(gridSize / 2) + 1);
    const dimension =
        (direction === 'left' || direction === 'right') ? 'columns' : 'rows';
    const positionDescription = `${direction} ${numUnits} ${dimension}`;
    return { direction, numUnits, positionDescription };
}

/**
 * Check if a number is a multiple of 'factor'.
 */
function isMultiple(value, factor) {
    return (value % factor === 0);
}

export const mediumTemplate_06 = {
    generateStatements() {
        const shape1 = getRandomElement(shapes);
        const color1 = getRandomElement(colors);
        // pick factor in [2..3]
        const factor = randomIntFromInterval(2, 3);

        const { direction, numUnits,
            positionDescription } = generateRandomPosition();
        const colorName = getColorName(color1);

        const details = {
            shape1,
            color1,
            factor,
            direction,
            numUnits,
            positionDescription
        };

        // e.g. "All squares with multiples of 2 are Red and located in the
        //  top 2 rows of the grid."
        const naturalLanguageStatement = replacePlaceholders(
            'All {shape1}s with values that are multiples of {factor} are '
            + '{color1} and located in the {positionDescription} of the grid.',
            { ...details, color1: colorName }
        );

        // FOL:
        // "∀x ((Shape(x, shape1) ∧ (Value(x) mod factor = 0)) →
        //   (Color(x, colorName) ∧ Location(x, position)))"
        const formalFOLStatement = `
        ∀x (
          (Shape(x, ${shape1}) ∧ MultipleOf(Value(x), ${factor}))
          → (Color(x, ${colorName}) ∧ Location(x, ${positionDescription}))
        )
      `.trim();

        return { naturalLanguageStatement, formalFOLStatement, details };
    },

    generateGrid(satisfies, details) {
        const grid = Array.from({ length: gridSize * gridSize }, (_, idx) => ({
            shape: getRandomElement(shapes),
            color: getRandomElement(colors),
            number: getRandomElement(numbers), // 1..10
            position: {
                row: Math.floor(idx / gridSize),
                col: idx % gridSize
            }
        }));

        const { shape1, color1, factor, direction, numUnits } = details;

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
            grid.forEach(cell => {
                if (cell.shape === shape1 && isMultiple(cell.number, factor)) {
                    // must be color1 + in region
                    cell.color = color1;
                    if (!inRegion(cell)) {
                        // break shape or number so it no longer
                        // meets shape1+multiple
                        cell.shape = getRandomElement(
                            shapes.filter(s => s !== shape1));
                    }
                } else {
                    // if inside region, avoid accidental matching
                    if (inRegion(cell)) {
                        if (cell.shape === shape1 && isMultiple(
                            cell.number, factor)) {
                            cell.color = color1;
                        }
                    } else {
                        // outside region => can't have shape1+multiple+color1
                        if (cell.shape === shape1 && isMultiple(
                            cell.number, factor) && cell.color === color1) {
                            cell.color = getRandomElement(
                                colors.filter(c => c !== color1));
                        }
                    }
                }
            });
        } else {
            // partially satisfy
            grid.forEach(cell => {
                if (cell.shape === shape1 && isMultiple(
                    cell.number, factor) && inRegion(cell)) {
                    cell.color = color1;
                }
            });
            // introduce violation
            const violatingCell = grid.find(
                c => c.shape === shape1 && isMultiple(
                    c.number, factor) && inRegion(c) && c.color === color1
            );
            if (violatingCell) {
                violatingCell.color = getRandomElement(
                    colors.filter(cc => cc !== color1));
            }
        }

        return { grid, satisfies };
    },

    verifyStatementWithGrid(grid, details) {
        const { shape1, color1, factor, direction, numUnits } = details;

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

        // For all shape1 + multiple => color1 + inRegion
        return grid.every(cell => {
            if (cell.shape === shape1 && isMultiple(cell.number, factor)) {
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