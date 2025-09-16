/* eslint-disable no-useless-escape */
import React, { useEffect, useState } from 'react';
import { GridStatement } from './utils';

interface StatementProps {
    correctStatement: GridStatement
    difficulty: string
    isCorrect: boolean
    setIsCorrect: React.Dispatch<React.SetStateAction<boolean>>
    text: string
    setText: React.Dispatch<React.SetStateAction<string>>
}

export const StatementInput: React.FC<StatementProps> = ({
    correctStatement, difficulty, isCorrect, setIsCorrect, text, setText
}:StatementProps) => {
    const [feedback, setFeedback] = useState<string>(
        'ERROR: This feedback should not be visible.');
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [evalObj, setEvalObj] = useState([{}, {}]);

    const buttonList = ['∀', '→', '∧',  '∃', '≥'];

    const LaTexConversion = {
        '\\and': '∧',
        '\\all': '∀',
        '\\e': '∃',
        '\\exists': '∃',
        '\\forall': '∀',
        '\\if': '→',
        '\\implies': '→',
        '\\ge': '≥'
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
        const found = text.replace(/\s/, '').toLowerCase()
            .match(/\w+\(\w+,[\w\s]+\)+?/g);
        if (found) {
            found.forEach((keyValue) => {
                const key = keyValue.match(/[^xy]\w+(?=\(\w+[^\)])/);
                const value = keyValue.match(/(?<=\(.*?)\w+|\d/g);
                if (key != null && value != null) {
                    rules[key[0]] = value;
                }
            });
        }
        return rules;
    };

    /**
     * Splits the statement into a left and right object around the if
     * statement.
     * @param text
     */
    const parseStatement = (text:string):object[] => {
        const sides = text.split('→');
        if (sides.length == 2) {
            return [pullData(sides[0]), pullData(sides[1])];
        } else {
            return [{}, {}];
        }
    };

    const regex = {
        'easy': /^\∀x.*$/,
        'medium': /^\∀x.*$/,
        'hard': /^\∀x.*\→\∃y.*$/
    };

    const directionalRelationships = ['Top(y,x)', 'TopLeftOf(y,x)',
        'TopRightOf(y,x)', 'LeftOf(y,x)', 'RightOf(y,x)', 'Below(y,x)',
        'BottomLeftOf(y,x)', 'BottomRightOf(y,x)'];

    const objectRelationships = ['Shape(x/y, Circle/Square/Triangle)',
        'Color(x/y, Blue/Green/Red))', 'Value(x/y, 0 to 9))',
        'Even(Value(x/y))', 'Odd(Value(x/y))', 'Prime(Value(x/y))',
        'Location(x/y, top/bottom/left/right [number of subsets] rows/columns',
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
        el.value = el.value.substring(0, pos) + char +
        el.value.substring(pos, el.value.length);
        el.focus();
        el.selectionEnd = pos + 1;
    };

    const evaluate = (check:object[]) => {
        if (check.length === evalObj.length) {
            for (let i = 0; i < evalObj.length; i++) {
                for (const [key, value] of
                    Object.entries<string[]>(evalObj[i]))
                {
                    const checkVal = check[i][key];
                    if (checkVal && checkVal.length === value.length) {
                        if (checkVal[0] !== value[0]) {
                            // Check variable
                            return false;
                        }
                        if (checkVal.length > 1) {
                            // Check value(s)
                            for (let j = 1; j < checkVal.length; j++) {
                                if (checkVal[i] !== value[i]) {
                                    return false;
                                }
                            }
                        }
                    } else {
                        return false;
                    }
                }
            }
        } else {

            return false;
        }
        return true;
    };

    const handleCheck = () => {
        setSubmitted(true);
        const el =
            document.getElementById('statement-text') as HTMLInputElement;
        const check = parseStatement(el.value);
        if (el.value.match(regex[difficulty])) {
            setIsCorrect(evaluate(check));
        } else {
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
        setFeedback('');
    }, [difficulty]);

    useEffect(() => {
        setEvalObj(parseStatement(correctStatement.formalFOLStatement));
    }, [correctStatement]);

    useEffect(() => {
        if (isCorrect) {
            setFeedback('Success!');
        } else {
            setFeedback('Ooops <:O');
        }
    }, [isCorrect]);


    useEffect(() => {
        setSubmitted(false);
    }, []);

    return <section className='col-4'>
        <p>Enter the statment that defines the following relationship:</p>
        <strong className='mx-2'>
            {correctStatement.naturalLanguageStatement}
        </strong>
        {mkBtnList(buttonList)}
        <textarea id='statement-text'
            className='form-control mb-2'
            onChange={handleText}
            placeholder='Enter the value here' value={text}></textarea>
        <button type='submit' className='btn btn-primary my-2'
            onClick={handleCheck}>Check Statement</button>
        {submitted &&
            <p className={`text-${isCorrect ? 'success' : 'danger'}`}>
                {feedback}</p>
        }
        <p className='col-12 fs-4 my-2'>Relationships</p>
        <div className="row">
            <div className="col-6">
                <strong>Object</strong>
                {mkList(objectRelationships)}
            </div>
            <div className="col-6">
                <strong>Directional</strong>
                {mkList(directionalRelationships)}
            </div>
        </div>
    </section>;
};
