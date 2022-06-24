import React, { useEffect, useState } from 'react';
import { ExerciseData, Statement, ApiData,
    getValidation, Tools, latex2raw, updateLocalStepList,
    updateLocalQuestionStatus, capitalize, raw2latex } from './utils';
import ReactGA from 'react-ga';

export const STATIC_URL = LogicLearner.staticUrl;

interface SolutionStepProps {
    statement: Statement;
    id: string;
    level: string;
    step: [string, string];
    stepList: [string, string][];
    setStepList: React.Dispatch<React.SetStateAction<[string, string][]>>;
    idx: number;
    hint: [string, string];
    setHint:  React.Dispatch<React.SetStateAction<[string, string]>>;
    nextStep: string;
    nextRule: string;
    setNextStep: React.Dispatch<React.SetStateAction<string>>;
    setNextRule: React.Dispatch<React.SetStateAction<string>>;
    hintButtonCount: number;
    setHintButtonCount: React.Dispatch<React.SetStateAction<number>>;
    setIsIncomplete: React.Dispatch<React.SetStateAction<boolean>>;
    setQuestionStatus: React.Dispatch<React.SetStateAction<string>>;
    isIncomplete: boolean;
    resetFunc(): void;
}
const laws: Array<string> = ['Absorption', 'Associativity', 'Commutativity',
    'De Morgan\'s Law', 'Distributivity', 'Domination', 'Double Negation',
    'Idempotence', 'Identity', 'Iff as Implication',
    'Implication as Disjunction', 'Negation'];

