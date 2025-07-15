// scripts/statementGenerator

import { easyTemplates, mediumTemplates, hardTemplates } from './gridTemplates/templates';

// Return an array of templates based on selected difficulty
export function getTemplatesByDifficulty(difficulty) {
    switch (difficulty) {
        case 'easy':
            return easyTemplates;
        case 'medium':
            return mediumTemplates;
        case 'hard':
            return hardTemplates;
        default:
            return easyTemplates;
    }
}