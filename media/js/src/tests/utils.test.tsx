import { checkQuestion, raw2latex, latex2raw, completionCount,
    capitalize} from '../utils';

describe('Unit tests for utils', () => {
    const questionList = [
        [{'statement': {'pk': 27, 'question': '~(q^~p)^(qv~p)',
            'answer': 'p<=>q', 'difficulty': 0,
            'created_at': '2022-03-09T12:53:54.238035-05:00',
            'modified_at': '2022-04-25T21:58:00.296120-04:00'
        }, 'id': 27, 'level': 'Novice', 'status': 'complete', 'stepList': [],
        'hintCount': 0, 'hints': [], 'idStr': '27'}
        ],
        [{'statement': {'pk': 29, 'question': '(p^~q)v(q^~p)',
            'answer': '~(p<->q)', 'difficulty': 1,
            'created_at': '2022-03-09T13:19:02.630233-05:00',
            'modified_at': '2022-04-21T15:37:22.680188-04:00'
        }, 'id': 29, 'level': 'Learner', 'status': 'complete', 'stepList': [],
        'hintCount': 0, 'hints': [], 'idStr': '29'
        }
        ],
        [{'statement': {'pk': 3, 'question': 'F->T', 'answer': 'T',
            'difficulty': 0, 'created_at': '2022-01-25T13:48:16.020084-05:00',
            'modified_at': '2022-04-21T15:26:01.213286-04:00'
        }, 'id': 3, 'level': 'Novice', 'status': null, 'stepList': [],
        'hintCount': 0, 'hints': [], 'idStr': '3'
        }
        ],
    ];
    test('checkQuestion works correctly', () => {
        expect(checkQuestion('T')).toEqual('Tautology');
        expect(checkQuestion('F')).toEqual('Fallacy');
        expect(checkQuestion('pv(q^r)')).toEqual('pv(q^r)');
    });
    test('Check raw to latex', () => {
        expect(raw2latex('~')).toEqual('¬');
        expect(raw2latex('<->')).toEqual('↔');
        expect(raw2latex('<=>')).toEqual('↔');
        expect(raw2latex('->')).toEqual('→');
        expect(raw2latex('v')).toEqual('∨');
        expect(raw2latex('^')).toEqual('∧');
    });
    test('Check latex to raw', () => {
        expect(latex2raw('¬')).toEqual('~');
        expect(latex2raw('↔')).toEqual('<->');
        expect(latex2raw('→')).toEqual('->');
        expect(latex2raw('∨')).toEqual('v');
        expect(latex2raw('∧')).toEqual('^');
    });
    test('Make sure the completion count is accurate', () => {
        expect(completionCount(0, questionList)).toEqual(1);
        expect(completionCount(1, questionList)).toEqual(1);
        expect(completionCount(3, questionList)).toEqual(0);
    });
    test('Test capitaalize function', () => {
        expect(capitalize('test')).toEqual('Test');
        expect(capitalize('Test')).toEqual('Test');
        expect(capitalize('TEST')).toEqual('TEST');
    });
});