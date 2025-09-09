// scripts/utils

export const gridSize = 5;

export interface GridItem {
    color:string
    number:number
    shape:string
}

export interface GridStatement {
    naturalLanguageStatement: string
    formalFOLStatement: string
    details: GridItem
}

export interface GridTemplate {
    generateStatements: Function
    generateGrid: Function
    verifyStatementWithGrid: Function
    checkIfViolates: Function
}

export interface Score {
    easy: number[]
    medium: number[]
    hard: number[]
}

// Map hex color codes to color names for convenience
const colorMap = {
    '#77dd77': 'Green',
    '#ff6961': 'Red',
    '#add8e6': 'Blue',
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
export const colors = ['#add8e6', '#77dd77', '#ff6961']; // Blue, Green, Red
export const colorNames = {
    '#add8e6': 'Blue',
    '#77dd77': 'Green',
    '#ff6961': 'Red'
};
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