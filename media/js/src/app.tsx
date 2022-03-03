import React from 'react';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import { LevelsDashboard } from './levelsdashboard';
import { QuestionsDashboard } from './questionsdashboard';
import { ExerciseSpace } from './exerciseSpace';
import { Tutorial } from './tutorial';

export const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LevelsDashboard />} />
                <Route path="/questions/0/"
                    element={<QuestionsDashboard
                        difficulty={0}
                        level={'Novice'}/>} />

                <Route path="/questions/1/"
                    element={<QuestionsDashboard
                        difficulty={1}
                        level={'Learner'}/>} />

                <Route path="/questions/2/"
                    element={<QuestionsDashboard
                        difficulty={2}
                        level={'Apprentice'}/>} />

                <Route path="/exercise/:id"
                    element={<ExerciseSpace />} />

            </Routes>
        </Router>
    );
};