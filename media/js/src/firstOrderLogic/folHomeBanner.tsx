import React from 'react';

export const STATIC_URL = LogicLearner.staticUrl;

export const FolHomeBanner: React.FC = () => {

    return (<>
        <header className='main-banner banner-hero' data-testid={'HomeBanner'}>
            <div className='container
                d-flex justify-content-center
                banner-hero__container'>
                <figure className='main-banner__avatar
                    banner-hero__avatar align-self-center'
                aria-hidden='true'>
                    <img src={`${STATIC_URL}img/avatar-fol-temp.png`} />
                </figure>
                <h1 className='align-self-center'>
                    <span className='main-banner__title
                        banner-hero__title'>First Order Logic</span>
                    <span className='main-banner__text
                        banner-hero__text'>
                        Interpret and write first-order
                        logic expressions
                    </span>
                </h1>
            </div>
        </header>
    </>);
};