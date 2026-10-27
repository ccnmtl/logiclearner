// react-ga4 v3 is ESM-only, which Jest can't load as CommonJS.
const ReactGA = {
    initialize: jest.fn(),
    send: jest.fn(),
    event: jest.fn(),
};

export default ReactGA;
