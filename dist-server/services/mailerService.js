"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const bull_1 = __importDefault(require("bull"));
const { REDIS_HOST, REDIS_PASS } = process.env;
const transporter = nodemailer_1.default.createTransport({
    host: process.env.MAIL_SERVER,
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_SERVER_USER,
        pass: process.env.MAIL_SERVER_PASS,
    },
});
const mailerSendQueue = new bull_1.default('mailerSend', {
    redis: {
        host: REDIS_HOST,
        port: 6379,
        password: REDIS_PASS,
    },
});
const MailerService = {
    sendMail: async ({ email, callback }) => {
        const info = await transporter.sendMail({
            ...email,
            from: email.from || '"Hire Pro" <no-reply@hirepro.club>',
        });
        if (callback)
            callback(info);
    },
    sendInQueue: async (args) => mailerSendQueue.add(args, {
        delay: 60000,
        attempts: 3,
    }),
};
mailerSendQueue.process((job) => MailerService.sendMail({ ...job.data }));
exports.default = MailerService;
