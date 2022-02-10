/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
type HTTPMethod = 'GET' | 'PUT' | 'POST' | 'DELETE'

export type Statement = {
    pk: number;
    question: string;
    answer: string;
    difficulty: number;
    created_at: string;
}

export type ExerciseData = {
    statement: Statement;
    id: number;
    level: string;
    status: string;
    submittedData: Array<string>,
    hintCount: number;
    hints: Array<string>;
    idStr: string;
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
 * Get statments according to difficulty
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
    str = str.replace(new RegExp('v', 'g'), 'V');
    str = str.replace(/\^/g, '∧');

    return str;
};

/**
 * Parses LaTeX to raw text.
 */
export const latex2raw = function(quesText: string) {
    let str = quesText;

    str = str.replace(new RegExp('∧', 'g'), '^');
    str = str.replace(new RegExp('V', 'g'), 'v');
    str = str.replace(new RegExp('↔', 'g'), '<->');
    str = str.replace(new RegExp('→', 'g'), '->');
    str = str.replace(new RegExp('¬', 'g'), '~');

    return str;
};

/**
 * .
 */
export const completionCount = function(level, qList) {
    let count = 0;

    for (let i = 0; i < qList.length; i++) {
        const data: ExerciseData = qList[i][0];
        if(data.level === level && data.status === 'completed') {
            count++;
        }
    }
    return count;
};