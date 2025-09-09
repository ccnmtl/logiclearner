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

export const easyTemplate_05 = {
    generateStatements() {
        const details = {
            color1: getRandomElement(colors),
            number1: getRandomElement(numbers)
        };
        const colorName = getColorName(details.color1);
        const naturalLanguageStatement = replacePlaceholders(
            'All shapes with value {number1} are {color1}.',
            { ...details, color1: colorName }
        );
        const formalFOLStatement =
            `∀x (Value(x, ${details.number1}) → Color(x, ${colorName}))`;

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
            // Make sure that any cell with number1 has color1
            grid.forEach(cell => {
                if (cell.number === details.number1) {
                    cell.color = details.color1;
                }
            });
        } else {
            // Start by satisfying
            grid.forEach(cell => {
                if (cell.number === details.number1) {
                    cell.color = details.color1;
                }
            });
            // Then introduce violation
            const violatingCell = grid.find(
                c => c.number === details.number1 && c.color === details.color1
            );
            if (violatingCell) {
                violatingCell.color = getRandomElement(
                    colors.filter(c => c !== details.color1));
            }
        }

        return { grid, satisfies };
    },

    verifyStatementWithGrid(grid, details) {
        return grid.every(cell => {
            if (cell.number === details.number1) {
                return cell.color === details.color1;
            }
            return true;
        });
    },

    checkIfViolates(grid, details) {
        return !this.verifyStatementWithGrid(grid, details);
    }
};