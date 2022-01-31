import React from 'react';

export const Nav: React.FC = () => {

    return (<>
        <nav id={'am-nav'}
            className={'navbar navbar-expand-lg navbar-dark bg-dark'}
            data-testid={'nav'}>
            <div className={'container'}>
                <a className={'navbar-brand'} href={'/'}>
                    <span className='sr-only'>Logic Learner</span>
                </a>
            </div>
        </nav>
    </>);
};
