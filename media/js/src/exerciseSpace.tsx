import React, { useEffect, useState } from 'react';
import { getStatement, Statement, checkQuestion, Solution,
    raw2latex, getSolutions, ExerciseData, Status, Level,
    getHints, Tools, HintData } from './utils';
import { useParams } from 'react-router-dom';
import { SolutionStep } from './solutionStep';
import { Modal } from './modal';
import { ModalLawsheet } from './modalLawsheet';
import { ModalKeybinding } from './modalKeybinding';

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
    const [showResetModal, setShowResetModal] = useState<boolean>(false);
    const [questionStatus, setQuestionStatus] = useState('');
    const [stepList, setStepList] = useState<[string, string][]>([]);
    const [hint, setHint] = useState<[string, string]>(['','']);
    const [nextStep, setNextStep] = useState('');  // user's proposed next step
    const [nextRule, setNextRule] = useState('');  // user's proposed rule
    const [hintButtonCount, setHintButtonCount] = useState<number>(0);
    const [isIncomplete, setIsIncomplete] = useState<boolean>(true);

    async function fetchStatement() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const json: Statement = await getStatement(Number(id));
        setStatement(json);
        return json;
    }
    async function fetchSolutions() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const json: Array<Solution> = await getSolutions(Number(id));
        setSolutions(json);
    }
    const getQuestionData = () => {
        try {
            const data = JSON.parse(
                window.localStorage.getItem(
                    'question-' + id)) as ExerciseData[];
            const questStatus = data[0].status;
            const stepList = data[0].stepList;
            setQuestionStatus(questStatus);
            setStepList(stepList);
            setIsIncomplete(data[0].status !== 'complete');
        } catch (error) {
            setQuestionStatus(null);
        }
    };
    const isQuestionData = (id: string): ExerciseData[] => {
        return JSON.parse(
            window.localStorage.getItem('question-' + id)) as ExerciseData[];
    };
    const setSolutionStepData = (statement: Statement, level: string) => {

        const initData: ExerciseData = {
            statement: statement,
            id: Number(id),
            level: level,
            status: null,
            stepList: [],
            hintCount: 0,
            hints: [],
            idStr: id
        };
        const data = isQuestionData(id);
        const exerciseState = [...new Array<ExerciseData>(initData)];
        return data ? data : window.localStorage.setItem('question-' + id,
            JSON.stringify(exerciseState));
    };
    async function fetchHints() {
        const hintData: HintData = {
            next_expr: '',
            rule: '',
            step_list: [''],
            answer: ''
        };
        //Only if we don't already have hints
        if (hintButtonCount === 0) {
            //Set up initial hints call with no entry.
            if (!nextStep && stepList.length === 0) {

                hintData['next_expr'] = statement.question;
                hintData['rule'] = 'Start';
                hintData['step_list'] = [statement.question];
                hintData['answer'] = statement.answer;

                // eslint-disable-next-line max-len
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                const toolsData: Tools = await getHints(hintData);
                setHint([toolsData.hintRule, toolsData.hintExpression]);
            } else {
                let lastCorrectStep = '';
                if (stepList.length > 0){
                    lastCorrectStep = stepList[stepList.length - 1][1];
                } else {
                    lastCorrectStep = statement.question;
                }
                hintData['next_expr'] = nextStep;
                hintData['rule'] = nextRule;
                hintData['step_list'] = [lastCorrectStep];
                hintData['answer'] = statement.answer;
                // eslint-disable-next-line max-len
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                const toolsData: Tools = await getHints(hintData);
                setHint([toolsData.hintRule, toolsData.hintExpression]);
            }
        }
    }

    const handleShowSolutions = (
        evt: React.MouseEvent<HTMLButtonElement>
    ): void => {
        evt.preventDefault();
        setShowSolutions(solutions && !showSolutions);
    };
    const handleResetModal = (
        evt: React.MouseEvent<HTMLButtonElement>): void => {
        evt.preventDefault();
        setShowResetModal(true);
    };
    const handleHints = (
        evt: React.MouseEvent<HTMLButtonElement>): void => {
        evt.preventDefault();
        if (hintButtonCount === 2){
            setHintButtonCount(0);
        } else {
            setHintButtonCount(hintButtonCount + 1);
        }
        void fetchHints();
    };
    const handleNextQuestion = () => {
        //TBD
    };
    const modalCancel = () => {
        setShowResetModal(false);
    };
    const resetFunc = () => {
        window.localStorage.removeItem(
            'question-' + id);
        setStepList([]);
        setIsIncomplete(true);
    };

    const status: Status = {
        null: 'initial',
        inprogress: 'inprogress',
        complete: 'complete'
    };

    const showSolutionBtn = stepList.length >= 2;
    // eslint-disable-next-line max-len
    const quesText: string = (statement.answer === 'F') || (statement.answer === 'T')
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

    useEffect(() => {
        void fetchStatement().then((statement: Statement) => {
            const level: string = levels[statement.difficulty];
            setSolutionStepData(statement, level);
        });
        {void fetchSolutions();}
        {getQuestionData();}

    }, []);

    return (
        <>
            <header className="main-banner exercise-space-banner sticky-top">
                <div className="container d-flex justify-content-start">
                    <div className="main-banner__prompt">
                        <a href={`/questions/${statement.difficulty}`}>
                        &lsaquo;
                        </a>
                    </div>
                    <figure className="main-banner__avatar align-self-center"
                        aria-hidden="true">
                        <img src={
                            `${STATIC_URL}img/sonobe-1.svg`
                        } />
                    </figure>
                    <h1 className="align-self-center">
                        <a href={`/questions/${statement.difficulty}`}>
                            <span className="main-banner__subhead">
                                LEVEL {statement.difficulty + 1}:
                            </span>
                            <span className="main-banner__title">{level}</span>
                        </a>
                    </h1>
                    <div className="ms-auto align-self-center text-end">
                        <button
                            className="btn btn-light ll-button btn-shrink
                                me-0 me-md-1 mb-2 mb-md-0"
                            data-bs-toggle="modal"
                            data-bs-target="#lawSheetModal">
                            <span className="ll-icons ll-button__icon">
                                <img src={
                                    `${STATIC_URL}img/icon-clipboard.svg`
                                } />
                            </span>
                            <span className="ll-button__text">Law sheet</span>
                        </button>
                        <button
                            className="btn btn-light ll-button btn-shrink"
                            data-bs-toggle="modal"
                            data-bs-target="#keyBindingModal">
                            <span className="ll-icons ll-button__icon">
                                <img src={
                                    `${STATIC_URL}img/icon-keyboard.svg`
                                } />
                            </span>
                            <span className="ll-button__text">
                                Logic symbols
                            </span>
                        </button>
                    </div>
                </div>
            </header>
            <section className="container content-body exercise-space"
                id="maincontent" data-testid={'exerciseSpace'}>
                <p className="question fs-2">
                    Prove that <span className="question-statement">
                        {question}
                    </span> {quesText} <span className="question-statement">
                        {answer}
                    </span>.
                </p>
                <p className="text-secondary text-end">
                    (Status: {status[questionStatus]})
                </p>
                <div className="exercise-solution">
                    {showResetModal && (
                        <Modal
                            title={'Reset'}
                            bodyText={'Are you sure you want to reset? ' +
                            'You will lose all work for this question.'}
                            cancelText={'Close'}
                            cancelFunc={modalCancel}
                            resetFunc={resetFunc}/>
                    )}
                    {isPastSteps && stepList.map(
                        (step: [string, string], idx) => {
                            return (
                                <SolutionStep
                                    statement={statement}
                                    id={id}
                                    level={level}
                                    step={step}
                                    stepList={stepList}
                                    key={idx}
                                    idx={idx}
                                    setStepList={setStepList}
                                    hint={hint}
                                    setHint={setHint}
                                    nextStep={nextStep}
                                    nextRule={nextRule}
                                    setNextStep={setNextStep}
                                    setNextRule={setNextRule}
                                    hintButtonCount={hintButtonCount}
                                    setHintButtonCount={setHintButtonCount}
                                    setIsIncomplete={setIsIncomplete}
                                    setQuestionStatus={setQuestionStatus} />
                            );
                        }
                    )}
                    {isIncomplete && (
                        <SolutionStep
                            statement={statement}
                            id={id}
                            level={level}
                            step={['','']}
                            stepList={stepList}
                            setStepList={setStepList}
                            idx={stepList.length + 1}
                            hint={hint}
                            setHint={setHint}
                            nextStep={nextStep}
                            nextRule={nextRule}
                            setNextStep={setNextStep}
                            setNextRule={setNextRule}
                            hintButtonCount={hintButtonCount}
                            setHintButtonCount={setHintButtonCount}
                            setIsIncomplete={setIsIncomplete}
                            setQuestionStatus={setQuestionStatus} />
                    )}
                    {!isIncomplete && (
                        <>
                            <div>You&apos;ve completed this question!</div>

                            {/* eslint-disable-next-line max-len */}
                            {/* <button onClick={handleNextQuestion}>Next</button> */}
                            <a className={'btn btn-sm btn-primary'}
                                href={`/questions/${statement.difficulty}`}>
                                LEVEL {statement.difficulty + 1}: {level}
                            </a>
                        </>
                    )}
                    <div className="solution-actions">
                        <button onClick={handleHints}
                            disabled={hintButtonCount === 2}
                            className="btn btn-lg ll-button
                            mx-3 my-2 my-md-0">
                            <span className="ll-button__text">
                                I need a hint
                            </span>
                        </button>
                        <button
                            // disabled={!showSolutionBtn}
                            onClick={handleShowSolutions}
                            className="btn btn-lg ll-button
                                mx-3 my-2 my-md-0">
                            <span className="ll-button__text">
                                Show solution
                            </span>
                        </button>
                        <button
                            onClick={handleResetModal}
                            className="btn btn-lg ll-button mx-3 my-2 my-md-0">
                            <span className="ll-button__text">
                                Reset proof
                            </span>
                        </button>
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
            </section>
            <ModalLawsheet />
            <ModalKeybinding />
        </>
    );
};
