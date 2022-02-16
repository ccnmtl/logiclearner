import React, { useState, useEffect } from 'react';
import { getStatements, Statement, ExerciseData,
    completionCount } from './utils';
import { Question } from './question';

interface QuestionsDashboardProps {
    difficulty: number;
    level: string;
}

export const QuestionsDashboard: React.FC<QuestionsDashboardProps> = (
    {difficulty, level}: QuestionsDashboardProps) => {

    const [statements, setStatements] = useState<Statement[]>([]);
    const [questionsList, setquestionsList] = useState([]);
    const [levelCount, setLevelCount] = useState<number>(0);

    async function fetchStatements() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const json: Array<Statement> = await getStatements(difficulty);
        setStatements(json);
    }
    const getQuestionList = () => {
        const keys = Object.keys(localStorage);
        const arrQs = [];
        for (const key of keys) {
            if(key.includes('question-')) {
                const item = JSON.parse(
                    window.localStorage.getItem(key)) as ExerciseData[];
                arrQs.push(item);
            }
        }
        setquestionsList(arrQs);
    };
    async function fetchCounts() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const novArr: Array<Statement>  = await getStatements(difficulty);
        setLevelCount(novArr.length);
    }
    const completedCount = completionCount(level, questionsList);

    useEffect(() => {
        void fetchStatements();
        void getQuestionList();
        void fetchCounts();
    }, []);

    return (
        <>
            <div className="d-flex flex-column min-vh-100 justify-content-center
                            align-items-center"
            data-testid={'QuestionDashboard'}>
                <div className='container'>
                    <div className='row justify-content-center'>
                        <div className='col-4'>
                            <p>Level {difficulty + 1}
                                <span className='float-end'>
                                    {completedCount}/{levelCount}
                                </span>
                            </p>
                            <p className='h2'>{level}</p>
                            <p>One sentence description here</p>
                        </div>
                        <div className='col-4'>
                        </div>
                    </div>
                </div>
                {statements.map((statement, idx) => {
                    return (<Question
                        statement={statement}
                        listNum={idx}
                        id={statement.pk}
                        idStr={statement.pk.toString()}
                        key={idx}
                        level={level} />);
                })}
            </div>
        </>
    );
};