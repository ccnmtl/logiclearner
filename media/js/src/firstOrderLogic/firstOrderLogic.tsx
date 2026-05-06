import React, { useEffect, useRef, useState } from 'react';
import { shuffleArray, getRandomElement, GridItem, GridStatement,
    GridTemplate, Score, dTitle, Store, Difficulty} from './utils';
import { getTemplatesByDifficulty } from './statementGenerator';
import { Grid } from './grid';
import { Options } from './options';
import { StatementInput } from './statementInput';
import { Progress } from './progress';
import { FolBanner } from './folBanner';
import { ExpressButton } from './expressionButtons';

export const STATIC_URL = LogicLearner.staticUrl;

interface FirstOrderLogicProps {
    mode: number;
}

export const FirstOrderLogic: React.FC<FirstOrderLogicProps> = ({mode}) => {
    const sessionStartRef = useRef<number>(Date.now());
    const questionsAttemptedRef = useRef<number>(0);
    const correctAnswersRef = useRef<number>(0);

    const [correctStatement, setCorrectStatement] =
        useState<GridStatement|null>();
    const [correctIndex, setCorrectIndex] = useState<number|null>();
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [grid, setGrid] = useState<GridItem[]>([]);
    const [options, setOptions] = useState<GridStatement[]>([]);
    const [size] = useState<number>(5);
    const [templateBank, setTemplateBank] = useState<object[]>(
        getTemplatesByDifficulty(difficulty)
    );
    const [text, setText] = useState<string>('');
    const emptyShow = [false, false, false, false];
    const [showList, setShowList] = useState<boolean[]>(emptyShow);
    const [isDone, setIsDone] = useState<boolean>(true);
    const [attempt, setAttempt] = useState<number>(4);
    const [inBtnRange, setInBtnRange] = useState<boolean>(
        window.innerWidth < 768 || window.innerWidth >= 1400);

    const baseRounds = {
        easy: [],
        medium: [],
        hard: []
    };
    const [rounds, setRounds] = useState<Score>(baseRounds);
    const baseTally = [0, 0, 0, 0, 0];
    const baseScore = {
        easy: baseTally,
        medium: baseTally,
        hard: baseTally
    };
    const [score, setScore] = useState<Score>(baseScore);

    const [correctTemplate, setCorrectTemplate] =
        useState<GridTemplate>(getRandomElement(templateBank));

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

    /**
     * Increments the value in the Score object corresponding to
     * Score[difficulty][attempt]
     * @param check A check of the attempts index
     * @param obj Optional. Allows for new Score objects, like what is held in
     *            localStorage.
     */
    const handleScore = (check:(i:number)=>boolean, obj=score) =>
        setScore({...obj, [difficulty]: obj[difficulty].map(
            (val:number, i:number) => check(i) ? val + 1 : val)});

    /**
     * Adds an attempt, x, to the growing array of attempts
     * @param x Latest attempt
     */
    const handleRounds = (x:number) => setRounds({
        ...rounds, [difficulty]: [x, ...rounds[difficulty]]});

    const registerSkip = (diff:string, force=false) => {
        if (force || (mode === 0 && !isDone && attempt < 4)) {
            handleScore(i => i === 4);
            handleRounds(0);
        }
        if (!isDone) {
            track('fol_question_skipped', {
                fol_mode: mode === 0 ? 'match' : 'express',
                difficulty: diff,
            });
        }
    };

    const handleDifficulty = (e) => {
        registerSkip(difficulty);
        setDifficulty(e.target.value);
    };

    const track = (event: string, props: Record<string, unknown>) => {
        if (window.rudderanalytics &&
            typeof window.rudderanalytics.track === 'function') {
            window.rudderanalytics.track(event, props ?? {});
        } else {
            console.warn(
                'rudderanalytics.track not mounted yet',
                window.rudderanalytics
            );
        }
    };

    const mkBtnList = (title: string, items: string[]) => (
        <ExpressButton title={title} items={items}
            onClick={mkAddChar} />
    );

    const mkAddChar = (char:string) => {
        const el =
            document.getElementById('statement-text') as HTMLInputElement;
        const pos = el.selectionStart;
        const newText = el.value.substring(0, pos) + char +
            el.value.substring(pos, el.value.length);
        setText(newText);
        el.value = newText;
        el.focus();
        const newPos = pos !== null ? pos + char.length : newText.length;
        el.setSelectionRange(newPos, newPos);
    };

    const handleAttempt = (result:boolean) => {
        if (!isDone) {
            if (result) {
                setIsDone(true);
                if (mode === 0) {
                    handleScore(i => attempt === 4-i);
                    handleRounds(attempt);
                }
            } else {
                if (mode === 0) {
                    setAttempt(Math.max(attempt - 1, 1));
                }
            }
        }
        questionsAttemptedRef.current += 1;
        if (result) {
            correctAnswersRef.current += 1;
        }
        track('fol_question_attempted', {
            fol_mode: mode === 0 ? 'match' : 'express',
            difficulty,
            is_correct: result,
            attempts_remaining: attempt,
        });
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
        registerSkip(difficulty, !isDone);
        reset();
    };

    // Track game session start and end for session duration
    useEffect(() => {
        sessionStartRef.current = Date.now();
        questionsAttemptedRef.current = 0;
        correctAnswersRef.current = 0;

        track('fol_game_started', {
            fol_mode: mode === 0 ? 'match' : 'express',
        });

        return () => {
            const durationMs = Date.now() - sessionStartRef.current;
            track('fol_game_ended', {
                fol_mode: mode === 0 ? 'match' : 'express',
                duration_ms: durationMs,
                questions_attempted: questionsAttemptedRef.current,
                correct_answers: correctAnswersRef.current,
            });
        };
    }, [mode]);

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
            localStorage.setItem('fol', JSON.stringify({
                attempt, difficulty, rounds, score}));
        }
    }, [attempt, difficulty, rounds, score]);

    const checkLastAttempt = (store:Store) => {
        if (!store['attempt'] || store['attempt'] === 4) {
            setScore(store['score']);
            setRounds(store['rounds']);
        } else {
            handleScore(i => i === 4, store['score']);
            handleRounds(0);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', () => {
            setInBtnRange(
                window.innerWidth < 768 || window.innerWidth >= 1400);
        });

        setShowList(emptyShow);
        const store = JSON.parse(localStorage.getItem('fol'));
        if (store) {
            try {
                // Checks for the correct data models.
                if (['score', 'rounds'].map(check => Object.keys(baseScore)
                    .every(diff => Array.isArray(store[check][diff])))
                ) {
                    checkLastAttempt(store);
                } else {
                    setScore(baseScore);
                    setRounds(baseRounds);
                }
            } catch {
                setScore(baseScore);
                setRounds(baseRounds);
            }
        }
    }, []);

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
                            {Object.entries(dTitle).map((option, i) =>
                                <option key={i} value={option[0]}
                                    selected={option[0] === difficulty}>
                                    {option[1]}
                                </option>)}
                        </select>
                    </div>
                    {mode === 0 &&
                        <Progress difficulty={difficulty} score={score}
                            rounds={rounds}/>}
                </div>
                <div className="row">
                    <div className="col-12 col-md-6">
                        <Grid grid={grid} size={size} mode={mode}
                            mkBtnList={mkBtnList} inBtnRange={inBtnRange}/>
                    </div>
                    {mode === 0 &&
                    <Options options={options}
                        correctIndex={correctIndex} showList={showList}
                        setShowList={setShowList}
                        handleAttempt={handleAttempt}
                        handleNewGrid={handleNewGrid}/>}
                    {mode === 1 && correctStatement &&
                    <StatementInput correctStatement={correctStatement}
                        text={text} difficulty={difficulty}
                        setText={setText}
                        handleAttempt={handleAttempt}
                        handleNewGrid={handleNewGrid}
                        mkBtnList={mkBtnList}
                        inBtnRange={inBtnRange}
                        isDone={isDone} />}
                </div>
            </section>
            <div className="grid-actions d-md-none">
                <button id="next" className="btn btn-outline-primary"
                    onClick={handleNewGrid} >
                    {(mode === 0 ? showList[correctIndex] : isDone)
                        ? 'Next'
                        : 'Skip this'
                    } grid »
                </button>
            </div>
        </>
    );
};
