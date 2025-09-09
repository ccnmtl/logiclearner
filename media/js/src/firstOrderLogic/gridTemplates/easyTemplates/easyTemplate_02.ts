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
        .replace(/{shape1}/g, details.shape1)
        .replace(/{color1}/g, details.color1)
        .replace(/{number1}/g, details.number1);
}

export const easyTemplate_02 = {
    generateStatements() {
        const details = {
            shape1: getRandomElement(shapes),
            color1: getRandomElement(colors),
            number1: getRandomElement(numbers) // optional if needed later
        };
        const colorName = getColorName(details.color1);

        // Example statement: "All Red shapes are circle."
        const naturalLanguageStatement = replacePlaceholders(
            'All {color1} shapes are {shape1}.',
            { ...details, color1: colorName }
        );
        const formalFOLStatement =
            `∀x (Color(x, ${colorName}) → Shape(x, ${details.shape1}))`;

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

        // Make all color1 cells shape1
        grid.forEach(cell => {
            if (cell.color === details.color1) {
                cell.shape = details.shape1;
            }
        });

        if (!satisfies) {
            // Create 1 violation: find a cell that's color1 & shape1,
            //  and change shape
            const violatingCell = grid.find(
                c => c.color === details.color1 && c.shape === details.shape1
            );
            if (violatingCell) {
                violatingCell.shape = getRandomElement(
                    shapes.filter(s => s !== details.shape1));
            }
        }

        return { grid, satisfies };
    },

    verifyStatementWithGrid(grid, details) {
        // For every cell that is color1, check if it's shape1
        return grid.every(cell => {
            if (cell.color === details.color1) {
                return cell.shape === details.shape1;
            }
            return true;
        });
    },

    checkIfViolates(grid, details) {
        return !this.verifyStatementWithGrid(grid, details);
    }
};