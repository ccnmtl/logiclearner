// scripts/utils

export const gridSize = 5;

export const dTitle = {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard'
};

export interface GridItem {
    color:string
    number:number
    shape:string
    [key: string]: unknown;
}

export interface GridStatement {
    naturalLanguageStatement: string
    formalFOLStatement: string
    details: GridItem
}

export interface GridTemplate {
    generateStatements: () => GridStatement;
    generateGrid: (satisfies: boolean, details: Record<string, unknown>) =>
    { grid: GridItem[]; satisfies: boolean };
    verifyStatementWithGrid: (grid: GridItem[],
        details: Record<string, unknown>) => boolean;
    checkIfViolates: (grid: GridItem[], details: Record<string, unknown>) =>
    boolean;
}

export interface Score {
    easy: number[]
    medium: number[]
    hard: number[]
}

// Map hex color codes to color names for convenience
const colorMap = {
    '#2e7d32': 'Green',
    '#d32f2f': 'Red',
    '#2962ff': 'Blue',
    '#fdfd96': 'Yellow',
    '#ffb347': 'Orange',
    '#ffb6c1': 'Pink'
    // add more as needed
};

/**
 * getColorName(colorHex): returns the English color name if known,
 * else the raw hex
 */
export function getColorName(colorHex) {
    return colorMap[colorHex.toLowerCase()] || colorHex;
}

// Available shapes, colors, etc.
export const shapes = ['circle', 'square', 'triangle'];
export const colors = ['#2962ff', '#2e7d32', '#d32f2f']; // Blue, Green, Red
export const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

// Some optional arrays if needed
export const positions = [
    'top left corner',
    'top right corner',
    'bottom left corner',
    'bottom right corner'
];
export const equality = ['equal', 'greater than', 'less than'];
export const directions = ['left', 'right', 'up', 'down'];
export const orders = ['first', 'second', 'third'];

/**
 * getRandomElement(array): returns a random element from array
 */
export function getRandomElement(array) {
    if (!array || array.length === 0) {
        return null;
    }
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * randomIntFromInterval(min, max): integer in [min, max]
 */
export function randomIntFromInterval(min, max) {
    if (min > max) {
        return min; // fallback
    }
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * shuffleArray(array): in-place shuffle (Fisher-Yates)
 */
export function shuffleArray(array) {
    if (!array || array.length === 0) {
        return [];
    }
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}