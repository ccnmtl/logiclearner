import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkQuestion, raw2latex, ExerciseData, Statement } from './utils';

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
            setQuestionStatus('none');
        }

    };


    useEffect(() => {
        void getQuestionStatus();
    }, []);

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
            <span>
                {questionStatus}
            </span>
        </div>
    );
};
