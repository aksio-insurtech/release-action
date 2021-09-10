import { createLogger, format, transports } from 'winston';

const loggerOptions = {
    level: 'info',
    format: format.colorize(),
    transports: [
        new transports.Console({
            format: format.simple()
        })
    ]
};

const logger = createLogger(loggerOptions);

export {
    logger
};