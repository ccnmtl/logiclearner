import React from 'react';
import { BrowserRouter as Router, Route, Switch  } from 'react-router-dom';
import { StartButton } from './startbutton';

export const App: React.FC = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={StartButton} />
            </Switch>
        </Router>
    );
};
