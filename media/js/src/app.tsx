import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import { LevelsDashboard } from './levelsdashboard';
import { QuestionsDashboard } from './questionsdashboard';
import { ExerciseSpace } from './exerciseSpace';
import { NotFound } from './notFound';
import ReactGA from 'react-ga4';
import { FirstOrderLogic } from './firstOrderLogic/firstOrderLogic';

export const App: React.FC = () => {
    const options = {
        gtagOptions: {anonymizeIp: true},
        testMode: process.env.NODE_ENV === 'test'
    };

    ReactGA.initialize('G-C6YSGXSTYN', options);

    useEffect(() => {
        ReactGA.send({
            hitType: 'pageview',
            page: window.location.pathname + window.location.search
        });

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
                
                <Route path="/fol/"
                    element={<FirstOrderLogic />} />

            </Routes>
        </Router>
    );
};
