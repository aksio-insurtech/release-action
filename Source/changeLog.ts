import path from 'path';
import { exec } from '@actions/exec';
import { logger } from './logging';
import inputs from './inputs';
import prependFile from 'prepend-file';
import { context } from '@actions/github';

export async function prependToChangeLog(body: string, version: string, pullRequestUrl: string): Promise<void> {
    const date = new Date(new Date().toUTCString());
    const pullRequestNumber = pullRequestUrl.slice(pullRequestUrl.indexOf('pull/')).match(/\d+$/);
    const heading = `# [${version}] - ${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()} [PR: #${pullRequestNumber}](${pullRequestUrl})`;
    const combined = `${heading}\n${body}`;
    await prependFile(inputs.path, combined);
    await configureUser();
    await commitChangelog(version);
    await pushChanges();
}

async function configureUser() {
    logger.info(`Configuring user with email '${inputs.userEmail}' and name '${inputs.userName}'`);
    await exec(
        'git config',
        [
            'user.email',
            `"${inputs.userEmail}"`
        ],
        { ignoreReturnCode: true });
    await exec(
        'git config',
        [
            'user.name',
            `"${inputs.userName}"`
        ],
        { ignoreReturnCode: true });
}

async function commitChangelog(version: string) {
    logger.info(`Adding and committing ${inputs.path}`);
    await exec(
        'git add',
        [inputs.path],
        { ignoreReturnCode: true });
    await exec(
        'git commit',
        [
            `-m "Add version ${version} to changelog"`
        ],
        { ignoreReturnCode: true });
}

async function pushChanges() {
    const branchName = path.basename(context.ref);
    logger.info(`Pushing changelog to origin ${branchName}`);

    await exec(
        `git pull origin ${branchName}`,
        undefined,
        { ignoreReturnCode: true });
    await exec(
        `git push origin ${branchName}`,
        undefined,
        { ignoreReturnCode: true });
}
