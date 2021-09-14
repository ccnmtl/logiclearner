import React from 'react';
import { render } from '@testing-library/react';
import { Nav } from './nav';

describe('Initial test', () => {
    const renderComponent = () => render(<Nav />);
    it('Should render the nav component', () => {
        const { getByTestId } = renderComponent();
        const component = getByTestId('nav');
        expect(component).toBeVisible();
    });
});
