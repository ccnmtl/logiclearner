import React, { useEffect, useState } from 'react';
import { getStatement, Statement, checkQuestion, Solution,
    raw2latex, getSolutions } from './utils';
import { useParams } from 'react-router-dom';
import { Exercise } from './exercise';
import { Modal } from './modal';


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

    const quesText: string = (statement.answer !== ('T' || 'F')) ?
        'is logically equivalent to' : 'is a';
    const answer: string = raw2latex(checkQuestion(statement.answer));
    const question = raw2latex(statement.question);
    const level: string = statement.difficulty === 0 ? 'Novice'
        : statement.difficulty === 1 ? 'Learner'
            : statement.difficulty === 2 ? 'Apprentice' : '';

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

    useEffect(() => {
        {void fetchStatement();}
        {void fetchSolutions();}
    }, []);

    return (
        <>
            <div className="d-flex flex-column min-vh-100 justify-content-center
                    align-items-center">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <div>LEVEL: {level}</div>
                        </div>
                        <div className="col">
                            <button className={'btn'}
                                onClick={handleLawsheetModal}>
                                Lawsheet
                            </button>
                        </div>
                        <div className="col">
                            <button className={'btn'}
                                onClick={handleBindingModal}>
                                Keybindings
                            </button>
                        </div>
                    </div>
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
                    <div>
                    Prove that
                        <span className="text-danger"> {question} </span>
                        {quesText}
                        <span className="text-primary"> {answer}</span>
                    </div>
                    <Exercise
                        statement={statement}
                        id={id}
                        level={level} />

                    <div className="row">
                        <div className="col">
                            <button>I Need A Hint</button>
                        </div>
                        <div className="col">
                            <button onClick={handleShowSolutions}>
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