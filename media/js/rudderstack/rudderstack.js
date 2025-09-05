// import { RudderAnalytics } from '@rudderstack/analytics-js';

// const rudderAnalytics = new RudderAnalytics();

// // Load the SDK with your Write Key and Data Plane URL
// rudderAnalytics.load('329gVcEnCXwghvga0IcO3y5MxD9', 'https://rudderstack-backplane.stage.ctl.columbia.edu', {});

// // Export for use in other parts of your app
// export { rudderAnalytics };

import Analytics from '@rudderstack/rudder-sdk-node';

export const rudderAnalytics = new Analytics('329gVcEnCXwghvga0IcO3y5MxD9', {
    dataPlaneUrl: 'https://rudderstack-backplane.stage.ctl.columbia.edu', // default: https://hosted.rudderlabs.com
});