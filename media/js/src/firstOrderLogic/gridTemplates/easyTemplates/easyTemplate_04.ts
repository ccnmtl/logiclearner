import {
    getRandomElement,
    gridSize,
    shapes,
    colors,
    numbers
} from '../../utils';

function replacePlaceholders(template, details) {
    return template
        .replace(/{shape1}/g, details.shape1)
        .replace(/{number1}/g, details.number1);
}

export const easyTemplate_04 = {
    generateStatements() {
        const details = {
            shape1: getRandomElement(shapes),
            number1: getRandomElement(numbers)
        };
        const naturalLanguageStatement = replacePlaceholders(
            'All shapes with value {number1} are {shape1}.',
            details
        );
        const formalFOLStatement =
            `∀x (Value(x, ${details.number1}) → Shape(x, ${details.shape1}))`;

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

        // If a cell has number1, give it shape1
        if (satisfies) {
            grid.forEach(cell => {
                if (cell.number === details.number1) {
                    cell.shape = details.shape1;
                }
            });
        } else {
            // Make it satisfy first, then create a violation
            grid.forEach(cell => {
                if (cell.number === details.number1) {
                    cell.shape = details.shape1;
                }
            });
            const violatingCell = grid.find(
                c => c.number === details.number1 && c.shape === details.shape1
            );
            if (violatingCell) {
                violatingCell.shape = getRandomElement(
                    shapes.filter(s => s !== details.shape1));
            }
        }

        return { grid, satisfies };
    },

    verifyStatementWithGrid(grid, details) {
        return grid.every(cell => {
            if (cell.number === details.number1) {
                return cell.shape === details.shape1;
            }
            return true;
        });
    },

    checkIfViolates(grid, details) {
        return !this.verifyStatementWithGrid(grid, details);
    }
};