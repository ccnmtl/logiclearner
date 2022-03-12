import React, { useState, useEffect } from 'react';
import { HomeBanner } from './homebanner';
import {completionCount, getStatements, ExerciseData, Statement} from './utils';

export const STATIC_URL = LogicLearner.staticUrl;
const novice = 0;
const learner = 1;
const apprentice = 2;

export const LevelsDashboard: React.FC = () => {
    const [questionsList, setquestionsList] = useState([]);
    const [noviceCount, setnoviceCount] = useState<number>(0);
    const [learnerCount, setlearnerCount] = useState<number>(0);
    const [apprenticeCount, setapprenticeCount] = useState<number>(0);

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
        const novArr: Array<Statement>  = await getStatements(0);
        setnoviceCount(novArr.length);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const learnArr: Array<Statement>  = await getStatements(1);
        setlearnerCount(learnArr.length);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const apprenArr: Array<Statement>  = await getStatements(2);
        setapprenticeCount(apprenArr.length);
    }

    const completedNovice = completionCount(novice, questionsList);
    const completedLearner = completionCount(learner, questionsList);
    const completedApprentice = completionCount(apprentice, questionsList);

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
                            <img src={`${STATIC_URL}img/avatar-tutorial.svg`} />
                        </figure>
                        <div className="d-flex flex-column align-self-center
                            me-2 me-lg-0">
                            <div className="cardset-card__subhead">
                                Tutorial
                            </div>
                            <div className="cardset-card__title level-name">
                                <a href={'/tutorial/'}>Using Logic Learner</a>
                            </div>
                            <div className="cardset-card__text">
                                Learn how to use Logic Learner.</div>
                        </div>
                        <div className="cardset-card__prompt ms-auto">
                            <a href={'/tutorial/'}>&rsaquo;</a>
                        </div>
                    </li>
                    <li className="cardset-card">
                        <figure className="cardset-card__avatar">
                            <img src={`${STATIC_URL}img/avatar-level-1.svg`} />
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
                                Let’s get a handle on the basics of
                                propositional logic.</div>
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
                            <img src={`${STATIC_URL}img/avatar-level-2.svg`} />
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
                                Apply the basics, time to level up!</div>
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
                            <img src={`${STATIC_URL}img/avatar-level-3.svg`} />
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
                                Moving onward, challenge yourself.</div>
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
