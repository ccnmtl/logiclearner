import { TextEncoder } from 'util';

global.TextEncoder = TextEncoder;
import "@testing-library/jest-dom";

// Polyfill "window.fetch" used in the React component.
import 'whatwg-fetch'