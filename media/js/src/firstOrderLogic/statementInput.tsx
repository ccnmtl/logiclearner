import React, { useEffect, useState } from 'react';
import { GridStatement } from './utils';

interface StatementProps {
    correctStatement: GridStatement
    isCorrect: boolean
    setIsCorrect: Function
    text: string
    setText: Function
}

export const StatementInput: React.FC<StatementProps> = ({
    correctStatement, isCorrect, setIsCorrect, text, setText
}:StatementProps) => {
    const [feedback, setFeedback] = useState<string>(
        'ERROR: This feedback should not be visible.')
    const [submitted, setSubmitted] = useState<boolean>(false);

    const buttonList = ['∀', '→', '∃', '∧', '≥'];

    const directionalRelationships = ['Top(y,x)', 'TopLeftOf(y,x)',
        'TopRightOf(y,x)', 'LeftOf(y,x)', 'RightOf(y,x)', 'Below(y,x)',
        'BottomLeftOf(y,x)', 'BottomRightOf(y,x)'];

    const objectRelationships = ['Shape(x/y, Circle/Square/Triangle)',
        'Color(x/y, Blue/Green/Red))', 'Value(x/y, 0 to 9))',]

    const mkList = (items:string[], uniqueClass='') => 
        <ul className={`list-group-flush ps-2 ${uniqueClass}`}>
            {items.map((item, i) => 
                <li key={i} className='list-group-item'>{item}</li>
            )}
        </ul>

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
        </ul>

    const mkAddChar = (char:string) => () => {
        const el =
            document.getElementById('statement-text') as HTMLInputElement;
        el.value = el.value + char
        el.focus();
    };

    const generalize = (text:string) => {
        return text.replace(/\s/g, '').toLowerCase();
    };

    const handleCheck = (e) => {
        setSubmitted(true);
        const el =
            document.getElementById('statement-text') as HTMLInputElement;
        setIsCorrect(generalize(el.value) ===
            generalize(correctStatement.formalFOLStatement));
    };

    const handleText = (e) => {
        setText(e.value);
    };

    useEffect(() => {
        if (isCorrect) setFeedback('Good! XD');
        else setFeedback('Ooops <:O');
    }, [isCorrect])

    useEffect(() => {
        setSubmitted(false);
    }, [])

    return <section className='col-4'>
        <p>Enter the statment that defines the relationship of</p>
        <p>{correctStatement.naturalLanguageStatement}</p>
        {mkBtnList(buttonList)}
        <textarea id='statement-text' className='form-control mb-2' onChange={handleText}
            placeholder='Enter the value here' value={text}></textarea>
        <button type='submit' className='btn btn-primary my-2'
            onClick={handleCheck}>Check Statement</button>
        {submitted && (isCorrect ? <p className='text-success'>{feedback}</p> :
            <p className='text-danger'>{feedback}</p>)}
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
    </section>
}