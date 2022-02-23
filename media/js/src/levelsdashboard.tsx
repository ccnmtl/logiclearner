import React, { useState, useEffect } from 'react';
import { HomeBanner } from './homeBanner';
import {completionCount, getStatements, ExerciseData, Statement} from './utils';

export const STATIC_URL = LogicLearner.staticUrl;

export const LevelsDashboard: React.FC = () => {
    const [questionsList, setquestionsList] = useState([]);
    const [noviceCount, setnoviceCount] = useState<number>(0);
    const [learnerCount, setlearnerCount] = useState<number>(0);
    const [apprenticeCount, setapprenticeCount] = useState<number>(0);

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
        const novArr: Array<Statement>  = await getStatements(0);
        setnoviceCount(novArr.length);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const learnArr: Array<Statement>  = await getStatements(1);
        setlearnerCount(learnArr.length);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const apprenArr: Array<Statement>  = await getStatements(2);
        setapprenticeCount(apprenArr.length);
    }

    const completedNovice = completionCount('Novice', questionsList);
    const completedLearner = completionCount('Learner', questionsList);
    const completedApprentice = completionCount('Apprentice', questionsList);

    useEffect(() => {
        void getQuestionList();
        void fetchCounts();
    }, []);

    return (
        <>
            <HomeBanner />
            <section className="container content-body"
                id="maincontent"
                data-testid={'LevelsDashboard'}>
                <h2 id="cardset-label"
                    className="text-center mb-4">Choose a level</h2>
                <ol className="cardset cardset-levels"
                    aria-labelledby="cardset-label">
                    <li className="cardset-card">
                        <figure className="cardset-card__avatar">
                            <img src={`${STATIC_URL}img/sonobe-1.svg`} />
                        </figure>
                        <div className="d-flex flex-column align-self-center
                            me-2 me-lg-0">
                            <div className="cardset-card__subhead">
                                Level 1
                            </div>
                            <div className="cardset-card__title level-name">
                                <a href={'/questions/0'}>Novice</a>
                            </div>
                            <div className="cardset-card__text">
                                Easy peasy, get a handle on things</div>
                        </div>
                        <div className="cardset-card__status-count"
                            aria-label="Questions completed">
                            <a href={'/questions/0'}>
                                {completedNovice}/{noviceCount}
                            </a>
                        </div>
                        <div className="cardset-card__prompt">
                            <a href={'/questions/0'}>&rsaquo;</a>
                        </div>
                    </li>
                    <li className="cardset-card">
                        <figure className="cardset-card__avatar">
                            <img src={`${STATIC_URL}img/sonobe-2.svg`} />
                        </figure>
                        <div className="d-flex flex-column align-self-center
                            me-2 me-lg-0">
                            <div className="cardset-card__subhead">
                                Level 2
                            </div>
                            <div className="cardset-card__title level-name">
                                <a href={'/questions/1'}>Learner</a>
                            </div>
                            <div className="cardset-card__text">
                                Next level up, time to grow!</div>
                        </div>
                        <div className="cardset-card__status-count"
                            aria-label="Questions completed">
                            <a href={'/questions/1'}>
                                {completedLearner}/{learnerCount}
                            </a>
                        </div>
                        <div className="cardset-card__prompt">
                            <a href={'/questions/1'}>&rsaquo;</a>
                        </div>
                    </li>
                    <li className="cardset-card">
                        <figure className="cardset-card__avatar">
                            <img src={`${STATIC_URL}img/sonobe-3.svg`} />
                        </figure>
                        <div className="d-flex flex-column align-self-center
                            me-2 me-lg-0">
                            <div className="cardset-card__subhead">
                                Level 3
                            </div>
                            <div className="cardset-card__title level-name">
                                <a href={'/questions/2'}>Apprentice</a>
                            </div>
                            <div className="cardset-card__text">
                                Onward, smarty pants!</div>
                        </div>
                        <div className="cardset-card__status-count"
                            aria-label="Questions completed">
                            <a href={'/questions/2'}>
                                {completedApprentice}/{apprenticeCount}
                            </a>
                        </div>
                        <div className="cardset-card__prompt">
                            <a href={'/questions/2'}>&rsaquo;</a>
                        </div>
                    </li>
                </ol>
            </section>
        </>
    );
};
