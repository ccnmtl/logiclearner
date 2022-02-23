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

describe('Initial test', () => {
    const renderComponent = () => render(
        <MemoryRouter>
            <SolutionStep statement={statement}
                id={'1'}
                level={'Novice'}  />
        </MemoryRouter>);
    it('Should render the exercise component', () => {
        const { getByTestId } = renderComponent();
        const component = getByTestId('exercise');
        expect(component).toBeVisible();
    });
});