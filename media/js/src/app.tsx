import React from 'react';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import { StartButton } from './startbutton';
import { LevelsDashboard } from './levelsdashboard';
import { QuestionsDashboard } from './questionsdashboard';
import { ExerciseSpace } from './exerciseSpace';

export const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<StartButton />} />
                <Route path="/levels" element={<LevelsDashboard />} />
                // <Route path="/exercise" element={<ExerciseSpace />} />
                <Route path="/questions/0/"
                    element={<QuestionsDashboard
                        difficulty={0}
                        level={'Beginner'}/>} />

                <Route path="/questions/1/"
                    element={<QuestionsDashboard
                        difficulty={1}
                        level={'Learner'}/>} />

                <Route path="/questions/2/"
                    element={<QuestionsDashboard
                        difficulty={2}
                        level={'Apprentice'}/>} />
            </Routes>
        </Router>
    );
};
