import React, { useState, useEffect } from 'react';
import {completionCount, getStatements, ExerciseData, Statement} from './utils';


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
            <div className="d-flex flex-column min-vh-100 justify-content-center
                            align-items-center" data-testid={'LevelsDashboard'}>
                <div className="card" style={{width: '20rem', height: '10rem'}}>
                    <div className="card-body">
                        <div className="text-center">
                            <p className="card-text">LEVEL I:</p>
                            <p>NOVICE</p>
                            <span className="float-end">
                                {completedNovice} / {noviceCount}
                            </span>
                            <div><a className={'btn btn-primary'}
                                href={'/questions/0'}>Level I</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card" style={{width: '20rem', height: '10rem'}}>
                    <div className="card-body">
                        <div className="text-center">
                            <p className="card-text">LEVEL II:</p>
                            <p>LEARNER</p>
                            <span className="float-end">
                                {completedLearner}/{learnerCount}
                            </span>
                            <div><a className={'btn btn-primary'}
                                href={'/questions/1'}>Level II</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card" style={{width: '20rem', height: '10rem'}}>
                    <div className="card-body">
                        <div className="text-center">
                            <p className="card-text">LEVEL III:</p>
                            <p>APPRENTICE</p>
                            <span className="float-end">
                                {completedApprentice}/{apprenticeCount}
                            </span>
                            <div><a className={'btn btn-primary'}
                                href={'/questions/2'}>Level III</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
