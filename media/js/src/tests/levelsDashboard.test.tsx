import React from 'react';
import { render } from '@testing-library/react';
import { LevelsDashboard } from '../levelsdashboard';

describe('Initial test', () => {
    const renderComponent = () => render(<LevelsDashboard />);
    it('Should render the LevelsDashboard component', () => {
        const { getByTestId } = renderComponent();
        const component = getByTestId('LevelsDashboard');
        expect(component).toBeVisible();
    });
});
