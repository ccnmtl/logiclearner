import React, { useEffect, useState } from 'react';
import { ExerciseData, Statement, capitalize, HintData,
    getHints, Tools, latex2raw, updateLocalStepList,
    updateLocalQuestionStatus } from './utils';

interface SolutionStepProps {
    statement: Statement;
    id: string;
    level: string;
    step: [string, string],
    stepList: [string, string][],
    setStepList: React.Dispatch<React.SetStateAction<[string, string][]>>,
    idx: number,
    hint: [string, string],
    setHint:  React.Dispatch<React.SetStateAction<[string, string]>>,
    nextStep: string,
    nextRule: string,
    setNextStep: React.Dispatch<React.SetStateAction<string>>,
    setNextRule: React.Dispatch<React.SetStateAction<string>>,
    hintButtonCount: number;
    setHintButtonCount: React.Dispatch<React.SetStateAction<number>>,
}
const laws: Array<string> = ['Identity', 'Negation', 'Domination',
    'Idempotence', 'Commutativity', 'Associativity', 'Absorption', 'Demorgan"s',
    'Literal Negation', 'Distributivity', 'Double Negation',
    'Implication as Disjunction', 'Iff to Implication'];

export const SolutionStep: React.FC<SolutionStepProps> = (
    {statement, id, level, step, stepList, idx, setStepList,
        hint, hintButtonCount, nextStep, setNextStep, setNextRule,
        nextRule, setHint, setHintButtonCount
    }: SolutionStepProps) => {

    const [error, setError] = useState('');

    const setSolutionStepData = () => {
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
        const exerciseState = [...new Array<ExerciseData>(initData)];
        window.localStorage.setItem('question-' + id,
            JSON.stringify(exerciseState));
    };

    const handleDeleteStep = (
        evt: React.MouseEvent<HTMLButtonElement>): void => {
        evt.preventDefault();
        const data = JSON.parse(
            window.localStorage.getItem(
                'question-' + id)) as ExerciseData[];
        data[0].stepList.pop();
        window.localStorage.setItem('question-' + id,
            JSON.stringify(data));
        setStepList(data[0].stepList);
    };

    const handleStatementInput = (
        evt: React.ChangeEvent<HTMLInputElement>): void => {
        setNextStep(evt.currentTarget.value);
        setError('');
    };

    const handleLawSelect = (
        evt: React.ChangeEvent<HTMLSelectElement>): void => {
        setNextRule(evt.target.value);
    };

    async function validateStep() {
        const hintData: HintData = {
            next_expr: '',
            rule: '',
            step_list: [''],
            answer: ''
        };
        let lastCorrectStep = '';

        if(stepList.length > 0) {
            lastCorrectStep = stepList[stepList.length - 1][1];
        } else {
            lastCorrectStep = statement.question;
        }

        hintData['next_expr'] = latex2raw(nextStep);
        hintData['rule'] = nextRule.toLocaleLowerCase();
        hintData['step_list'] =[latex2raw(lastCorrectStep)];
        hintData['answer'] = statement.answer;
        // eslint-disable-next-line max-len
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const toolsData: Tools = await getHints(hintData);

        void validation(toolsData);
    }

    const validation = (respData: Tools) =>{

        if(!respData.isValid) {
            setError(respData.errorMsg);
        } else if(respData.isValid && !respData.isSolution) {

            //If the input is valid and not the solution, add to stepList
            //Change status to in progress.
            const step: [string, string] = [nextRule, nextStep];
            const newStepList = updateLocalStepList(id, step);
            updateLocalQuestionStatus(id, 'inprogress');
            setStepList(newStepList);
            setHint(['', '']);
            setHintButtonCount(0);

        } else if(respData.isValid && respData.isSolution) {

            //If the input is valid add to stepList,
            //and if completed change status to complete
            const step: [string, string] = [nextRule, nextStep];
            const newStepList = updateLocalStepList(id, step);
            updateLocalQuestionStatus(id, 'complete');
            setStepList(newStepList);
            setHint(['', '']);
            setHintButtonCount(2);
        }
    };

    const handleSubmit = (
        evt: React.MouseEvent<HTMLButtonElement>
    ): void => {
        evt.preventDefault();
        if(!nextStep) {
            setError('Please enter a statement.');
        } else {
            void validateStep();
        }
    };

    const isLast = idx === stepList.length + 1;
    const haveErrors = !error;
    const isLawHint = hintButtonCount > 0;
    const isStatementHint = hintButtonCount === 2;

    useEffect(() => {
        const data = JSON.parse(
            window.localStorage.getItem(
                'question-' + id)) as ExerciseData[];
        if(!data) {

            {void setSolutionStepData();}
        }
        setNextRule(laws[0]);
    }, []);

    return (
        <>
            <div className="solution-step">
                <p className="solution-step__prompt">
                    To begin this proof/Next,
                </p>
                <form>
                    <div className='solution-step__form row'
                        data-testid={'exercise'}>
                        <div className='col-12 col-md-4 mb-4 mb-md-0'>
                            <label htmlFor='laws' className='form-label'>
                                If I apply this law...
                            </label>
                            <select name='law'
                                id='laws' className='form-select'
                                defaultValue={capitalize(step[0])}
                                onChange={handleLawSelect}
                                disabled={step[0] === '' ? false : true} >
                                {laws.map((law, index) => {
                                    return (
                                        <option key={index} value={law}>
                                            {law}
                                        </option>
                                    );
                                })}
                            </select>
                            <div>{isLawHint && (
                                <div>{hint[0]}</div>
                            )}</div>
                        </div>
                        <div className='col-12 col-md-5 mb-4 mb-md-0'>
                            <label htmlFor='statementInput'
                                className='form-label'>
                                    then I&apos;ll get this statement...
                            </label>
                            <input type='text' className='form-control'
                                id='statementInput' aria-describedby='statement'
                                placeholder='Logic statement'
                                name='statement' defaultValue={step[1]}
                                onChange={handleStatementInput}
                                disabled={step[0] === '' ? false : true} />
                            <div>{isStatementHint && (
                                <div>{hint[1]}</div>
                            )}</div>
                        </div>
                        <div className="col-12 col-md-3 align-self-center
                            text-center text-md-left">
                            {isLast && (
                                <>
                                    <button
                                        type="reset"
                                        onClick={handleDeleteStep}
                                        className="btn ll-button btn-danger
                                            me-2">
                                        <span className="ll-button__text">
                                            Delete
                                        </span>
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        type="submit"
                                        className="btn ll-button btn-success
                                            me-2">
                                        <span className="ll-button__text">
                                            Go!
                                        </span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    {!haveErrors && (
                        <div className='row'>
                            <span className='text-danger'>{error}</span>
                        </div>
                    )}
                </form>
            </div>

        </>
    );
};