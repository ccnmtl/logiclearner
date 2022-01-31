import React from 'react';
import { checkQuestion } from './utils';

type Statement = {
    pk: number;
    question: string;
    answer: string;
    difficulty: number;
    created_at: string;
}

interface QuestionProps {
    statement: Statement;
    idx: number;
    key: number;
}

export const Question: React.FC<QuestionProps> = (
    { statement, idx, key }: QuestionProps) => {
    // eslint-disable-next-line max-len
    const quesText: string = (statement.answer !== ('T' || 'F')) ? 'is logically equivalent to' : 'is a';
    const answer: string = checkQuestion(statement.answer);
    return (
        <div className="p-3 mb-2 bg-light w-50 text-dark"
            key={key}>
            <span className="h2">{idx + 1} </span>
            Prove that
            <span className="text-danger"> {statement.question} </span>
            {quesText}
            <span className="text-primary"> {answer}</span>
        </div>
    );
};
