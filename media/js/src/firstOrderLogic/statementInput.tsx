/* eslint-disable no-useless-escape */
import React, { ReactNode, useEffect, useState } from 'react';
import { GridStatement, predicateList, operatorList, variableList,
    constantList } from './utils';

interface StatementProps {
    correctStatement: GridStatement
    difficulty: string
    text: string
    setText: React.Dispatch<React.SetStateAction<string>>
    handleAttempt: (isCorrect:boolean) => void
    handleNewGrid: () => void
    mkBtnList: (title:string, items:string[]) => ReactNode
    inBtnRange: boolean,
    isDone: boolean
}

export const StatementInput: React.FC<StatementProps> = ({
    correctStatement, difficulty, text, setText, inBtnRange,
    handleAttempt, handleNewGrid, mkBtnList, isDone
}:StatementProps) => {
    const [feedback, setFeedback] = useState<string[]>(
        ['ERROR: This feedback should not be visible.']);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [evalObj, setEvalObj] = useState([{}, {}]);

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

    const difficultyExamples: Record<string, {
        naturalLanguage: string,
        folExpression: string
    }> = {
        easy: {
            naturalLanguage: 'All circles are Blue.',
            folExpression: '∀x (Shape(x, circle) → Color(x, Blue))'
        },
        medium: {
            naturalLanguage:
                'All squares with value greater than 5 are Red and ' +
                'located in the left 2 columns of the grid.',
            folExpression:
                '∀x ((Shape(x, square) ∧ Value(x) > 5) → ' +
                '(Color(x, Red) ∧ Location(x, left 2 columns)))'
        },
        hard: {
            naturalLanguage:
                'For all circles that are Green, there exists a ' +
                'triangle with a value greater than 3 directly ' +
                'to the right of it.',
            folExpression:
                '∀x ((Shape(x, circle) ∧ Color(x, Green)) → ' +
                '∃y (Shape(y, triangle) ∧ Value(y) > 3 ∧ RightOf(x)))'
        }
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
        const predicates = text.match(/\w+\(\w+[,\w]*\)/g);
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

    const mkList = (items:string[], uniqueClass='') =>
        <ul className={`list-group-flush ps-2 ${uniqueClass}`}>
            {items.map((item, i) =>
                <li key={i} className="list-group-item">{item}</li>
            )}
        </ul>;

    const trackErrors = (errors: string[], userInput: string) => {
        if (errors.length > 0 &&
            window.rudderanalytics &&
            typeof window.rudderanalytics.track === 'function') {
            window.rudderanalytics.track('fol_express_error', {
                difficulty,
                user_input: userInput,
                expected_statement:
                    correctStatement.formalFOLStatement,
                errors,
            });
        }
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
        trackErrors(errors, text);
        handleAttempt(errors.length === 0);
    };

    const handleCheck = () => {
        setSubmitted(true);
        const value = (
            document.getElementById('statement-text') as HTMLInputElement)
            .value.replace(/\s/g, '').toLowerCase();
        const check = parseStatement(value);
        if (value.match(regex[difficulty])) {
            evaluate(check);
        } else {
            const structureErrors = [
                'The statement must begin with ∀x, independent and ' +
                'dependent predicates separated by → ' +
                `${difficulty === 'hard' ?
                    ', and dependent predicates are preceded by ∃y':
                    ''
                }`];
            setFeedback(structureErrors);
            handleAttempt(false);
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

    return (
        <div className="col-md-6 py-md-0 solution-step">
            <section data-testid="statement-input" id="solution"
                className="d-flex flex-column">
                <div className="order-1">
                    <p>
                        Enter the statement that defines the following
                        relationship:
                    </p>
                    <strong>
                        {correctStatement.naturalLanguageStatement}
                    </strong>
                    <details className="fol-example mt-3"
                        data-testid="fol-example">
                        <summary className="fol-example__summary">
                            See example
                        </summary>
                        <div className="fol-example__content mt-2">
                            <p className="fol-example__label mb-1">
                                <em>Natural language:</em>
                            </p>
                            <p className="fol-example__nl mb-2">
                                &ldquo;{difficultyExamples[difficulty]
                                    .naturalLanguage}&rdquo;
                            </p>
                            <p className="fol-example__label mb-1">
                                <em>FOL expression:</em>
                            </p>
                            <code className="fol-example__expression">
                                {difficultyExamples[difficulty]
                                    .folExpression}
                            </code>
                        </div>
                    </details>
                </div>
                <div className="d-flex flex-column my-3 order-2 order-md-3">
                    {mkBtnList('Operators', operatorList)}
                    {inBtnRange && mkBtnList('Predicates', predicateList)}
                    {mkBtnList('Variables', variableList)}
                    {mkBtnList('Constants', constantList)}
                </div>
                <div
                    className={
                        'order-3 order-md-2 fol-statement-input pb-2 pt-1 ' +
                        'bg-white'}>
                    <textarea id="statement-text" data-testid="statement-text"
                        className="form-control my-2"
                        onChange={handleText}
                        placeholder="Enter the value here"
                        value={text}></textarea>
                    <button
                        type="submit"
                        className="btn btn-success w-30 d-block ms-auto mb-3"
                        onClick={handleCheck} data-testid="submit-button"
                        disabled={isDone}>
                        Check Statement
                    </button>
                    {submitted &&
                    <div data-testid="feedback" className="mb-3">
                        {feedback.length > 0 ?
                            mkList(feedback, 'text-danger'):
                            <p className="text-success">Success!</p>}
                    </div>}
                    <div className="grid-actions d-none d-md-block">
                        <button className="btn btn-outline-primary"
                            onClick={handleNewGrid}>
                            {isDone ? 'Next': 'Skip this'} grid »</button>
                    </div>
                </div>
            </section>
        </div>
    );
};
