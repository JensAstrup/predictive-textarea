// This file sets up the test environment before running tests

// Node.js standard library's TextEncoder/TextDecoder implementation
const { TextEncoder, TextDecoder } = require('util');

// Make TextEncoder and TextDecoder available in the global scope for tests
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder; 
