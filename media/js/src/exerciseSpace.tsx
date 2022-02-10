import React, { useEffect } from 'react';
import { checkQuestion, ExerciseData, Statement } from './utils';

type QuestionData = {
    statement: Statement;
    listNum: number;
    id: number;
    level: string;
    idStr: string;
}

const laws: Array<string> = ['Identity', 'Negation', 'Domination',
    'Idempotence', 'Commutativity', 'Associativity', 'Absorption', 'Demorgan"s',
    'Literal Negation', 'Distributivity', 'Double Negation',
    'Implication to Disjunction', 'Iff to Implication'];

export const ExerciseSpace: React.FC = () => {

    const getQuestionData = (): QuestionData[] => {
        // eslint-disable-next-line max-len
        return JSON.parse(window.localStorage.getItem('questionData')) as QuestionData[];
    };

    const data: QuestionData[] = getQuestionData();

    const questionInfo = data[0];
    const statement = questionInfo.statement;
    const level = questionInfo.level;
    const idStr = questionInfo.idStr;
    const id = questionInfo.id;

    // eslint-disable-next-line max-len
    const quesText: string = (statement.answer !== ('T' || 'F')) ? 'is logically equivalent to' : 'is a';
    const answer: string = checkQuestion(statement.answer);

    const setExerciseData = () => {
        const initData: ExerciseData = {
            statement: statement,
            id: id,
            level: level,
            status: 'none',
            submittedData: [],
            hintCount: 0,
            hints: [],
            idStr: idStr
        };
        const exerciseState = [...new Array<ExerciseData>(initData)];
        window.localStorage.setItem('question-' + idStr,
            JSON.stringify(exerciseState));
    };

    useEffect(() => {
        void setExerciseData();
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