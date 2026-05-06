import React from 'react';
import { HomeBanner } from './homebanner';

export const STATIC_URL = LogicLearner.staticUrl;


export const HomePage: React.FC = () => {

    return (
        <>
            <HomeBanner />
            <section className="container content-body" id="maincontent"
                data-testid={'FolDashboard'}>
                <h2 id="cardset-label"
                    className="text-center mb-4">Choose a learner</h2>
                <ol className="cardset cardset-levels"
                    aria-labelledby="cardset-label">
                    <li className="cardset-card">
                        <a className='cardset-card__button'
                            href={'/propositional/'} data-cy="expressions">
                            <figure className="cardset-card__avatar">
                                <img alt=""
                                    src={
                                        `${STATIC_URL}img/logo-logiclearner.svg`
                                    } />
                            </figure>
                            <div className="d-flex flex-column align-self-center
                                me-2 me-lg-0">
                                <div className="cardset-card__title level-name">
                                    Propositional Logic
                                </div>
                                <div className="cardset-card__text">
                                    A practice tool for writing proofs in
                                    propositional logic</div>
                            </div>
                            <div className="cardset-card__prompt">
                                &rsaquo;
                            </div>
                        </a>
                    </li>
                    <li className="cardset-card">
                        <a className='cardset-card__button'
                            href={'/fol/'} data-cy="match">
                            <figure className="cardset-card__avatar">
                                <img alt=""
                                    src={
                                        `${STATIC_URL}img/avatar-fol-temp.png`
                                    } />
                            </figure>
                            <div className="d-flex flex-column align-self-center
                                me-2 me-lg-0">
                                <div className="cardset-card__title level-name">
                                    First Order Logic
                                </div>
                                <div className="cardset-card__text">
                                    Interpret and write first-order
                                    logic expressions
                                </div>
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
