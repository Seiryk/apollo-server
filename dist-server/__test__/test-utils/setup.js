"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// mock bull for now to prevent redis auth failings
jest.mock('bull');
global.DB_USERNAME = 'testuser';
global.DB_PASSWORD = 'testpwd';
global.DB_HOST = 'localhost';
global.DB_PORT = 27017;
global.DB_NAME = 'test';
global.JWT_SECRET = 'ttttttt';
process.env.JWT_SECRET = global.JWT_SECRET;
