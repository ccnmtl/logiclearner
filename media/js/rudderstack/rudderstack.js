import { RudderAnalytics } from '@rudderstack/analytics-js';

const writeKey = window.LogicLearner.rudderstackWriteKey;
const backplaneUrl = window.LogicLearner.rudderstackBackplaneUrl;

const rudderAnalytics = new RudderAnalytics();
rudderAnalytics.load(writeKey, backplaneUrl);

export { rudderAnalytics };