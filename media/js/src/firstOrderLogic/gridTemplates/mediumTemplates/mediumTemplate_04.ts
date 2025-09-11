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

function generateRandomPosition() {
    const direction = getRandomElement(['left', 'right', 'top', 'bottom']);
    const numUnits = randomIntFromInterval(2, Math.floor(gridSize / 2) + 1);
    const dimension =
        (direction === 'left' || direction === 'right') ? 'columns' : 'rows';
    const positionDescription = `${direction} ${numUnits} ${dimension}`;
    return { direction, numUnits, positionDescription };
}

export const mediumTemplate_04 = {
    generateStatements() {
        const shape1 = getRandomElement(shapes);
        const color1 = getRandomElement(colors);
        const parity = getRandomElement(['even', 'odd']);
        const { direction, numUnits,
            positionDescription } = generateRandomPosition();

        const colorName = getColorName(color1);

        const details = {
            shape1,
            color1,
            parity,
            direction,
            numUnits,
            positionDescription
        };

        const naturalLanguageStatement = replacePlaceholders(
            'All {shape1}s with {parity} values are {color1} and located '
            + 'in the {positionDescription} of the grid.',
            { ...details, color1: colorName }
        );

        const formalFOLStatement = `
        ∀x (
          (Shape(x, ${shape1}) ∧ 
           ${parity === 'even' ? 'Even' : 'Odd'}(Value(x)))
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
        const parityMatches =
            (val) => (parity === 'even') ? (val % 2 === 0) : (val % 2 !== 0);

        if (satisfies) {
            grid.forEach(cell => {
                if (cell.shape === shape1 && parityMatches(cell.number)) {
                    cell.color = color1;
                    if (!inRegion(cell)) {
                        // break the condition so it doesn't meet shape+parity
                        cell.shape = getRandomElement(
                            shapes.filter(s => s !== shape1));
                    }
                } else {
                    if (inRegion(cell)) {
                        if (cell.shape === shape1
                            && parityMatches(cell.number)) {
                            cell.color = color1;
                        }
                    } else {
                        // outside region => can't be shape1+parity+color1
                        if (cell.shape === shape1 && parityMatches(cell.number)
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
                if (cell.shape === shape1 && parityMatches(cell.number)
                    && inRegion(cell)) {
                    cell.color = color1;
                }
            });
            // introduce violation
            const violatingCell = grid.find(
                c => c.shape === shape1 && parityMatches(c.number)
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
        const parityMatches =
            (val) => (parity === 'even') ? (val % 2 === 0) : (val % 2 !== 0);

        return grid.every(cell => {
            if (cell.shape === shape1 && parityMatches(cell.number)) {
                // must be color1 + inRegion
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