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
 * Replaces placeholders in a template string: {shape1}, {color1}, {number1}, etc.
 */
function replacePlaceholders(template, details) {
    return template
        .replace(/{shape1}/g, details.shape1)
        .replace(/{color1}/g, details.color1)
        .replace(/{number1}/g, details.number1);
}

export const easyTemplate_01 = {
    /**
     * Generate the natural-language and FOL statements, plus details for grid logic.
     */
    generateStatements() {
        const details = {
            shape1: getRandomElement(shapes),
            color1: getRandomElement(colors),
            number1: getRandomElement(numbers) // may not be used in statement text, but included if needed
        };
        const colorName = getColorName(details.color1);

        const naturalLanguageStatement = replacePlaceholders(
            "All {shape1}s are {color1}.",
            { ...details, color1: colorName }
        );
        const formalFOLStatement = `∀x (Shape(x, ${details.shape1}) → Color(x, ${colorName}))`;

        return { naturalLanguageStatement, formalFOLStatement, details };
    },

    /**
     * Create a 5x5 grid. If satisfies=true, enforce the statement; else introduce 1 violation.
     */
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

        // Make all shape1 cells color1
        grid.forEach(cell => {
            if (cell.shape === details.shape1) {
                cell.color = details.color1;
            }
        });

        if (!satisfies) {
            // Introduce a single violation
            const violatingCell = grid.find(
                c => c.shape === details.shape1 && c.color === details.color1
            );
            if (violatingCell) {
                violatingCell.color = getRandomElement(colors.filter(c => c !== details.color1));
            }
        }

        return { grid, satisfies };
    },

    /**
     * Check if every cell that is shape1 has color1.
     */
    verifyStatementWithGrid(grid, details) {
        return grid.every(cell => {
            if (cell.shape === details.shape1) {
                return cell.color === details.color1;
            }
            return true; // non-shape1 cells do not matter
        });
    },

    /**
     * True if the grid violates the statement.
     */
    checkIfViolates(grid, details) {
        return !this.verifyStatementWithGrid(grid, details);
    }
};