import React, { useEffect } from 'react';
import { ExerciseData, Statement } from './utils';

interface ExerciseProps {
    statement: Statement;
    id: string;
    level: string;
}
const laws: Array<string> = ['Identity', 'Negation', 'Domination',
    'Idempotence', 'Commutativity', 'Associativity', 'Absorption', 'Demorgan"s',
    'Literal Negation', 'Distributivity', 'Double Negation',
    'Implication to Disjunction', 'Iff to Implication'];

export const Exercise: React.FC<ExerciseProps> = (
    {statement, id, level}: ExerciseProps) => {

    const setExerciseData = () => {
        const initData: ExerciseData = {
            statement: statement,
            id: Number(id),
            level: level,
            status: 'none',
            submittedData: [],
            hintCount: 0,
            hints: [],
            idStr: id
        };
        const exerciseState = [...new Array<ExerciseData>(initData)];
        window.localStorage.setItem('question-' + id,
            JSON.stringify(exerciseState));
    };

    useEffect(() => {
        {void setExerciseData();}
    }, []);

    return (
        <>
            <form>
                <div className='form-group row'>
                    <div className='col'>
                        <label htmlFor='laws' className='form-label'>
                            If I apply this law...
                        </label>
                        <select name='laws' id='laws' className='form-control'>
                            {laws.map((law, index) => {
                                return (
                                    <option key={index} value={law}>
                                        {law}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className='col'>
                        <label htmlFor='statementInput' className='form-label'>
                                then I&apos;ll get this statement...
                        </label>
                        <input type='text' className='form-control'
                            id='statementInput' aria-describedby='statement'
                            placeholder='Wizard like instructions' />

                        <input className="btn btn-primary"
                            type="submit" value="Submit" />
                        <input className="btn btn-primary"
                            type="reset" value="Reset" />
                    </div>
                </div>
            </form>

        </>
    );
};