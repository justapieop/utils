import * as winston from "winston";
import { WinstonModule } from "nest-winston";

export const logger: winston.Logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf((info) => `[${new Date().toISOString()}] - ${info.level}: ${info.message}`),
    ),
    transports: [
        new winston.transports.Console(),
    ],
});

export const nestWinston = WinstonModule.createLogger(logger);