import React from 'react';

export const STATIC_URL = LogicLearner.staticUrl;

export const FolBanner: React.FC = () => {

    return (<>
        <header className="main-banner exercise-space-banner sticky-top">
            <div className="container d-flex justify-content-start">
                <a href="#"
                    className="main-banner__nav
                    d-flex justify-content-start">
                    <div className="main-banner__prompt">
                        &lsaquo;
                    </div>
                    <figure
                        className="main-banner__avatar align-self-center">
                        <img alt="Go home"
                            src={`${STATIC_URL}img/avatar-fol-temp.png`} />
                    </figure>
                    <h1 className="align-self-center">
                        <span className="main-banner__subhead">
                            <span className='visually-hidden'>
                                Go to First Order Logic </span>
                        </span>
                        <span className="main-banner__title">
                            FOL: Matching Game
                        </span>
                    </h1>
                </a>
            </div>
        </header>
    </>);
};