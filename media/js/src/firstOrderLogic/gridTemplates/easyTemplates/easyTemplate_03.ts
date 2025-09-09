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

export const easyTemplate_03 = {
    generateStatements() {
        const details = {
            shape1: getRandomElement(shapes),
            number1: getRandomElement(numbers)
        };
        const naturalLanguageStatement = replacePlaceholders(
            'All {shape1}s have value {number1}.',
            details
        );
        const formalFOLStatement =
            `∀x (Shape(x, ${details.shape1}) → Value(x, ${details.number1}))`;

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

        // Make all shape1 cells have number1
        grid.forEach(cell => {
            if (cell.shape === details.shape1) {
                cell.number = details.number1;
            }
        });

        if (!satisfies) {
            // Violate it: find a cell that is shape1 & number1,
            //  then change number
            const violatingCell = grid.find(
                c => c.shape === details.shape1 && c.number === details.number1
            );
            if (violatingCell) {
                violatingCell.number = getRandomElement(
                    numbers.filter(n => n !== details.number1));
            }
        }

        return { grid, satisfies };
    },

    verifyStatementWithGrid(grid, details) {
        return grid.every(cell => {
            if (cell.shape === details.shape1) {
                return cell.number === details.number1;
            }
            return true;
        });
    },

    checkIfViolates(grid, details) {
        return !this.verifyStatementWithGrid(grid, details);
    }
};