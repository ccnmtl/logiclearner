import React from 'react';

export const STATIC_URL = LogicLearner.staticUrl;

export const Tutorial: React.FC = () => {

    return (<>
        <header className="main-banner exercise-space-banner sticky-top">
            <div className="container d-flex justify-content-start">
                <div className="main-banner__prompt">
                    <a href={'/'}>
                    &lsaquo;
                    </a>
                </div>
                <figure className="main-banner__avatar align-self-center"
                    aria-hidden="true">
                    <img src={
                        `${STATIC_URL}img/tutorial.svg`
                    } />
                </figure>
                <h1 className="align-self-center">
                    <a href={'/'}>
                        <span className="main-banner__subhead">
                            TUTORIAL:
                        </span>
                        <span className="main-banner__title">
                            Using Logic Learner
                        </span>
                    </a>
                </h1>
                <div className="ms-auto align-self-center text-end">
                    <button
                        className="btn btn-light ll-button btn-shrink
                            me-0 me-md-1 mb-2 mb-md-0">
                        <span className="ll-icons ll-button__icon">
                            <img src={
                                `${STATIC_URL}img/icon-clipboard.svg`
                            } />
                        </span>
                        <span className="ll-button__text">Law sheet</span>
                    </button>
                    <button
                        className="btn btn-light ll-button btn-shrink">
                        <span className="ll-icons ll-button__icon">
                            <img src={
                                `${STATIC_URL}img/icon-keyboard.svg`
                            } />
                        </span>
                        <span className="ll-button__text">
                            Logic symbols
                        </span>
                    </button>
                </div>
            </div>
        </header>
        <section className="container content-body exercise-space"
            id="maincontent"
            data-testid={'Tutorial'}>
            Look, a tutorial!
        </section>
    </>);
};