export const SolutionStep: React.FC<SolutionStepProps> = (
    {statement, id, step, stepList, idx, setStepList,
        hint, hintButtonCount, nextStep, setNextStep, setNextRule,
        nextRule, setHint, setHintButtonCount, setIsIncomplete,
        setQuestionStatus, isIncomplete, resetFunc, level
    }: SolutionStepProps) => {

    const [error, setError] = useState('');

    const isLast = idx === stepList.length - 1;
    const haveErrors = !error;
    const isLawHint = isLast && hintButtonCount > 0;
    const isStatementHint = isLast && hintButtonCount === 2;
    const isFirst = idx === 0;
    const showButtons = isLast && isIncomplete;
    const isEditable = isIncomplete && idx === stepList.length - 1;

    const handleDeleteStep = (
        evt: React.MouseEvent<HTMLButtonElement>): void => {
        evt.preventDefault();
        if (idx === 0) {
            Array.from(document.querySelectorAll('input')).forEach(
                input => (input.value = '')
            );
            Array.from(document.querySelectorAll('select')).forEach(
                select => (select.value = '')
            );
            setQuestionStatus(null);
            resetFunc();
        } else {
            const data = JSON.parse(
                window.localStorage.getItem(
                    'question-' + id)) as ExerciseData[];
            if (stepList.length !== data[0].stepList.length) {
                stepList.pop();
            } else {
                stepList.pop();
                data[0].stepList.pop();
                window.localStorage.setItem('question-' + id,
                    JSON.stringify(data));
            }
            const newStepList = [...stepList];
            setStepList(newStepList);
            setNext();
        }
        setError('');
        setHint(['', '']);
        setHintButtonCount(0);
    };
    const setNext = () => {
        setNextRule(stepList[idx - 1][0]);
        setNextStep(stepList[idx - 1][1]);
    };

    const handleStatementInput = (
        evt: React.ChangeEvent<HTMLInputElement>): void => {
        setNextStep(evt.currentTarget.value);
        evt.currentTarget.value = raw2latex(evt.currentTarget.value);
        setError('');
    };

    const handleLawSelect = (
        evt: React.ChangeEvent<HTMLSelectElement>): void => {
        setNextRule(evt.target.value);
    };

    async function validateStep() {
        const hintData: ApiData = {
            next_expr: '',
            rule: '',
            step_list: [''],
            answer: ''
        };
        let lastCorrectStep = '';

        if (stepList.length > 1) {
            lastCorrectStep = stepList[stepList.length - 2][1];
        } else {
            lastCorrectStep = statement.question;
        }

        hintData['next_expr'] = latex2raw(nextStep);
        hintData['rule'] = nextRule.toLocaleLowerCase();
        hintData['step_list'] =[latex2raw(lastCorrectStep)];
        hintData['answer'] = statement.answer;
        // eslint-disable-next-line max-len
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const toolsData: Tools = await getValidation(hintData);

        processResponse(toolsData);
    }

    const processResponse = (respData: Tools) =>{

        if (!respData.isValid) {
            setError(respData.errorMsg);
            ReactGA.event({
                category: 'Statements',
                action: 'Invalid',
                label: `${level},${statement.pk},${statement.question}`
            });
        } else if (respData.isValid && !respData.isSolution) {

            //If the input is valid and not the solution, add to stepList
            //Change status to in progress.
            const step: [string, string] = [nextRule, nextStep];
            const newStepList: [string, string][] = updateLocalStepList(
                id, idx, step);
            updateLocalQuestionStatus(id, 'inprogress');
            setQuestionStatus('inprogress');
            newStepList.push(['', '']);
            setStepList(newStepList);
            setHint(['', '']);
            setHintButtonCount(0);

        } else if (respData.isValid && respData.isSolution) {

            //If the input is valid add to stepList,
            //and if completed change status to complete
            const step: [string, string] = [nextRule, nextStep];
            const newStepList = updateLocalStepList(id, idx, step);
            updateLocalQuestionStatus(id, 'complete');
            setQuestionStatus('complete');
            setStepList(newStepList);
            setHint(['', '']);
            setHintButtonCount(2);
            setIsIncomplete(false);
            ReactGA.event({
                category: 'Statements',
                action: 'Completed a question',
                label: `${level},${statement.pk},${statement.question}`
            });
        }
    };

    const handleSubmit = (
        evt: React.MouseEvent<HTMLButtonElement>
    ): void => {
        evt.preventDefault();
        if (hintButtonCount === 2) {
            setHintButtonCount(0);
        }
        if (!nextStep) {
            setError('Please enter a statement.');
        } else {
            setError('');
            void validateStep();
        }
    };

    useEffect(() => {
        setNextRule('Start');
    }, []);

    return (
        <>
            <div className={`solution-step
                    ${isEditable ? ' editable' : ' readonly'}`}>
                <p className="solution-step__prompt">
                    {isFirst ? 'To begin this proof,' : 'Next,'}
                </p>
                <form>
                    <div className='solution-step__form row'
                        data-testid={'exercise'}>
                        <div className='col-12 col-md-4 mb-4 mb-md-0'>
                            <label htmlFor={`laws-${idx}`}
                                className='form-label'>
                                If I apply this law...
                            </label>
                            <select name='law'
                                id={`laws-${idx}`} className='form-select'
                                key={`${step[0]}-${idx}`}
                                onChange={handleLawSelect}
                                defaultValue={capitalize(step[0])}
                                disabled={!isEditable} >
                                <option value={''}>
                                    Choose One
                                </option>
                                {laws.map((law, index) => {
                                    return (
                                        <option key={index} value={law}>
                                            {law}
                                        </option>
                                    );
                                })}
                            </select>
                            <div>{isLawHint && (
                                <div role='alert'>Hint: use {hint[0]}</div>
                            )}</div>
                        </div>
                        <div className='col-12 col-md-5 mb-4 mb-md-0'>
                            <label htmlFor={`statementInput-${idx}`}
                                className='form-label'>
                                    then I&apos;ll get this statement...
                            </label>
                            <input type='text' className='form-control'
                                id={`statementInput-${idx}`}
                                placeholder='Logic statement'
                                key={`statement-${idx}`}
                                name={`statement-${idx}`}
                                defaultValue={raw2latex(step[1])}
                                onChange={handleStatementInput}
                                disabled={!isEditable} />
                            <div>{isStatementHint && (
                                <div role='alert'>Hint: type 
                                    <span className='text-highlight'>
                                        {hint[1]}
                                    </span>
                                </div>
                            )}</div>
                        </div>
                        <div className="col-12 col-md-3 align-self-center
                            text-center text-md-left
                            d-flex flex-row justify-content-center">
                            {!isEditable && (
                                <div className='solution-step__status
                                    icon-status'
                                role='status'>
                                    <span className='visually-hidden'>
                                        Your statement is correct!
                                    </span>
                                    <img src={`${STATIC_URL}img/icon-step-complete.svg`} alt='' /> {/* eslint-disable-line max-len */}
                                </div>
                            )}
                            {showButtons && (
                                <>
                                    <button
                                        onClick={handleSubmit}
                                        type="submit"
                                        className="btn ll-button btn-success
                                            order-2 me-0">
                                        <span className="ll-button__text">
                                            Go!
                                        </span>
                                    </button>
                                    <button
                                        type="reset"
                                        onClick={handleDeleteStep}
                                        className="btn ll-button btn-danger
                                            order-1 me-3">
                                        <span className="ll-button__text">
                                            Delete
                                        </span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    {!haveErrors && (
                        <div className='row' role='alert'>
                            <span className='text-danger'>{error}</span>
                        </div>
                    )}
                </form>
            </div>

        </>
    );
};
