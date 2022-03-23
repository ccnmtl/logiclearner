import React from 'react';
import { render } from '@testing-library/react';
import { SolutionStep } from './solutionStep';
import { MemoryRouter } from 'react-router-dom';

const statement = {
    pk: 1,
    question: 'testing',
    answer: 'exercise',
    difficulty: 0,
    created_at: 'date'
};

const setStepList = () => {return 'test';};
const setHint = () => {return 'test';};
const setStateStep = () => {return 'test';};
const setHintButtonCount = () => {return 'test';};
const setIsIncomplete = () => {return 'test';};
const setQuestionStatus = () => {return 'test';};

describe('Initial test', () => {
    const renderComponent = () => render(
        <MemoryRouter>
            <SolutionStep statement={statement}
                id={'1'}
                level={'Novice'}
                step={['Commutativity', '(pvq)v(pv~q)']}
                stepList={[['test', 'test']]}
                setStepList={setStepList}
                idx={10}
                isIncomplete={true}
                hint={['', '']}
                setHint={setHint}
                stateStep={['', '']}
                setStateStep={setStateStep}
                hintButtonCount={0}
                setHintButtonCount={setHintButtonCount}
                setIsIncomplete={setIsIncomplete}
                setQuestionStatus={setQuestionStatus}  />
        </MemoryRouter>);
    it('Should render the exercise component', () => {
        const { getByTestId } = renderComponent();
        const component = getByTestId('exercise');
        expect(component).toBeVisible();
    });
});