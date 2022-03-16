import React from 'react';
import { Link } from 'react-router-dom';

export const STATIC_URL = LogicLearner.staticUrl;

export const NotFound: React.FC = () => {
    return (
        <>
            <div className="http-error-prompt row" data-testid='not-found'>
                <div className="col-12 col-lg-6 pt-5">
                    <div className="http-error-prompt__decor text-center">
                        <img alt="Banner for HTTP 404 Page not found"
                            src={`${STATIC_URL}img/eincorgi-404.svg`} />
                    </div>
                </div>
                <div className="col-12 col-lg-6 text-center text-lg-left">
                    <h1>Page not found</h1>

                    <p className='fs-4 mt-5'>
                      We’re sorry! The page you think is present does not exist.
                    </p>

                    <p className='fs-4'>
                        In fact, it is <span className="question-statement">
                        p ∧ ¬p.</span> It’s a fallacy.
                    </p>

                    <div className="text-center mt-5">
                    <a href={'/contact/'}
                        className="btn btn-lg ll-button">
                        <span className='ll-button__label'>
                            Report problem
                        </span>
                    </a>
                    </div>

                    <div className="text-center mt-3">
                    <a href={'/'}
                        className="btn btn-lg ll-button">
                        <span className='ll-button__label'>
                            Return to Home page
                        </span>
                    </a>
                    </div>

                </div>
            </div>
        </>
    );
};
