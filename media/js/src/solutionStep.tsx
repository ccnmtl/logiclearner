import React, { useEffect } from 'react';
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

    const isLast = idx === stepList.length + 1;

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
                        <select name='laws' id='laws' className='form-control'
                            defaultValue={capitalize(step[0])}
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
                            disabled={step[0] === '' ? false : true}
                            defaultValue={step[1]} />
                        {isLast && (
                            <>
                                <input className="btn btn-primary"
                                    type="submit" value="Submit" />
                                <input className="btn btn-primary"
                                    type="reset" value="Delete"
                                    onClick={handleDeleteStep} />
                            </>
                        )}
                        <div>Statement hint here</div>
                    </div>
                </div>
            </form>

        </>
    );
};