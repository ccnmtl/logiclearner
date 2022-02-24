import React, { useEffect } from 'react';
import { ExerciseData, Statement, capitalize } from './utils';

interface SolutionStepProps {
    statement: Statement;
    id: string;
    level: string;
    step: [string, string],
}
const laws: Array<string> = ['Identity', 'Negation', 'Domination',
    'Idempotence', 'Commutativity', 'Associativity', 'Absorption', 'Demorgan"s',
    'Literal Negation', 'Distributivity', 'Double Negation',
    'Implication to Disjunction', 'Iff to Implication'];

export const SolutionStep: React.FC<SolutionStepProps> = (
    {statement, id, level, step}: SolutionStepProps) => {

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

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const changeHandler: React.ChangeEventHandler<HTMLInputElement> = (evt) => {

    };
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const changeSelect: React.ChangeEventHandler<HTMLSelectElement> = (evt) => {

    };

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
                            value={capitalize(step[0])}
                            onChange={changeSelect} >
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
                            value={step[1]}
                            onChange={changeHandler} />

                        <input className="btn btn-primary"
                            type="submit" value="Submit" />
                        <input className="btn btn-primary"
                            type="reset" value="Reset" />
                        <div>Statement hint here</div>
                    </div>
                </div>
            </form>

        </>
    );
};