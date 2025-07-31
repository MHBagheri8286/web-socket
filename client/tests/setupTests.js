import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.WebSocket = jest.fn(() => ({
  send: jest.fn(),
  close: jest.fn(),
  readyState: 1,
}));

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

WebSocket.OPEN = 1;
