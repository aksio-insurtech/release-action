import { createLogger, format, transports } from 'winston';

import { getInput } from '@actions/core';
import { getOctokit, context } from '@actions/github';
import { Octokit } from '@octokit/rest';
import { getLatestTag } from './tags';

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

const token = getInput('GITHUB_TOKEN') || null;
const octokit = new Octokit({ auth: token });

run();
async function run() {
    const latestVersion = await getLatestTag(
        octokit,
        context.repo.owner,
        context.repo.repo,
        true,
        'v',
        '',
        true);

    logger.info(`Latest version: ${latestVersion}`);
}
