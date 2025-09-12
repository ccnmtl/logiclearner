import React from 'react';
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
        <li className="cardset-card"
            data-testid={'question'} data-cy={`question${idStr}`}>
            <a href={`/exercise/${idStr}/`}
                className='cardset-card__button cardset-card__button-question'>
                <div className="cardset-card__title">
                    Prove that <span className="question-statement">
                        {question}
                    </span> {quesText} <span className="question-statement">
                        {answer}</span>.
                </div>
                <div className={`cardset-card__status icon-status
                        icon-status-${status[questionStatus]}`}
                role='status'
                aria-label={`Completion status:
                   ${status[questionStatus] === 'inprogress' ? 'In progress'
            : status[questionStatus] === 'complete'
                ? 'Completed'
                : 'Haven’t started'}`} >
                    <img src={`${STATIC_URL}img/icon-status-${status[questionStatus]}.svg`} title={`Status: ${status[questionStatus]}`} /> {/* eslint-disable-line max-len */}
                </div>
                <div className="cardset-card__prompt">
                    &rsaquo;
                </div>
            </a>
        </li>
    );
};