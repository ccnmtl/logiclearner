import React from 'react';
import { render } from '@testing-library/react';
import { ExerciseSpace } from '../exerciseSpace';

describe('Initial test', () => {
    const renderComponent = () => render(<ExerciseSpace />);
    window.scrollTo = jest.fn();
    it('Should render the Question component', () => {
        const { getByTestId } = renderComponent();
        const component = getByTestId('exerciseSpace');
        expect(component).toBeVisible();
    });
});