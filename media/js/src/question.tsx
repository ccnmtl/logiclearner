import React from 'react';
import { useNavigate } from 'react-router-dom';
import { checkQuestion, raw2latex } from './utils';

type Statement = {
    pk: number;
    question: string;
    answer: string;
    difficulty: number;
    created_at: string;
}

interface QuestionProps {
    statement: Statement;
    listNum: number;
    id: number;
    level: string;
}

export const Question: React.FC<QuestionProps> = (
    { statement, listNum, id, level }: QuestionProps) => {

    const navigate = useNavigate();

    const exerciseSpaceHandler = () => {
        const initData: QuestionProps = {
            statement: statement,
            listNum: listNum,
            id: id,
            level: level,
        };
        const qstate = [...new Array<QuestionProps>(initData)];
        window.localStorage.setItem('exerciseSpace',
            JSON.stringify(qstate));

        navigate('/exercise/');
    };

    // eslint-disable-next-line max-len
    const quesText: string = (statement.answer !== ('T' || 'F')) ? 'is logically equivalent to' : 'is a';
    const answer: string = raw2latex(checkQuestion(statement.answer));
    const question = raw2latex(statement.question);
    return (
        <div className="p-3 mb-2 bg-light w-50 text-dark"
            onClick={exerciseSpaceHandler}>
            <span className="h2">{listNum + 1} </span>
            Prove that
            <span className="text-danger"> {question} </span>
            {quesText}
            <span className="text-primary"> {answer}</span>

        </div>
    );
};
