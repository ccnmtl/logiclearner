import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import '../../css/main.css';

const App: React.FC = () => {
    return (<h1 className='text-danger'>Hello World!</h1>);
};

ReactDOM.render(<App />, document.getElementById('react-root'));
