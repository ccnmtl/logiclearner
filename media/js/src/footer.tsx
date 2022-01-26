import React from 'react';
import CTLLogo from '../../img/logo-ctl-color.png';

export const Footer: React.FC = () => {

    return (
        <>
            <footer>
                <ul className="d-flex justify-content-center">
                    <li className="nav-item d-block p-2">
                        <a href="/about/">About Logic Learner</a>
                    </li>
                    <li className="nav-item d-block p-2">
                        <a href="mailto:ctl-logiclearner@columbia.edu"
                            title="Send email to ctl-logiclearner@columbia.edu">
                            Contact Us
                        </a>
                    </li>
                </ul>

                <div className='text-center'>
                    <a href={'http://ctl.columbia.edu'}
                        rel="noopener noreferrer"
                        target="_blank" className='d-inline-block'>
                        <img src={CTLLogo}
                            className={'img-fluid'}
                            alt={
                                'Columbia University ' +
                                'Center for Teaching and Learning'} />
                    </a>
                </div>
            </footer>
        </>);
};
