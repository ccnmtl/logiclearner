import {
    getColorName,
    getRandomElement,
    randomIntFromInterval,
    gridSize,
    shapes,
    colors,
    numbers
} from '../../utils';

// Utility function to fill placeholders in the statement text
function replacePlaceholders(template, details) {
    return template
        .replace(/{shape1}/g, details.shape1)
        .replace(/{color1}/g, details.color1)
        .replace(/{numberThreshold}/g, details.numberThreshold)
        .replace(
            /{condition}/g,
            details.condition === 'greater' ? 'greater than' : 'less than'
        )
        .replace(/{positionDescription}/g, details.positionDescription);
}

// Generate a random position region
function generateRandomPosition() {
    // direction in {left, right, top, bottom}
    const direction = getRandomElement(['left', 'right', 'top', 'bottom']);
    // randomly pick how many columns/rows form that region (2..(gridSize/2+1))
    const numUnits = randomIntFromInterval(2, Math.floor(gridSize / 2) + 1);

    // e.g. "left 2 columns" or "bottom 3 rows"
    const isHorizontal = (direction === 'left' || direction === 'right');
    const dimension = isHorizontal ? 'columns' : 'rows';
    const positionDescription = `${direction} ${numUnits} ${dimension}`;

    return { direction, numUnits, positionDescription };
}

