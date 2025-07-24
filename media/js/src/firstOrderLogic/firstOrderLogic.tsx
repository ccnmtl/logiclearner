import React, { useEffect, useState } from 'react';
import { shuffleArray, getRandomElement, GridItem, GridStatement,
    GridTemplate } from './utils';
import { getTemplatesByDifficulty } from './statementGenerator';
import { Grid } from './grid';
import { Options } from './options';

export const STATIC_URL = LogicLearner.staticUrl;

export const FirstOrderLogic: React.FC = () => {
    const [correctStatement, setCorrectStatement] =
        useState<GridStatement|null>();
    const [correctIndex, setCorrectIndex] = useState<number|null>();
    const [difficulty, setDifficulty] = useState<string>('easy');
    const [grid, setGrid] = useState<GridItem[]>([]);
    const [options, setOptions] = useState<GridStatement[]>([]);
    const [size, setSize] = useState<number>(5);
    const [templateBank, setTemplateBank] = useState<Object[]>(getTemplatesByDifficulty(difficulty));
    const [value, setValue] = useState();
    const [isCorrect, setIsCorrect] = useState<boolean>(false);
    const [selected, setSelected] = useState<number|null>()

    const [correctTemplate, setCorrectTemplate] =
        useState<GridTemplate>(getRandomElement(templateBank));

    const diffOptions = [  // [value, innerText]
        ['easy', 'Easy'],
        ['medium', 'Medium'],
        ['hard', 'Hard']
    ];

    const inputOptions = [  // [value, innerText]
        ['mc', 'Multiple Choice'],
        ['text', 'Text Input']
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
            const isSatisfied = randomTemplate.verifyStatementWithGrid(grid, statementData.details);

            if (!isSatisfied) {
                // Perfect: this statement does NOT match the current grid → an incorrect option
                incorrectStatements.push({
                    naturalLanguageStatement: statementData.naturalLanguageStatement,
                    formalFOLStatement: statementData.formalFOLStatement,
                    details: statementData.details
                });
                usedTemplates.add(randomTemplate);
            }
        }
        return incorrectStatements;
    }

    const handleDifficulty = (e) => {
        setDifficulty(e.target.value);
    };

    const handleNewGrid = () => {
        let newArr = getRandomElement(templateBank)
        while (newArr === correctTemplate) {
            newArr = getRandomElement(templateBank)
        }
        setCorrectTemplate(newArr);
        setSelected(null);
    }

    const mkSelect = (options, action) => <select className='form-select mt-2'
        onChange={action}>
            {options.map((option, i) =>
                <option key={i} value={option[0]}>{option[1]}</option>)}
        </select>

    const settings = [
        mkSelect(diffOptions, handleDifficulty),
        mkSelect(inputOptions, () => alert('Needs implementation.')),
        <button className='btn btn-primary mt-2' onClick={handleNewGrid}>
            Next Grid
        </button>
    ]

    useEffect(() => {
        setTemplateBank(getTemplatesByDifficulty(difficulty));
    }, [difficulty]);

    useEffect(() => {
        setCorrectTemplate(getRandomElement(templateBank));
    }, [templateBank]);

    useEffect(() => {
        if (correctTemplate) {
            const statementData = correctTemplate.generateStatements();
            const generated = correctTemplate.generateGrid(true, statementData.details)
    
            setGrid(generated.grid);
            setValue(generated.satisfies);
            
            setCorrectStatement({
                naturalLanguageStatement: statementData.naturalLanguageStatement,
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
            const uniqueOptions = newOptions.map(o => o.naturalLanguageStatement)
                .map(nl => newOptions.find(o => o.naturalLanguageStatement === nl));
                shuffleArray(uniqueOptions);
            setOptions(uniqueOptions);
            setCorrectIndex(uniqueOptions.findIndex((opt) =>
                opt.naturalLanguageStatement === correctStatement.naturalLanguageStatement
            ));
        }
    }, [correctStatement]);

    useEffect(() => {
        setSelected(null);
    }, []);

    return <section id='grid-game'
        className='container d-flex justify-content-center'
    >
        <div className="row w-100">
            <div className='col-8'>
                <Grid grid={grid} size={size}/>
                <ul className='row'>
                    {settings.map((setting, i) =>
                        <li key={i} className='list-group-item col-4 px-2'>
                            {setting}
                        </li>)}
                </ul>
            </div>
            <Options options={options} correctIndex={correctIndex}
                isCorrect={isCorrect} setIsCorrect={setIsCorrect}
                selected={selected} setSelected={setSelected} />
        </div>
    </section>
}
