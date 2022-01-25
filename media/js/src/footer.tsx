import React from 'react';

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

                <div itemScope itemType="http://schema.org/EducationalOrganization"
                    className='text-center'>
                    <a href="http://ctl.columbia.edu" rel="noopener noreferrer"
                        target="_blank" itemProp="url"
                        className='d-inline-block'>
                        <img src="media/img/logo-ctl-color.png"
                            className="footer__logo" alt="" itemProp="logo" />
                    </a>
                </div>
            </footer>
        </>);
};
