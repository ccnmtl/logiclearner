import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const RudderPageTracker: React.FC = () => {
    const location = useLocation();

    useEffect(() => {
        const path: string = location.pathname;

        let name: string = 'Page';
        if (path === '/fol/match/') name = 'FOL - Match';
        else if (path === '/fol/express/') name = 'FOL - Express';
        else if (path.startsWith('/fol/')) name = 'FOL';

        window.rudderanalytics?.page({
            name,
            path,
        });
    }, [location.pathname]);

    return null;
};
