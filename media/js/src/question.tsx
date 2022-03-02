import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkQuestion, raw2latex, ExerciseData, Statement,
    Status } from './utils';

export const STATIC_URL = LogicLearner.staticUrl;

interface QuestionProps {
    statement: Statement;
    id: number;
    level: string;
    idStr: string;
}

export const Question: React.FC<QuestionProps> = (
    { statement, idStr }: QuestionProps) => {

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

    // eslint-disable-next-line max-len
    const quesText: string = (statement.answer == 'F') || (statement.answer == 'T')
        ? 'is a'
        : 'is logically equivalent to';
    const answer: string = raw2latex(checkQuestion(statement.answer));
    const question = raw2latex(statement.question);

    return (
        <li className="cardset-card cardset-card__button"
            onClick={exerciseSpaceHandler} data-testid={'question'}>
            <div className="cardset-card__title">
                Prove that <span className="question-statement">
                    {question}
                </span> {quesText} <span className="question-statement">
                    {answer}</span>.
            </div>
            <div className="cardset-card__status"
                aria-label={`Status: ${status[questionStatus]}`} >
                <img src={`${STATIC_URL}img/icon-status-${status[questionStatus]}.svg`} title="{`Status: ${status[questionStatus]}`}" /> {/* eslint-disable-line max-len */}
            </div>
            <div className="cardset-card__prompt">
                &rsaquo;
            </div>
        </li>
    );
};