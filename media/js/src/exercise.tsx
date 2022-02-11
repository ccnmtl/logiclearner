import React, { useState, useEffect } from 'react';
import { checkQuestion, raw2latex, ExerciseData, Statement } from './utils';

interface ExerciseProps {
    statement: Statement;
    id: string;
}
const laws: Array<string> = ['Identity', 'Negation', 'Domination',
    'Idempotence', 'Commutativity', 'Associativity', 'Absorption', 'Demorgan"s',
    'Literal Negation', 'Distributivity', 'Double Negation',
    'Implication to Disjunction', 'Iff to Implication'];

export const Exercise: React.FC<ExerciseProps> = (
    {statement, id}: ExerciseProps) => {

    // eslint-disable-next-line max-len
    const quesText: string = (statement.answer !== ('T' || 'F')) ? 'is logically equivalent to' : 'is a';
    const answer: string = raw2latex(checkQuestion(statement.answer));
    const question = raw2latex(statement.question);
    const level: string = statement.difficulty === 0 ? 'Novice'
        : statement.difficulty === 1 ? 'Learner' : 'Apprentice';

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
            <div className="d-flex flex-column min-vh-100 justify-content-center
                            align-items-center">
                <div>LEVEL: {level}</div>
                <form>
                    <div className='form-group'>
                        <label htmlFor='statementInput'>
                            Prove that
                            {/* eslint-disable-next-line max-len */}
                            <span className="text-danger"> {question} </span>
                            {quesText}
                            <span className="text-primary"> {answer}</span>
                        </label>
                        <input type='text' className='form-control'
                            id='statementInput' aria-describedby='statement'
                            placeholder='Wizard like instructions' />
                    </div>
                    <select name='laws' id='laws'>
                        {laws.map((law, index) => {
                            return (
                                <option key={index} value={law}>{law}</option>
                            );
                        })}
                    </select>
                    <button type='button' className='btn btn-danger'>
                        Delete
                    </button>
                    <button type='submit' className='btn btn-primary'>
                        Go!
                    </button>
                </form>
            </div>
        </>
    );
};