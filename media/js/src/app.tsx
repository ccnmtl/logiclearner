import React from 'react';
import { BrowserRouter as Router, Route, Switch  } from 'react-router-dom';
import { StartButton } from './startbutton';
import { LevelsDashboard } from './levelsdashboard';

export const App: React.FC = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={StartButton} />
                <Route exact path="/levels" component={LevelsDashboard} />
            </Switch>
        </Router>
    );
};
