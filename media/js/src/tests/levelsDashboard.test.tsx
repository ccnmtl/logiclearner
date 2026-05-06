import React from 'react';
import { render } from '@testing-library/react';
import { PropositionalDashboard } from '../propositionalashboard';

describe('Initial test', () => {
    const renderComponent = () => render(<PropositionalDashboard />);
    it('Should render the LevelsDashboard component', () => {
        const { getByTestId } = renderComponent();
        const component = getByTestId('LevelsDashboard');
        expect(component).toBeVisible();
    });
});
