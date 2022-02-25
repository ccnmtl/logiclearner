import React, { useEffect, useState } from 'react';
import { ExerciseData, Statement, capitalize } from './utils';

interface SolutionStepProps {
    statement: Statement;
    id: string;
    level: string;
    step: [string, string],
    stepList: [string, string][],
    setStepList: React.Dispatch<React.SetStateAction<[string, string][]>>,
    idx: number
}
const laws: Array<string> = ['Identity', 'Negation', 'Domination',
    'Idempotence', 'Commutativity', 'Associativity', 'Absorption', 'Demorgan"s',
    'Literal Negation', 'Distributivity', 'Double Negation',
    'Implication to Disjunction', 'Iff to Implication'];

export const SolutionStep: React.FC<SolutionStepProps> = (
    {statement, id, level, step, stepList, idx, setStepList
    }: SolutionStepProps) => {

    const [error, setError] = useState('');
    const [selectedLaw, setSelectedLaw] = useState('');
    const [statementInput, setStatementInput] = useState('');

    const setSolutionStepData = () => {
        const initData: ExerciseData = {
            statement: statement,
            id: Number(id),
            level: level,
            status: null,
            stepList: [],
            hintCount: 0,
            hints: [],
            idStr: id
        };
        const exerciseState = [...new Array<ExerciseData>(initData)];
        window.localStorage.setItem('question-' + id,
            JSON.stringify(exerciseState));
    };

    const handleDeleteStep = (
        evt: React.MouseEvent<HTMLButtonElement>): void => {
        evt.preventDefault();
        const data = JSON.parse(
            window.localStorage.getItem(
                'question-' + id)) as ExerciseData[];
        data[0].stepList.pop();
        window.localStorage.setItem('question-' + id,
            JSON.stringify(data));
        setStepList(data[0].stepList);
    };

    const handleStatementInput = (
        evt: React.ChangeEvent<HTMLInputElement>): void => {
        setStatementInput(evt.target.value);
        setError('');
    };

    const handleLawSelect = (
        evt: React.ChangeEvent<HTMLSelectElement>): void => {
        setSelectedLaw(evt.target.value);
    };

    const handleSubmit = (
        evt: React.MouseEvent<HTMLButtonElement>
    ): void => {
        evt.preventDefault();
        if(!statementInput) {
            setError('Please enter a statement.');
        }
    };

    const isLast = idx === stepList.length + 1;
    const haveErrors = !error;

    useEffect(() => {
        {void setSolutionStepData();}
    }, []);

    return (
        <>
            <form>
                <div className='form-group row'
                    data-testid={'exercise'}>
                    <div className='col'>
                        <label htmlFor='laws' className='form-label'>
                            If I apply this law...
                        </label>
                        <select name='law' id='laws' className='form-control'
                            defaultValue={capitalize(step[0])}
                            onChange={handleLawSelect}
                            disabled={step[0] === '' ? false : true} >
                            {laws.map((law, index) => {
                                return (
                                    <option key={index} value={law}>
                                        {law}
                                    </option>
                                );
                            })}
                        </select>
                        <div>Law hint here</div>
                    </div>
                    <div className='col'>
                        <label htmlFor='statementInput' className='form-label'>
                                then I&apos;ll get this statement...
                        </label>
                        <input type='text' className='form-control'
                            id='statementInput' aria-describedby='statement'
                            placeholder='Wizard like instructions'
                            name='statement' defaultValue={step[1]}
                            onChange={handleStatementInput}
                            disabled={step[0] === '' ? false : true} />
                        {isLast && (
                            <>
                                <input className="btn btn-primary"
                                    type="submit" value="Submit"
                                    onClick={handleSubmit} />
                                <input className="btn btn-primary"
                                    type="reset" value="Delete"
                                    onClick={handleDeleteStep} />
                            </>
                        )}
                        <div>Statement hint here</div>
                    </div>
                </div>
                {!haveErrors && (
                    <div className='row'>
                        <span className='text-danger'> Errors</span>
                    </div>
                )}
            </form>

        </>
    );
};