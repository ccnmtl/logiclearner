import {
    getColorName,
    getRandomElement,
    gridSize,
    shapes,
    colors,
    numbers
} from '../../utils';

function replacePlaceholders(template, details) {
    return template
        .replace(/{color1}/g, details.color1)
        .replace(/{number1}/g, details.number1);
}

export const easyTemplate_06 = {
    generateStatements() {
        const details = {
            color1: getRandomElement(colors),
            number1: getRandomElement(numbers)
        };
        const colorName = getColorName(details.color1);
        const naturalLanguageStatement = replacePlaceholders(
            'All {color1} shapes have value {number1}.',
            { ...details, color1: colorName }
        );
        const formalFOLStatement =
            `∀x (Color(x, ${colorName}) → Value(x, ${details.number1}))`;

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

        if (satisfies) {
            // Make all color1 cells have number1
            grid.forEach(cell => {
                if (cell.color === details.color1) {
                    cell.number = details.number1;
                }
            });
        } else {
            // Satisfy first
            grid.forEach(cell => {
                if (cell.color === details.color1) {
                    cell.number = details.number1;
                }
            });
            // Then create violation
            const violatingCell = grid.find(
                c => c.color === details.color1 && c.number === details.number1
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
            if (cell.color === details.color1) {
                return cell.number === details.number1;
            }
            return true;
        });
    },

    checkIfViolates(grid, details) {
        return !this.verifyStatementWithGrid(grid, details);
    }
};