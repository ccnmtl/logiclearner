import React from 'react';
import { render } from '@testing-library/react';
import { QuestionsDashboard } from './questionsDashboard';
import { MemoryRouter } from 'react-router-dom';

describe('Initial test', () => {
    const renderComponent = () => render(
        <MemoryRouter><QuestionsDashboard difficulty={0}
            level={'Novice'} /></MemoryRouter>);
    it('Should render the QuestionDashboard component', () => {
        const { getByTestId } = renderComponent();
        const component = getByTestId('QuestionDashboard');
        expect(component).toBeVisible();
    });
});