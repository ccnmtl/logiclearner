import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound: React.FC = () => {
    return (
        <>
            <div className="container" data-testid='not-found'>
                <div className="row">
                    <div className="col-12">
                        <h2>Error 404 - Page not Found</h2>
                        <p>
                        This page can not be found. Head back to
                        our <Link to={'/'}>home page</Link>.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};
