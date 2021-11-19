import React from 'react';

export const StartButton: React.FC = () => {

    return (
        <>
            <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
                <a href="/levels" className="btn btn-primary btn-lg rounded-pill">Start From Home Page</a>
            </div>
        </>
    );
};
