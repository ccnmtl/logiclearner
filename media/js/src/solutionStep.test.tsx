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
const setNextStep = () => {return 'test';};
const setNextRule = () => {return 'test';};
const setHintButtonCount = () => {return 'test';};

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
                hint={['', '']}
                setHint={setHint}
                nextStep={''}
                nextRule={''}
                setNextStep={setNextStep}
                setNextRule={setNextRule}
                hintButtonCount={0}
                setHintButtonCount={setHintButtonCount}  />
        </MemoryRouter>);
    it('Should render the exercise component', () => {
        const { getByTestId } = renderComponent();
        const component = getByTestId('exercise');
        expect(component).toBeVisible();
    });
});