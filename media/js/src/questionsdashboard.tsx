import React, { useState, useEffect } from 'react';
import { getStatements, Statement, ExerciseData,
    completionCount } from './utils';
import { Question } from './question';

interface QuestionsDashboardProps {
    difficulty: number;
    level: string;
}

export const STATIC_URL = LogicLearner.staticUrl;

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
            <header className="main-banner">
                <div className="container d-flex justify-content-start">
                    <figure className="main-banner__avatar align-self-center"
                        aria-hidden="true">
                        <img src={
                            `${STATIC_URL}img/sonobe-${difficulty + 1}.svg`
                        } />
                    </figure>
                    <h1 className="align-self-center">
                        <span className="main-banner__subhead">
                            LEVEL {difficulty + 1}
                        </span>
                        <span className="main-banner__title">
                            {level}
                        </span>
                        <span className="main-banner__text">
                            Some descriptive text here
                        </span>
                    </h1>
                    <div className="ms-auto fs-4 q-completion align-self-center"
                        aria-label="Questions completed">
                        {completedCount}/{levelCount}
                    </div>
                </div>
            </header>

            <div className="d-flex flex-column mt-5 justify-content-center
                            align-items-center"
            data-testid={'QuestionDashboard'}>
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