import React, { useState, useEffect } from 'react';
import { getStatements, Statement, ExerciseData,
    completionCount, deleteLevelData } from './utils';
import { Question } from './question';
import { Modal } from './modal';

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
    const [showResetLevelModal, setShowResetLevelModal] =
                                            useState<boolean>(false);

    const LevelDescription = {
        0: 'Let’s get a handle on the basics of propositional logic.',
        1: 'Apply the basics, time to level up!',
        2: 'Moving onward, challenge yourself.'
    };

    async function fetchStatements() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const json: Array<Statement> = await getStatements(difficulty);
        setStatements(json);
        setLevelCount(json.length);
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
    const completedCount = completionCount(difficulty, questionsList);

    const modalCancel = () => {
        setShowResetLevelModal(false);
    };
    const handleResetLevelModal = (
        evt: React.MouseEvent<HTMLButtonElement>): void => {
        evt.preventDefault();
        setShowResetLevelModal(true);
    };
    const resetLevel = () => {
        deleteLevelData(difficulty, questionsList);
        void getQuestionList();
    };

    useEffect(() => {
        void fetchStatements();
        void getQuestionList();
    }, []);

    return (
        <>
            <header className="main-banner">
                <div className="container d-flex justify-content-start">
                    <figure className="main-banner__avatar align-self-center"
                        aria-hidden="true">
                        <img src={
                            `${STATIC_URL}img/avatar-level-${
                                difficulty + 1}.svg`
                        } />
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
                    <div className="ms-auto q-completion align-self-center"
                        aria-label="Questions completed" role="status"
                        data-cy="questions-completed">
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
                <div className='level-cards-reset'>
                    <button
                        className="btn btn-light ll-button
                            level-cards-reset__btn"
                        onClick={handleResetLevelModal}>
                        <span className="ll-icons ll-button__icon">
                            <img alt=""
                                src={
                                    `${STATIC_URL}img/icon-reset.svg`
                                } />
                        </span>
                        <span className="ll-button__text">
                            Reset level
                        </span>
                    </button>
                </div>
                {showResetLevelModal && (
                    <Modal
                        title={'Reset'}
                        bodyText={'Are you sure you want to reset? ' +
                        'You will lose all work for this level.'}
                        cancelText={'Cancel'}
                        cancelFunc={modalCancel}
                        resetFunc={resetLevel}/>
                )}
                <ol className="cardset cardset-listnum"
                    aria-labelledby="cardset-label">
                    {statements.map((statement, idx) => {
                        let questionStatus = '';
                        try {
                            const data = JSON.parse(
                                window.localStorage.getItem(
                                    'question-' + statement.pk.toString()
                                )) as ExerciseData[];
                            questionStatus = data[0].status;
                        } catch (error) {
                            questionStatus = null;
                        }

                        return (<Question
                            statement={statement}
                            id={statement.pk}
                            idStr={statement.pk.toString()}
                            key={idx}
                            level={level}
                            questionStatus={questionStatus} />);
                    })}
                </ol>
            </section>
        </>
    );
};
