import React from 'react';
import { checkQuestion } from './utils';

type Statement = {
    pk: number;
    question: string;
    answer: string;
    difficulty: number;
    created_at: string;
}

type ExerciseData = {
    statement: Statement;
    idx: number;
    key: number;
    level: string;
}


const laws: Array<string> = ['identity', 'negation', 'domination',
    'idempotence', 'commutativity', 'associativity', 'absorption', 'demorgan"s',
    'literal negation', 'distributivity', 'double negation',
    'implication to disjunction', 'iff to implication'];

export const ExerciseSpace: React.FC = () => {

    const getQuestion = (): ExerciseData[] => {
        // eslint-disable-next-line max-len
        return JSON.parse(window.localStorage.getItem('exerciseSpace')) as ExerciseData[];
    };

    const data: ExerciseData[] = getQuestion();

    const exerciseInfo = data[0];
    const statement = exerciseInfo.statement;
    const level = exerciseInfo.level;

    // eslint-disable-next-line max-len
    const quesText: string = (statement.answer !== ('T' || 'F')) ? 'is logically equivalent to' : 'is a';
    const answer: string = checkQuestion(statement.answer);

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
                            <span className="text-danger"> {statement.question} </span>
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
                    <button type='submit' className='btn btn-primary'>
                        Go
                    </button>
                </form>
            </div>
        </>
    );
};