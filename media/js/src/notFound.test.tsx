import React from 'react';
import { render } from '@testing-library/react';
import { NotFound } from './notFound';
import { MemoryRouter } from 'react-router-dom';

describe('Initial test', () => {
    const renderComponent = () => render(
        <MemoryRouter><NotFound /></MemoryRouter>);
    it('Should render the page not found component', () => {
        const { getByTestId } = renderComponent();
        const component = getByTestId('not-found');
        expect(component).toBeVisible();
    });
});
