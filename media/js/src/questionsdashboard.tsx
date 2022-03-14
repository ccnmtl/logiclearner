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

    const LevelDescription = {
        0: 'Let’s get a handle on the basics of propositional logic.',
        1: 'Apply the basics, time to level up!',
        2: 'Moving onward, challenge yourself.'
    };

    async function fetchStatements() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const json: Array<Statement> = await getStatements(difficulty);
        setStatements(json);
    }
    const getQuestionList = () => {
        const keys = Object.keys(localStorage);
        const arrQs = [];
        for (const key of keys) {
            if (key.includes('question-')) {
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
    const completedCount = completionCount(difficulty, questionsList);

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
                        <img src={`${STATIC_URL}img/avatar-level-${difficulty + 1}.svg`} /> {/* eslint-disable-line max-len */}
                    </figure>
                    <h1 className="align-self-center pe-3">
                        <span className="main-banner__subhead">
                            LEVEL {difficulty + 1}
                        </span>
                        <span className="main-banner__title">
                            {level}
                        </span>
                        <span className="main-banner__text">
                            {LevelDescription[difficulty]}
                        </span>
                    </h1>
                    <div className="ms-auto fs-4 q-completion align-self-center"
                        aria-label="Questions completed">
                        {completedCount}/{levelCount}
                    </div>
                </div>
            </header>

            <section className="container content-body"
                id="maincontent"
                data-testid={'QuestionDashboard'}>
                <h2 id="cardset-label" className="text-center mb-4">
                    Questions in {level} level
                </h2>
                <ol className="cardset cardset-listnum"
                    aria-labelledby="cardset-label">
                    {statements.map((statement, idx) => {
                        return (<Question
                            statement={statement}
                            id={statement.pk}
                            idStr={statement.pk.toString()}
                            key={idx}
                            level={level} />);
                    })}
                </ol>
            </section>
        </>
    );
};
