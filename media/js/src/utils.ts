

import { EnumType } from 'typescript';


type HTTPMethod = 'GET' | 'PUT' | 'POST' | 'DELETE'

export type Statement = {
    pk: number;
    question: string;
    answer: string;
    difficulty: number;
    created_at: string;
}
export type Tools = {
    isValid: boolean;
    isSolution: boolean;
    errrCode: EnumType;
    errorMsg: string;
    nextFrontier: Array<string>;
    hintExpression: string;
    hintRule: string;
}

export type HintRes = {
    nextStep: [string, string];
    solutionFound: boolean;
    path: [string, string][]
}

export type HintTools = {
    isValid: boolean;
    isSolution: boolean;
    errrCode: EnumType;
    errorMsg: string;
    hint: HintRes;
}

export type ApiData = {
    next_expr: string;
    rule: string;
    step_list: [string];
    answer: string;
}

export type Solution = {
    pk: number;
    statement: number;
    ordinal: number;
    text: string;
    law: string;
    created_at: string;
    modified_at: string;
}

export type ExerciseData = {
    statement: Statement;
    id: number;
    level: string;
    status: string;
    stepList: [string, string][],
    hintCount: number;
    hints: Array<string>;
    idStr: string;
}

export type Status ={
    [key: string]: string;
}

export type Level ={
    [key: number]: string;
}

/**
 * A wrapper for `fetch` that passes along auth credentials.
 */
const authedFetch = function(url: string, method: HTTPMethod, data?: unknown) {
    const elt: HTMLElement = document.getElementById('csrf-token');
    const token: string = elt ? elt.getAttribute('content') : '';
    return fetch(url, {
        method: method,
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': token
        },
        body: JSON.stringify(data),
        credentials: 'same-origin'
    });
};

/**
 * Get statments according to difficulty.
 */
export const getStatements = async function(difficulty: number) {

    const url = `/api/statements/${difficulty}/`;

    return authedFetch(url, 'GET')
        .then(function(response) {
            if (response.status === 200) {
                return response.json();
            } else {
                throw 'Error loading Statements: ' +
                `(${response.status}) ${response.statusText}`;
            }
        });
};

/**
 * Get statments according to question pk.
 */
export const getStatement = async function(id: number) {

    const url = `/api/statement/${id}/`;

    return authedFetch(url, 'GET')
        .then(function(response) {
            if (response.status === 200) {
                return response.json();
            } else {
                throw 'Error loading Statement: ' +
                `(${response.status}) ${response.statusText}`;
            }
        });
};

/**
 * Get solutions according to question pk.
 */
export const getSolutions = async function(id: number) {

    const url = `/api/solution/${id}/`;

    return authedFetch(url, 'GET')
        .then(function(response) {
            if (response.status === 200) {
                return response.json();
            } else {
                throw 'Error loading Solutions: ' +
                `(${response.status}) ${response.statusText}`;
            }
        });
};

/**
 * Returns a string according to the type of question.
 */
export const checkQuestion = function(answer: string) {

    switch (answer) {
        case 'T': {
            return 'Tautology';
        }
        case 'F': {
            return 'Fallacy';
        }
        default:
            return answer;
    }
};

/**
 * Parses raw text to LaTeX
 */
export const raw2latex = function(quesText: string) {
    let str = quesText;

    str = str.replace(new RegExp('~', 'g'), '¬');
    str = str.replace(new RegExp('<->', 'g'), '↔');
    str = str.replace(new RegExp('->', 'g'), '→');
    str = str.replace(new RegExp('v', 'g'), '∨');
    str = str.replace(new RegExp('<=>', 'g'), '↔');
    str = str.replace(/\^/g, '∧');
    str = str.replace('t', 'T');
    str = str.replace('f', 'F');
    str = str.replace('P', 'p');
    str = str.replace('Q', 'q');
    str = str.replace('R', 'r');
    str = str.replace('S', 's');

    return str;
};

/**
 * Parses LaTeX to raw text.
 */
export const latex2raw = function(quesText: string) {
    let str = quesText;

    str = str.replace(new RegExp('∧', 'g'), '^');
    str = str.replace(new RegExp('∨', 'g'), 'v');
    str = str.replace(new RegExp('↔', 'g'), '<->');
    str = str.replace(new RegExp('→', 'g'), '->');
    str = str.replace(new RegExp('¬', 'g'), '~');
    str = str.replace('t', 'T');
    str = str.replace('f', 'F');
    str = str.replace('P', 'p');
    str = str.replace('Q', 'q');
    str = str.replace('R', 'r');
    str = str.replace('S', 's');

    return str;
};

/**
 * Counts the number of completed questions per level.
 */
export const completionCount = function(level:number, qList) {
    let count = 0;

    for (let i = 0; i < qList.length; i++) {
        const data: ExerciseData = qList[i][0];
        const statement = data.statement;
        if (statement.difficulty === level && data.status === 'complete') {
            count++;
        }
    }
    return count;
};

/**
 * Removes all question data in local storage according to level
 */
export const deleteLevelData = function(level:number, qList) {

    for (let i = 0; i < qList.length; i++) {
        const data: ExerciseData = qList[i][0];
        const statement = data.statement;
        const questionId = data.statement.pk.toString();
        if (statement.difficulty === level) {
            window.localStorage.removeItem(
                'question-' + questionId);
        }
    }
};

/**
 * Capitalizes first letter of string.
 */
export const capitalize = function(s: string) {
    return s && s[0].toUpperCase() + s.slice(1);
};

/**
 * Validate expression; check if solution is reached
 */
export const getValidation = async function(data: ApiData) {

    const url = '/api/validate/';

    return authedFetch(url, 'POST', data)
        .then(function(response) {
            if (response.status === 200) {
                return response.json();
            } else {
                throw 'Error loading hint: ' +
                `(${response.status}) ${response.statusText}`;
            }
        });
};

/**
 * Get hints.
 */
export const getHints = async function(data: ApiData) {

    const url = '/api/hint/';

    return authedFetch(url, 'POST', data)
        .then(function(response) {
            if (response.status === 200) {
                return response.json();
            } else {
                throw 'Error loading hint: ' +
                `(${response.status}) ${response.statusText}`;
            }
        });
};

/**
 * Update Question Data
 */

export const updateLocalStepList = (
    id: string,
    idx: number,
    step: [string, string]): [string, string][] => {
    const data = JSON.parse(
        window.localStorage.getItem(
            'question-' + id)) as ExerciseData[];
    data[0].stepList[idx] = step;
    window.localStorage.setItem('question-' + id,
        JSON.stringify(data));

    return data[0].stepList;
};

/**
 * Update Question Status
 */

export const updateLocalQuestionStatus = (
    id: string,
    status: string
): string =>{
    const data = JSON.parse(
        window.localStorage.getItem(
            'question-' + id)) as ExerciseData[];
    data[0].status = status;
    window.localStorage.setItem('question-' + id,
        JSON.stringify(data));
    return data[0].status;
};