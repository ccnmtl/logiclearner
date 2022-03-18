import React, { useEffect, useState } from 'react';
import { ExerciseData, Statement, HintData,
    getHints, Tools, latex2raw, updateLocalStepList,
    updateLocalQuestionStatus, capitalize, raw2latex } from './utils';

export const STATIC_URL = LogicLearner.staticUrl;

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
    setIsIncomplete: React.Dispatch<React.SetStateAction<boolean>>,
    setQuestionStatus: React.Dispatch<React.SetStateAction<string>>,
    blankSlate: string;
}
const laws: Array<string> = ['Absorption', 'Associativity', 'Commutativity',
    'De Morgan\'s Law', 'Distributivity', 'Domination', 'Double Negation',
    'Idempotence', 'Identity', 'Iff as Implication',
    'Implication as Disjunction', 'Literal Negation', 'Negation',];

export const SolutionStep: React.FC<SolutionStepProps> = (
    {statement, id, step, stepList, idx, setStepList,
        hint, hintButtonCount, nextStep, setNextStep, setNextRule,
        nextRule, setHint, setHintButtonCount, setIsIncomplete,
        setQuestionStatus, blankSlate
    }: SolutionStepProps) => {

    const [error, setError] = useState('');

    const handleDeleteStep = (
        evt: React.MouseEvent<HTMLButtonElement>): void => {
        evt.preventDefault();

        stepList.pop();

        const data = JSON.parse(
            window.localStorage.getItem(
                'question-' + id)) as ExerciseData[];
        setStepList(stepList);

        if (data[0].stepList.length === 1){
            setQuestionStatus(null);
            data[0].status = null;
            window.localStorage.setItem('question-' + id,
                JSON.stringify(data));
        }
        setError('');
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
        const hintData: HintData = {
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
        const toolsData: Tools = await getHints(hintData);

        validation(toolsData);
    }

    const validation = (respData: Tools) =>{

        if (!respData.isValid) {
            setError(respData.errorMsg);
        } else if (respData.isValid && !respData.isSolution) {

            //If the input is valid and not the solution, add to stepList
            //Change status to in progress.
            const step: [string, string] = [nextRule, nextStep];
            const newStepList: [string, string][] = updateLocalStepList(
                id, step);
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
            const newStepList = updateLocalStepList(id, step);
            updateLocalQuestionStatus(id, 'complete');
            setQuestionStatus('complete');
            setStepList(newStepList);
            setHint(['', '']);
            setHintButtonCount(2);
            setIsIncomplete(false);
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

    const isLast = idx === stepList.length - 1;
    const haveErrors = !error;
    const isLawHint = isLast && hintButtonCount > 0;
    const isStatementHint = isLast && hintButtonCount === 2;
    const isFirst = idx === 0 || blankSlate === 'blank1';

    useEffect(() => {
        setNextRule('Start');
    }, []);

    return (
        <>
            <div className={`solution-step
                    ${step[0] === '' ? ' editable' : ' readonly'}`}>
                <p className="solution-step__prompt">
                    {isFirst ? 'To begin this proof,' : 'Next,'}
                </p>
                <form>
                    <div className='solution-step__form row'
                        data-testid={'exercise'}>
                        <div className='col-12 col-md-4 mb-4 mb-md-0'>
                            <label htmlFor='laws' className='form-label'>
                                If I apply this law...
                            </label>
                            <select name='law'
                                id={`laws-${idx}`} className='form-select'
                                key={`${step[0]}-${idx}`}
                                onChange={handleLawSelect}
                                defaultValue={capitalize(step[0])}
                                disabled={step[0] === '' ? false : true} >
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
                                <div>{hint[0]}</div>
                            )}</div>
                        </div>
                        <div className='col-12 col-md-5 mb-4 mb-md-0'>
                            <label htmlFor='statementInput'
                                className='form-label'>
                                    then I&apos;ll get this statement...
                            </label>
                            <input type='text' className='form-control'
                                id={`statementInput-${idx}`}
                                aria-describedby='statement'
                                placeholder='Logic statement'
                                key={`statement-${idx}`}
                                name={`statement-${idx}`}
                                defaultValue={raw2latex(step[1])}
                                onChange={handleStatementInput}
                                disabled={step[0] === '' ? false : true} />
                            <div>{isStatementHint && (
                                <div>{hint[1]}</div>
                            )}</div>
                        </div>
                        <div className="col-12 col-md-3 align-self-center
                            text-center text-md-left">
                            {step[0] !== '' && (
                                <div className='solution-step__status
                                    icon-status' aria-label='Correct!'>
                                    <img src={`${STATIC_URL}img/icon-step-complete.svg`} alt="" /> {/* eslint-disable-line max-len */}
                                </div>
                            )}
                            {isLast && (
                                <>
                                    <button
                                        type="reset"
                                        onClick={handleDeleteStep}
                                        className="btn ll-button btn-danger
                                            me-3">
                                        <span className="ll-button__text">
                                            Delete
                                        </span>
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        type="submit"
                                        className="btn ll-button btn-success
                                            me-0">
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