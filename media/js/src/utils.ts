type HTTPMethod = 'GET' | 'PUT' | 'POST' | 'DELETE'
type Statement = {
    pk: number;
    question: string;
    answer: string;
    difficulty: number;
    created_at: string;
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

export const checkQuestion = function(statement: Statement) {
    const answer = statement.answer;
    switch (answer) {
    case 'T': {
        return 'is a Tautology';
    }
    case 'F': {
        return 'is a Fallacy';
    }
    default:
        return 'is logically equivalent to';
    }
};
