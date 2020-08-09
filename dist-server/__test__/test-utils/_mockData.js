"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockTestData = exports.mockInputTestData = void 0;
const mongoose_1 = require("mongoose");
exports.mockInputTestData = {
    position: [{ name: 'Front-end Developer' }],
    technology: [{ name: 'Tech1' }],
    role: [
        {
            name: 'SuperAdmin',
            value: 3,
        },
        {
            name: 'Admin',
            value: 2,
        },
        {
            name: 'Representative',
            value: 1,
        },
    ],
    user: [{
            email: 'test@gmail.com',
            googleId: '111112222233333444',
            name: 'TestName',
            surname: 'TestSurname',
        },
        {
            email: 'test2@gmail.com',
            googleId: '11222222545333444',
            name: 'Test2Name',
            surname: 'Test2Surname',
        },
    ],
    company: { name: 'TestCompo', email: 'testcompo@mail.com' },
    profile: [{
            name: 'Sergios',
            surname: 'Aglesios',
            email: 'test@test.com',
            workType: 'full-time',
            city: 'Macity',
            country: 'Shmauntry',
        }],
};
exports.mockTestData = {
    user: {
        email: 'test@gmail.com',
        googleId: '111112222233333444',
        name: 'TestName',
        surname: 'TestSurname',
        role: new mongoose_1.Types.ObjectId('123456789012'),
    },
};
