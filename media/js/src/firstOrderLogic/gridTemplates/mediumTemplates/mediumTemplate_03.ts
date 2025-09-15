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
        .replace(/{minValue}/g, details.minValue)
        .replace(/{maxValue}/g, details.maxValue)
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

export const mediumTemplate_03 = {
    generateStatements() {
        const shape1 = getRandomElement(shapes);
        const color1 = getRandomElement(colors);
        // pick range [3..5] up to [6..9]
        const minValue = randomIntFromInterval(3, 5);
        const maxValue = randomIntFromInterval(6, 9);
        const { direction, numUnits,
            positionDescription } = generateRandomPosition();

        const colorName = getColorName(color1);

        const details = {
            shape1,
            color1,
            minValue,
            maxValue,
            direction,
            numUnits,
            positionDescription
        };

        const naturalLanguageStatement = replacePlaceholders(
            'All {shape1}s with values between {minValue} and {maxValue} are '
            + '{color1} and located in the {positionDescription} of the grid.',
            { ...details, color1: colorName }
        );
        const formalFOLStatement = `
        ∀x (
          (Shape(x, ${shape1}) ∧ Value(x) ≥ ${minValue} ∧ 
           Value(x) ≤ ${maxValue})
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

        const { shape1, color1, minValue,
            maxValue, direction, numUnits } = details;

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
        const valueMatches = (n) => (n >= minValue && n <= maxValue);

        if (satisfies) {
            grid.forEach(cell => {
                if (cell.shape === shape1 && valueMatches(cell.number)) {
                    // must be color1 and in region
                    cell.color = color1;
                    if (!inRegion(cell)) {
                        // break the condition so it's not shape1 + valueMatches
                        cell.shape = getRandomElement(
                            shapes.filter(s => s !== shape1));
                    }
                } else {
                    // if in region, ensure no accidental partial match
                    if (inRegion(cell)) {
                        if (cell.shape === shape1
                            && valueMatches(cell.number)) {
                            cell.color = color1;
                        }
                    } else {
                        // outside region => can't have shape1
                        // + valueMatches + color1
                        if (cell.shape === shape1 && valueMatches(cell.number)
                            && cell.color === color1) {
                            cell.color = getRandomElement(
                                colors.filter(c => c !== color1));
                        }
                    }
                }
            });
        } else {
            // partially satisfy
            grid.forEach(cell => {
                if (cell.shape === shape1 && valueMatches(cell.number)
                    && inRegion(cell)) {
                    cell.color = color1;
                }
            });
            // introduce violation
            const violatingCell = grid.find(
                c => c.shape === shape1 && valueMatches(c.number)
                && inRegion(c) && c.color === color1
            );
            if (violatingCell) {
                violatingCell.color = getRandomElement(
                    colors.filter(cc => cc !== color1));
            }
        }

        return { grid, satisfies };
    },

    verifyStatementWithGrid(grid, details) {
        const { shape1, color1, minValue,
            maxValue, direction, numUnits } = details;

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
        const valueMatches = (n) => (n >= minValue && n <= maxValue);

        // For all shape1 with value in [minValue..maxValue],
        // must be color1 + inRegion
        return grid.every(cell => {
            if (cell.shape === shape1 && valueMatches(cell.number)) {
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