// jest.setup.ts
import { TextEncoder, TextDecoder } from 'util';
import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Only define if missing; cast so TS accepts Node's impl in a DOM world.
if (typeof globalThis.TextEncoder === 'undefined') {
  globalThis.TextEncoder = TextEncoder as unknown as typeof globalThis.TextEncoder;
}
if (typeof globalThis.TextDecoder === 'undefined') {
  globalThis.TextDecoder = TextDecoder as unknown as typeof globalThis.TextDecoder;
}
