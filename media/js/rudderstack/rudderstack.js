import { RudderAnalytics } from '@rudderstack/analytics-js';

const writeKey = window.LogicLearner.rudderstackWriteKey;
const backplaneUrl = window.LogicLearner.rudderstackBackplaneUrl;

const rudderAnalytics = new RudderAnalytics();
rudderAnalytics.load(writeKey, backplaneUrl, {
    sessions: {
        autoTrack: true,
        timeout: 30 * 60 * 1000, // 30 minutes
    }
});

export { rudderAnalytics };