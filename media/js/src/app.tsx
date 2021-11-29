import React from 'react';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import { StartButton } from './startbutton';
import { LevelsDashboard } from './levelsdashboard';

export const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<StartButton/>} />
                <Route path="/levels" element={<LevelsDashboard/>} />
            </Routes>
        </Router>
    );
};
