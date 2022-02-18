import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkQuestion, raw2latex, ExerciseData, Statement,
    Status } from './utils';

interface QuestionProps {
    statement: Statement;
    listNum: number;
    id: number;
    level: string;
    idStr: string;
}

export const Question: React.FC<QuestionProps> = (
    { statement, listNum, id, level, idStr }: QuestionProps) => {

    const navigate = useNavigate();

    const exerciseSpaceHandler = () => {
        navigate('/exercise/' + idStr);
    };

    const [questionStatus, setQuestionStatus] = useState('');
    const getQuestionStatus = () => {
        try {
            const data = JSON.parse(
                window.localStorage.getItem(
                    'question-' + idStr)) as ExerciseData[];
            const questStatus = data[0].status;
            setQuestionStatus(questStatus);
        } catch (error) {
            setQuestionStatus(null);
        }
    };

    const status: Status = {
        null: 'initial',
        inprogress: 'inprogress',
        complete: 'complete'
    };


    useEffect(() => {
        void getQuestionStatus();
    }, []);

    const quesText: string = (statement.answer !== ('T' || 'F')) ?
        'is logically equivalent to' : 'is a';
    const answer: string = raw2latex(checkQuestion(statement.answer));
    const question = raw2latex(statement.question);

    return (
        <li className="cardset-card"
            onClick={exerciseSpaceHandler} data-testid={'question'}>
            <div className="cardset-card__number">
                {listNum + 1}
            </div>
            <div className="cardset-card__title">
                Prove that <span className="question-statement">
                    {question}
                </span> {quesText} <span className="question-statement">
                    {answer}</span>.
            </div>
            <div className="cardset-card__status"
                aria-label="Status: in progress">
                {status[questionStatus]}
            </div>
        </li>
    );
};