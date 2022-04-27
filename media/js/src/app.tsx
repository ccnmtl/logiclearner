import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import { LevelsDashboard } from './levelsdashboard';
import { QuestionsDashboard } from './questionsdashboard';
import { ExerciseSpace } from './exerciseSpace';
import { NotFound } from './notFound';
import ReactGA from 'react-ga';

export const App: React.FC = () => {
    ReactGA.initialize('UA-51144540-42');

    useEffect(() => {
        ReactGA.pageview(window.location.pathname + window.location.search);
    }, []);
    return (
        <Router>
            <Routes>
                <Route path='*' element={<NotFound />} />
                <Route path="/" element={<LevelsDashboard />} />
                <Route path="/level/1"
                    element={<QuestionsDashboard
                        difficulty={0}
                        level={'Novice'}/>} />

                <Route path="/level/2"
                    element={<QuestionsDashboard
                        difficulty={1}
                        level={'Learner'}/>} />

                <Route path="/level/3"
                    element={<QuestionsDashboard
                        difficulty={2}
                        level={'Apprentice'}/>} />

                <Route path="/exercise/:id"
                    element={<ExerciseSpace />} />

            </Routes>
        </Router>
    );
};
