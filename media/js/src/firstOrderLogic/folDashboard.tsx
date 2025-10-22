import React from 'react';
import { FolBanner } from './folBanner';

export const STATIC_URL = LogicLearner.staticUrl;


export const FolDashboard: React.FC = () => {

    return (
        <>
            <FolBanner />
            <section className="container content-body" id="maincontent"
                data-testid={'FolDashboard'}>
                <h2 id="cardset-label"
                    className="text-center mb-4">Choose a game</h2>
                <ol className="cardset cardset-levels"
                    aria-labelledby="cardset-label">
                    <li className="cardset-card">
                        <a className='cardset-card__button'
                            href={'/fol/match/'} data-cy="match">
                            <figure className="cardset-card__avatar">
                                <img alt=""
                                    src={
                                        `${STATIC_URL}img/avatar-fol-temp.png`
                                    } />
                            </figure>
                            <div className="d-flex flex-column align-self-center
                                me-2 me-lg-0">
                                <div className="cardset-card__title level-name">
                                    Matching Game
                                </div>
                                <div className="cardset-card__text">
                                    Lorem ipsum dolor sit amet consectetur
                                    adipisicing elit.</div>
                            </div>
                            <div className="cardset-card__prompt">
                                &rsaquo;
                            </div>
                        </a>
                    </li>
                    <li className="cardset-card">
                        <a className='cardset-card__button'
                            href={'/fol/express/'} data-cy="expressions">
                            <figure className="cardset-card__avatar">
                                <img alt=""
                                    src={
                                        `${STATIC_URL}img/avatar-fol-temp.png`
                                    } />
                            </figure>
                            <div className="d-flex flex-column align-self-center
                                me-2 me-lg-0">
                                <div className="cardset-card__title level-name">
                                    Expression Game
                                </div>
                                <div className="cardset-card__text">
                                    Lorem ipsum dolor sit amet consectetur
                                    adipisicing elit.</div>
                            </div>
                            <div className="cardset-card__prompt">
                                &rsaquo;
                            </div>
                        </a>
                    </li>
                </ol>
            </section>
        </>
    );
};
