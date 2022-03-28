import React from 'react';
import { useNavigate } from 'react-router-dom';
import { checkQuestion, raw2latex, Statement,
    Status } from './utils';

export const STATIC_URL = LogicLearner.staticUrl;

interface QuestionProps {
    statement: Statement;
    id: number;
    level: string;
    idStr: string;
    questionStatus: string;
}

export const Question: React.FC<QuestionProps> = (
    { statement, idStr, questionStatus }: QuestionProps) => {

    const navigate = useNavigate();

    const exerciseSpaceHandler = () => {
        navigate('/exercise/' + idStr);
    };

    const status: Status = {
        null: 'initial',
        inprogress: 'inprogress',
        complete: 'complete',
        '': 'initial'
    };

    const quesText: string =
    (statement.answer === 'F') || (statement.answer === 'T')
        ? 'is a'
        : 'is logically equivalent to';

    const answer: string =
        checkQuestion(statement.answer) === 'Tautology'
        || checkQuestion(statement.answer) === 'Fallacy'
            ? checkQuestion(statement.answer)
            : raw2latex(checkQuestion(statement.answer));

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
            <div className={`cardset-card__status icon-status
                    icon-status-${status[questionStatus]}`}
            aria-label={`Status: ${status[questionStatus]}`} >
                <img src={
                    `${STATIC_URL}img/icon-status-${status[questionStatus]}.svg`
                }
                title={`Status: ${status[questionStatus]}`} />
            </div>
            <div className="cardset-card__prompt">
                &rsaquo;
            </div>
        </li>
    );
};