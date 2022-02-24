import React, { useEffect, useState } from 'react';
import { getStatement, Statement, checkQuestion, Solution,
    raw2latex, getSolutions, ExerciseData, Status, Level } from './utils';
import { useParams } from 'react-router-dom';
import { SolutionStep } from './solutionStep';
import { Modal } from './modal';

export const STATIC_URL = LogicLearner.staticUrl;

export const ExerciseSpace: React.FC = () => {
    const { id } = useParams();
    const [statement, setStatement] = useState<Statement>({
        pk: null,
        question: '',
        answer: '',
        difficulty: null,
        created_at: ''
    });
    const [solutions, setSolutions] = useState<Solution[]>([]);
    const [showSolutions, setShowSolutions] = useState<boolean>(false);
    const [showLawsheetModal, setShowLawsheetModal] = useState<boolean>(false);
    const [showBindingModal, setShowBindingModal] = useState<boolean>(false);
    const [questionStatus, setQuestionStatus] = useState('');
    const [stepList, setStepList] = useState([]);

    async function fetchStatement() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const json: Statement = await getStatement(Number(id));
        setStatement(json);
    }

    async function fetchSolutions() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const json: Array<Solution> = await getSolutions(Number(id));
        setSolutions(json);
    }

    // eslint-disable-next-line max-len
    const quesText: string = (statement.answer == 'F') || (statement.answer == 'T')
        ? 'is a'
        : 'is logically equivalent to';
    const answer: string = raw2latex(checkQuestion(statement.answer));
    const question = raw2latex(statement.question);

    const levels: Level = {
        0: 'Novice',
        1: 'Learner',
        2: 'Apprentice'
    };
    const level: string = levels[statement.difficulty];
    const isPastSteps = stepList.length > 0;

    const handleShowSolutions = (
        evt: React.MouseEvent<HTMLButtonElement>
    ): void => {
        evt.preventDefault();

        setShowSolutions(solutions && !showSolutions);
    };
    const handleLawsheetModal = (
        evt: React.MouseEvent<HTMLButtonElement>): void => {
        evt.preventDefault();
        setShowLawsheetModal(true);
    };
    const handleBindingModal = (
        evt: React.MouseEvent<HTMLButtonElement>): void => {
        evt.preventDefault();
        setShowBindingModal(true);
    };
    const modalCancel = () => {
        setShowLawsheetModal(false);
        setShowBindingModal(false);
    };

    const getQuestionData = () => {
        try {
            const data = JSON.parse(
                window.localStorage.getItem(
                    'question-' + id)) as ExerciseData[];
            const questStatus = data[0].status;
            const stepList = data[0].stepList;
            setQuestionStatus(questStatus);
            setStepList(stepList);
        } catch (error) {
            setQuestionStatus(null);
        }
    };

    const status: Status = {
        null: 'initial',
        inprogress: 'inprogress',
        complete: 'complete'
    };
    const isIncomplete = status[questionStatus] !== 'complete';
    const showSolutionBtn = stepList.length >= 2;

    useEffect(() => {
        {void fetchStatement();}
        {void fetchSolutions();}
        {void getQuestionData();}
    }, []);

    return (
        <>
            <header className="main-banner exercise-space-banner sticky-top">
                <div className="container d-flex justify-content-start">
                    <figure className="main-banner__avatar align-self-center"
                        aria-hidden="true">
                        <img src={
                            `${STATIC_URL}img/sonobe-1.svg`
                        } />
                    </figure>
                    <h1 className="align-self-center">
                        <span className="main-banner__subhead">
                            LEVEL {statement.difficulty + 1}: </span>
                        <span className="main-banner__title">{level}</span>
                    </h1>
                    <div className="ms-auto fs-4 align-self-center">
                        <button className={'btn btn-outline-secondary'}
                            onClick={handleLawsheetModal}>
                            Law sheet
                        </button>
                        <button className={'btn btn-outline-secondary ms-3'}
                            onClick={handleBindingModal}>
                            Key bindings
                        </button>
                    </div>
                </div>
            </header>
            <div className="d-flex flex-column my-5 py-5 justify-content-center
                    align-items-center" data-testid={'exerciseSpace'}>
                <div className="container">
                    {showLawsheetModal && (
                        <Modal
                            title={'Laws'}
                            bodyText={'These are laws'}
                            cancelText={'Close'}
                            cancelFunc={modalCancel}/>
                    )}
                    {showBindingModal && (
                        <Modal
                            title={'Key Bindings'}
                            bodyText={'Here are key bindings'}
                            cancelText={'Close'}
                            cancelFunc={modalCancel}/>
                    )}
                    <div className='container'>
                        <div className='row justify-content-between'>
                            <div className='col-4 ps-0'>
                                Prove that
                                <span className="text-info"> {question} </span>
                                {quesText}
                                <span className="text-primary"> {answer}</span>
                            </div>
                            <div className="col-2">

                                {/* Question status goes here */}
                                <div className={status[questionStatus]}>
                                </div>
                            </div>
                        </div>
                    </div>
                    {isPastSteps && stepList.map(
                        (step: [string, string], idx) => {
                            return (
                                <SolutionStep
                                    statement={statement}
                                    id={id}
                                    level={level}
                                    step={step}
                                    key={idx} />
                            );
                        }
                    )}
                    {isIncomplete && (
                        <SolutionStep
                            statement={statement}
                            id={id}
                            level={level}
                            step={['', '']} />
                    )}

                    <div className="row">
                        <div className="col">
                            <button>I Need A Hint</button>
                        </div>
                        <div className="col">
                            <button disabled={!showSolutionBtn}
                                onClick={handleShowSolutions}>
                                Show Solution
                            </button>
                        </div>
                        <div className="col">
                            <button>Reset Proof</button>
                        </div>
                    </div>
                    {showSolutions && (
                        <div className="row">
                            <div className="col">
                                <ul className="list-group">
                                    {solutions.map((solution, idx) => {
                                        return (
                                            <li key={idx}
                                                className="list-group-item">
                                                {solution.text}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
