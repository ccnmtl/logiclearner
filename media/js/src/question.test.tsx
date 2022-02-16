import React from 'react';
import { render } from '@testing-library/react';
import { Question } from './question';
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
            <Question
                statement={statement}
                listNum={1}
                id={1}
                idStr={'1'}
                key={1}
                level={'Novice'} />
        </MemoryRouter>);
    it('Should render the Question component', () => {
        const { getByTestId } = renderComponent();
        const component = getByTestId('question');
        expect(component).toBeVisible();
    });
});