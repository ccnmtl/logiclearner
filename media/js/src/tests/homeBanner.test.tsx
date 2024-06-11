import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HomeBanner } from '../homebanner';

describe('Initial test', () => {
    const renderComponent = () => render(<HomeBanner />);
    it('Should render the HomeBanner component', () => {
        const { getByTestId } = renderComponent();
        const component = getByTestId('HomeBanner');
        expect(component).toBeVisible();
    });
});
