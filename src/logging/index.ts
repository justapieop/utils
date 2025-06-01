import Transport from "winston-transport";
import * as winston from "winston";
import { WinstonModule } from "nest-winston";
import { createSentryWinstonTransport } from "@sentry/nestjs";

const format = (info: any) => `[${new Date().toISOString()}] - ${info.level}: ${info.message}`;
const SentryWinstonTransport = createSentryWinstonTransport(Transport);

export const logger: winston.Logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(format),
    ),
    transports: [
        new SentryWinstonTransport(),
        new winston.transports.Console(),
    ],
});

export const nestWinston = WinstonModule.createLogger(logger);