import React, { useEffect, useState } from 'react';
import { shuffleArray, getRandomElement, GridItem, GridStatement,
    GridTemplate, Score } from './utils';
import { getTemplatesByDifficulty } from './statementGenerator';
import { Grid } from './grid';
import { Options } from './options';
import { StatementInput } from './statementInput';
import { Progress } from './progress';
import { useLocation } from 'react-router-dom';
import { FolBanner } from './folBanner';
import { rudderAnalytics } from '../../rudderstack/rudderstack';

export const STATIC_URL = LogicLearner.staticUrl;

interface FirstOrderLogicProps {
    mode: number;
}

export const FirstOrderLogic: React.FC<FirstOrderLogicProps> = ({mode}) => {
    const [correctStatement, setCorrectStatement] =
        useState<GridStatement|null>();
    const [correctIndex, setCorrectIndex] = useState<number|null>();
    const [difficulty, setDifficulty] = useState<string>('easy');
    const [grid, setGrid] = useState<GridItem[]>([]);
    const [options, setOptions] = useState<GridStatement[]>([]);
    const [size] = useState<number>(5);
    const [templateBank, setTemplateBank] = useState<object[]>(
        getTemplatesByDifficulty(difficulty)
    );
    const [text, setText] = useState<string>('');
    const emptyShow = [false, false, false, false];
    const [showList, setShowList] = useState<boolean[]>(emptyShow);
    const [isDone, setIsDone] = useState<boolean>(false);
    const [attempt, setAttempt] = useState<number>(4);

    const baseTally = [0, 0, 0, 0, 0];
    const baseScore = {
        easy: baseTally,
        medium: baseTally,
        hard: baseTally
    };
    const [score, setScore] = useState<Score>(baseScore);

    const [correctTemplate, setCorrectTemplate] =
        useState<GridTemplate>(getRandomElement(templateBank));

    const location = useLocation();

    const diffOptions = [  // [value, innerText]
        ['easy', 'Easy'],
        ['medium', 'Medium'],
        ['hard', 'Hard']
    ];

    function generateIncorrectStatements(templateBank, correctTemplate) {
        const incorrectStatements = [];
        const usedTemplates = new Set([correctTemplate]);

        // We'll attempt to gather 3 unique incorrect statements
        while (incorrectStatements.length < 3) {
            const randomTemplate = getRandomElement(templateBank);
            if (usedTemplates.has(randomTemplate)) {
                // Already used (or is the correct one)
                continue;
            }

            // Generate the statement
            const statementData = randomTemplate.generateStatements();
            // Check if it is satisfied by the *correct* grid
            const isSatisfied = randomTemplate.verifyStatementWithGrid(
                grid,
                statementData.details
            );

            if (!isSatisfied) {
                // Perfect: this statement does NOT match the current grid →
                // an incorrect option
                incorrectStatements.push({
                    naturalLanguageStatement:
                        statementData.naturalLanguageStatement,
                    formalFOLStatement:
                        statementData.formalFOLStatement,
                    details: statementData.details
                });
                usedTemplates.add(randomTemplate);
            }
        }
        return incorrectStatements;
    }

    const registerSkip = (diff:string) => {
        if (!isDone && attempt < 4) {
            setScore({...score, [diff]: score[diff].map((val, i) =>
                i === 4 ? val + 1 : val)});
        }
    };

    const handleDifficulty = (e) => {
        registerSkip(difficulty);
        setDifficulty(e.target.value);
    };

    const handleAttempt = (result:boolean) => {
        if (!isDone) {
            if (result) {
                setIsDone(true);
                setScore({...score,
                    [difficulty]: score[difficulty].map((val, i) =>
                        attempt === 4-i ? val + 1 : val)});
            } else {
                setAttempt(Math.max(attempt - 1, 1));
            }
        }
    };

    const reset = () => {
        let newArr = getRandomElement(templateBank);
        while (newArr === correctTemplate) {
            newArr = getRandomElement(templateBank);
        }
        setCorrectTemplate(newArr);
        setShowList(emptyShow);
        setText('');
        setAttempt(4);
        setIsDone(false);
    };

    const handleNewGrid = () => {
        registerSkip(difficulty);
        reset();
    };

    useEffect(() => {
        setTemplateBank(getTemplatesByDifficulty(difficulty));
        reset();
    }, [difficulty]);

    useEffect(() => {
        handleNewGrid();
    }, [mode]);

    useEffect(() => {
        setCorrectTemplate(getRandomElement(templateBank));
    }, [templateBank]);

    useEffect(() => {
        if (correctTemplate) {
            const statementData = correctTemplate.generateStatements();
            const generated = correctTemplate.generateGrid(
                true,
                statementData.details
            );

            setGrid(generated.grid);
            setText('');

            setCorrectStatement({
                naturalLanguageStatement:
                    statementData.naturalLanguageStatement,
                formalFOLStatement: statementData.formalFOLStatement,
                details: statementData.details
            });
        }
    }, [correctTemplate]);

    useEffect(() => {
        if (correctStatement) {
            const incorrectOptions =
                generateIncorrectStatements(templateBank, correctTemplate);

            const newOptions = [correctStatement, ...incorrectOptions];
            const uniqueOptions = newOptions
                .map(o => o.naturalLanguageStatement)
                .map(nl =>
                    newOptions.find(
                        o => o.naturalLanguageStatement === nl
                    )
                );
            shuffleArray(uniqueOptions);
            setOptions(uniqueOptions);
            setCorrectIndex(
                uniqueOptions.findIndex(
                    (opt) =>
                        opt.naturalLanguageStatement ===
                        correctStatement.naturalLanguageStatement
                )
            );
        }
    }, [correctStatement]);

    useEffect(() => {
        if (score != baseScore) {
            localStorage.setItem('fol', JSON.stringify(score));
        }
    }, [score]);

    useEffect(() => {
        // RudderStack page call
        rudderAnalytics.page({userId: 0, name: location});
        setShowList(emptyShow);
        const store = JSON.parse(localStorage.getItem('fol'));
        if (store) {
            setScore(store ?? baseScore);
        }
    }, []);

    useEffect(() => {
        if (
            window.rudderanalytics &&
            typeof window.rudderanalytics.page === 'function'
        ) {
            window.rudderanalytics.page({
                path: location.pathname,
                name: 'FirstOrderLogic',
            });
        }
    }, [location.pathname]);

    useEffect(() => {
        setShowList(emptyShow);
    }, [mode]);

    return (
        <>
            <FolBanner />
            <section className="container content-body exercise-space"
                id="maincontent">
                <div className="grid-level-progress">
                    <div className="grid-level-label me-2 pt-2">
                        Level:
                    </div>
                    <div className="me-3">
                        <select className='form-select'
                            onChange={handleDifficulty}>
                            {diffOptions.map((option, i) =>
                                <option key={i} value={option[0]}>
                                    {option[1]}
                                </option>)}
                        </select>
                    </div>
                    {mode === 0 &&
                        <Progress difficulty={difficulty} score={score} />}
                </div>
                <div className="row">
                    <div className="col-12 col-md-6">
                        <Grid grid={grid} size={size}
                            handleNewGrid={handleNewGrid}/>
                    </div>
                    {mode === 0 &&
                    <Options options={options}
                        correctIndex={correctIndex} showList={showList}
                        setShowList={setShowList}
                        handleAttempt={handleAttempt}/>}
                    {mode === 1 && correctStatement &&
                    <StatementInput correctStatement={correctStatement}
                        text={text} difficulty={difficulty}
                        setText={setText} />}
                </div>
            </section>
        </>
    );
};
