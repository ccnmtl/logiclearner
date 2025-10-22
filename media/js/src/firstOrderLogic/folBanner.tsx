import React from 'react';
import { useLocation } from 'react-router-dom';

export const STATIC_URL = LogicLearner.staticUrl;

export const FolBanner: React.FC = () => {
    const location = useLocation();

    let bannerTitle;
    let url;
    if (location.pathname === '/fol/') {
        bannerTitle = 'First Order Logic';
        url = '/';
    } else if (location.pathname === '/fol/match/') {
        bannerTitle = 'FOL: Matching Game';
        url = '/fol/';
    } else if (location.pathname === '/fol/express/') {
        bannerTitle = 'FOL: Expression Game';
        url = '/fol/';
    }

    return (<>
        <header className="main-banner exercise-space-banner sticky-top">
            <div className="container d-flex justify-content-start">
                <a href={url}
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
                            {bannerTitle}
                        </span>
                    </h1>
                </a>
            </div>
        </header>
    </>);
};