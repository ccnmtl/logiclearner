import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import '@testing-library/jest-dom';
import { ExerciseSpace } from '../exerciseSpace';

describe('Initial test', () => {
    const renderComponent = () => render(
        <MemoryRouter initialEntries={['/exercise/16/']}>
            <Routes>
                <Route path="/exercise/:id/" element={<ExerciseSpace />} />
            </Routes>
        </MemoryRouter>
    );
    window.scrollTo = jest.fn();
    it('Should render the Question component', () => {
        const { getByTestId } = renderComponent();
        const component = getByTestId('exerciseSpace');
        expect(component).toBeVisible();
    });
});
