/* eslint-disable no-useless-escape */
import React, { useEffect, useState } from 'react';
import { GridStatement } from './utils';

interface StatementProps {
    correctStatement: GridStatement
    difficulty: string
    setIsCorrect: React.Dispatch<React.SetStateAction<boolean>>
    text: string
    setText: React.Dispatch<React.SetStateAction<string>>
}

export const StatementInput: React.FC<StatementProps> = ({
    correctStatement, difficulty, setIsCorrect, text, setText
}:StatementProps) => {
    const [feedback, setFeedback] = useState<string[]>(
        ['ERROR: This feedback should not be visible.']);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [evalObj, setEvalObj] = useState([{}, {}]);

    const buttonList = ['∀', '→', '∧', '≤', '≥', '∃'];

    const LaTexConversion = {
        '\\and': '∧',
        '\\all': '∀',
        '\\e': '∃',
        '\\exists': '∃',
        '\\forall': '∀',
        '\\ge': '≥',
        '\\if': '→',
        '\\implies': '→',
        '\\le': '≤'
    };

    const parenthesesMismatch = (text:string):boolean => {
        let [left, right] = [0, 0];
        for (const a of text) {
            if (a === '(') left++;
            if (a === ')') right++;
        }
        return left !== right;
    };

    /**
     * Build an object of the key-value pairs extracted from a given statement.
     *
     * e.g: "Key1(x, value1) ∧ Key2(x, value2)" =>
     * {key: value, ..., key2: value2}
     * @param text
     */
    const pullData = (text:string):object => {
        const rules = {};
        const predicates = text.match(/\w+\(\w+[,\w]+\)/g);
        if (predicates) {
            predicates.forEach((keyValue) => {
                const key = keyValue.match(/[^xy\W]\w+(?=\(\w)/);
                const value = keyValue.match(/[\w\d]+?(?=[\),])/g);
                if (key != null && value != null) {
                    rules[key[0]] = value;
                }
            });
        }
        const compKey = text.match(/[<>≤≥](?=\-?\d)/);
        if (compKey) {
            const compVar = text.match(/\w(?=\)[<>≤≥])/);
            rules[compKey[0]] = compVar.concat(text.match(/-?\d(?=[$∧])/));
        }
        return rules;
    };

    /**
     * Splits the statement into a left and right object around the if
     * statement.
     * @param text
     */
    const parseStatement = (text:string):object[] => {
        const rules:object[] = [{'error': []}];
        if (parenthesesMismatch(text)) {
            rules[0]['error'].push('There is an unpaired parenthesis.');
        }
        const sides = text.split('→');
        if (sides.length == 2) {
            rules.push(pullData(sides[0]), pullData(sides[1]));
        } else {
            rules.push({}, {});
        }
        return rules;
    };

    const regex = {
        'easy': /^\∀x.*$/,
        'medium': /^\∀x.*$/,
        'hard': /^\∀x.*\→\∃y.*$/
    };

    const directionalRelationships = ['Above', 'TopLeftOf',
        'TopRightOf', 'LeftOf', 'RightOf', 'Below',
        'BottomLeftOf', 'BottomRightOf'];

    const objectRelationships = ['Shape(x/y, Circle/Square/Triangle)',
        'Color(x/y, Blue/Green/Red))', 'Value(x/y, 0 to 9))',
        'Even(Value(x/y))', 'Odd(Value(x/y))', 'Prime(Value(x/y))',
        'Location(x/y, top/bottom/left/right rows/columns',
        'MultipleOf(Value(x/y))'];

    const mkList = (items:string[], uniqueClass='') =>
        <ul className={`list-group-flush ps-2 ${uniqueClass}`}>
            {items.map((item, i) =>
                <li key={i} className='list-group-item'>{item}</li>
            )}
        </ul>;

    const mkBtnList = (items:string[]) =>
        <ul className="list-inline  row my-2">
            {items.map((item:string, i:number) =>
                <li key={i} className='col-auto'>
                    <button className='btn btn-outline-secondary'
                        aria-label={`Add a ${item} symbol to the statement.`}
                        onClick={mkAddChar(item)}
                    >
                        {item}</button>
                </li>
            )}
        </ul>;

    const mkAddChar = (char:string) => () => {
        const el =
            document.getElementById('statement-text') as HTMLInputElement;
        const pos = el.selectionStart;
        const newText = el.value.substring(0, pos) + char +
            el.value.substring(pos, el.value.length);
        setText(newText);
        el.value = newText;
        el.focus();
        el.selectionEnd = pos + 1;
    };

    const evaluate = (check:object[]) => {
        const errors = check[0]['error'];
        if (check.length == evalObj.length) {
            for (let i = 1; i < evalObj.length; i++) {
                for (const [key, value] of
                    Object.entries<string[]>(evalObj[i]))
                {
                    const checkVal = check[i][key];
                    if (checkVal && checkVal.length === value.length) {
                        if (checkVal[0] !== value[0]) {
                            // Check variable
                            errors.push(`The ${key} from the ` +
                                `${i === 1 ? 'left' : 'right'} side uses the ` +
                                'wrong variable.');
                        }
                        for (let j = 1; j < checkVal.length; j++) {
                            // Check value(s)
                            if (checkVal[j] !== value[j]) {
                                errors.push(`The ${key} from the ` +
                                    `${i === 1 ? 'left' : 'right'} side of ` +
                                    'the statement is incorrect');
                            }
                        }
                    } else {
                        errors.push(`Missing ${key} from the ` +
                            `${i === 1 ? 'left' : 'right'} side of the ` +
                            'statement');
                    }
                }
            }
        } else {
            errors.push('The statement requires one implication (→) character');
        }
        setFeedback(errors);
        return errors.length === 0;
    };

    const handleCheck = () => {
        setSubmitted(true);
        const value = (
            document.getElementById('statement-text') as HTMLInputElement)
            .value.replace(/\s/g, '').toLowerCase();
        const check = parseStatement(value);
        if (value.match(regex[difficulty])) {
            setIsCorrect(evaluate(check));
        } else {
            setFeedback(['The statement must begin with ∀x, independent and ' +
                'dependent predicates separated by → ' +
                `${difficulty === 'hard' ?
                    ', and dependent predicates are preceded by ∃y':
                    ''
                }`]);
            setIsCorrect(false);
        }
    };

    const handleText = (e) => {
        let text = e.target.value.replaceAll('^', '∧');
        text = text.replaceAll('->', '→');
        setText(text.replace(/\\\w+/g, (word:string) =>
            LaTexConversion[word] ?? word));
    };

    useEffect(() => {
        setSubmitted(false);
        setFeedback([]);
    }, [difficulty]);

    useEffect(() => {
        setEvalObj(parseStatement(correctStatement.formalFOLStatement
            .replace(/\s/g, '').toLowerCase()));
    }, [correctStatement]);

    useEffect(() => {
        setSubmitted(false);
        setFeedback([]);
    }, [difficulty]);

    useEffect(() => {
        setSubmitted(false);
    }, []);

    return <section data-testid='statement-input' className='col-4'>
        <p>Enter the statment that defines the following relationship:</p>
        <strong className='mx-2'>
            {correctStatement.naturalLanguageStatement}
        </strong>
        {mkBtnList(buttonList)}
        <textarea id='statement-text' data-testid='statement-text'
            className='form-control mb-2'
            onChange={handleText}
            placeholder='Enter the value here' value={text}></textarea>
        <button type='submit' className='btn btn-primary my-2'
            onClick={handleCheck} data-testid='submit-button'
        >
            Check Statement
        </button>
        {submitted && <div data-testid='feedback' >{feedback.length > 0 ?
            mkList(feedback, 'text-danger'):
            <p className='text-success'>Success!</p>
        }</div>}
        <p className='col-12 fs-4 my-2'>Predicates</p>
        <div className="row">
            <div className="col-6">
                <strong>Object</strong>
                {mkList(objectRelationships)}
            </div>
            <div className="col-6">
                <strong>Adjacency(y, [direction], x)</strong>
                {mkList(directionalRelationships)}
            </div>
        </div>
    </section>;
};
