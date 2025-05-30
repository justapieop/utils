import Transport from "winston-transport";
import * as winston from "winston";
import { WinstonModule } from "nest-winston";
import { createSentryWinstonTransport } from "@sentry/nestjs";

const options: winston.LoggerOptions = {
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf((info) => `[${new Date().toISOString()}] - ${info.level}: ${info.message}`),
    ),
    transports: [
        new winston.transports.Console(),
    ],
};

export const logger: winston.Logger = winston.createLogger(options);

export function createSentryLogger(): winston.Logger {
    const newOption: winston.LoggerOptions = options;
    const SentryWinstonTransport = createSentryWinstonTransport(Transport);
    (newOption.transports as any[]).push(
        new SentryWinstonTransport(),
    );
    return winston.createLogger(newOption);
}

export const nestWinston = WinstonModule.createLogger(logger);