export const mediumTemplate_01 = {
    generateStatements() {
        const shape1 = getRandomElement(shapes);
        const color1 = getRandomElement(colors);
        // either "greater" or "less"
        const condition = getRandomElement(['greater', 'less']);
        // pick a threshold in [5..9]
        const numberThreshold = randomIntFromInterval(5, 9);

        const { direction,
            numUnits,
            positionDescription } = generateRandomPosition();

        const colorName = getColorName(color1);

        const details = {
            shape1,
            color1,
            condition,
            numberThreshold,
            direction,
            numUnits,
            positionDescription
        };

        // Example Natural Language:
        // "All circles with value greater than 6 are Red and located
        //  in the left 2 columns of the grid."
        const naturalLanguageStatement = replacePlaceholders(
            // eslint-disable-next-line max-len
            'All {shape1}s with value {condition} {numberThreshold} are {color1} and located in the {positionDescription} of the grid.',
            { ...details, color1: colorName }
        );

        // FOL statement:
        // "∀x ((Shape(x, shape1) ∧ Value(x) > threshold) →
        // (Color(x, colorName) ∧ Location(x, region)))"
        // The "Location" part is conceptual/pedagogical,
        // as your puzzle uses grid-based checks.
        const formalFOLStatement = `
        ∀x (
          (Shape(x, ${shape1}) ∧ 
           Value(x) ${condition === 'greater' ? '>' : '<'} ${numberThreshold})
          → (Color(x, ${colorName}) ∧ 
             Location(x, ${positionDescription}))
        )
      `.trim();

        return { naturalLanguageStatement, formalFOLStatement, details };
    },

    generateGrid(satisfies, details) {
        // Build random 5x5
        const grid = Array.from(
            { length: gridSize * gridSize },
            (_, index) => ({
                shape: getRandomElement(shapes),
                color: getRandomElement(colors),
                number: getRandomElement(numbers),
                position: {
                    row: Math.floor(index / gridSize),
                    col: index % gridSize
                }
            })
        );

        const {
            direction,
            numUnits,
            color1,
            shape1,
            condition,
            numberThreshold
        } = details;

        // Helper to see if a cell is "in the region"
        const inRegion = (cell) => {
            switch (direction) {
                case 'left':
                    return cell.position.col < numUnits;
                case 'right':
                    return cell.position.col >= (gridSize - numUnits);
                case 'top':
                    return cell.position.row < numUnits;
                case 'bottom':
                    return cell.position.row >= (gridSize - numUnits);
                default:
                    return false;
            }
        };

        // Helper to see if number passes the "condition" ( > or < threshold )
        const valueMatches = (cell) => {
            return (condition === 'greater')
                ? (cell.number > numberThreshold)
                : (cell.number < numberThreshold);
        };

        if (satisfies) {
            // Make sure that if cell.shape==shape1 & valueMatches(cell),
            // then it's color1 and in region.
            // Also ensure that outside the region or with different
            // shapes/values wedon't accidentally form partial matches.

            grid.forEach(cell => {
                // If a cell meets shape1 + value condition, enforce
                // color + region
                if (cell.shape === shape1 && valueMatches(cell)) {
                    cell.color = color1;
                    // If it's not in the region, forcibly move it into region
                    // or fix attributes
                    if (!inRegion(cell)) {
                        // best approach: either move it or break the condition
                        // We'll break the condition so it no longer meets
                        // "shape1 + value condition"
                        // i.e. change shape or number
                        cell.shape = getRandomElement(
                            shapes.filter(s => s !== shape1));
                    }
                } else {
                    // If this cell is in the region, we want to ensure it
                    // doesn'taccidentally fulfill shape+value
                    if (inRegion(cell)) {
                        // If it "would" meet shape1+value condition, fix it
                        if (cell.shape === shape1 && valueMatches(cell)) {
                            // eslint-disable-next-line max-len
                            cell.color = color1; // that’s consistent with the statement
                        }
                    } else {
                        // outside region → cannot match shape1+value with
                        //  color1
                        if (
                            cell.shape === shape1 &&
                            valueMatches(cell) &&
                            cell.color === color1
                        ) {
                            // break it by changing color or shape or number
                            cell.color = getRandomElement(
                                colors.filter(c => c !== color1));
                        }
                    }
                }
            });

        } else {
            // We want at least one violation: find a cell that "should" meet
            // shape+value => color+region, but break it.

            // Step 1: partially try to satisfy the statement to create
            // potential correct cells
            grid.forEach(cell => {
                if (
                    cell.shape === shape1 &&
                    valueMatches(cell) &&
                    inRegion(cell)
                ) {
                    cell.color = color1;
                }
            });

            // Step 2: Introduce a violation
            // For at least one cell that "ought to" be color1 & inRegion, we do
            // something to break it.
            const target = grid.find(cell =>
                cell.shape === shape1 &&
                valueMatches(cell) &&
                inRegion(cell) &&
                (cell.color === color1)
            );
            if (target) {
                // break it: e.g. change color to something else
                target.color = getRandomElement(
                    colors.filter(c => c !== color1));
            }
        }

        return { grid, satisfies };
    },

    verifyStatementWithGrid(grid, details) {
        const {
            direction,
            numUnits,
            shape1,
            color1,
            condition,
            numberThreshold
        } = details;

        const inRegion = (cell) => {
            switch (direction) {
                case 'left':
                    return cell.position.col < numUnits;
                case 'right':
                    return cell.position.col >= (gridSize - numUnits);
                case 'top':
                    return cell.position.row < numUnits;
                case 'bottom':
                    return cell.position.row >= (gridSize - numUnits);
                default:
                    return false;
            }
        };
        const valueMatches = (cell) => {
            return (condition === 'greater')
                ? (cell.number > numberThreshold)
                : (cell.number < numberThreshold);
        };

        // “For all cells that are shape1 & meet the value condition,
        // they must be color1 & in the region. Also, outside region shouldn't
        // incorrectly have color1 if shape1+valueMatches”
        return grid.every(cell => {
            if (cell.shape === shape1 && valueMatches(cell)) {
                // Must be color1 and inRegion
                if (cell.color !== color1) return false;
                if (!inRegion(cell)) return false;
            }
            // If a cell is shape1 + valueMatches + color1 but NOT
            // inRegion => violation
            // The same test is covered by the above “not in region => false”

            return true;
        });
    },

    checkIfViolates(grid, details) {
        return !this.verifyStatementWithGrid(grid, details);
    }
};