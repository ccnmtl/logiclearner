import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import '../../scss/main.scss';

const App: React.FC = () => {
    return (<h1>Hello World!</h1>);
};

ReactDOM.render(<App />, document.getElementById('react-root'));
