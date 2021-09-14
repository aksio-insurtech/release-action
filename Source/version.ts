import semver from 'semver';
import { logger } from './logging';
import { getLatestTag } from './tags';
import { Octokit } from '@octokit/rest';
import { context } from '@actions/github';
import { PullRequest } from './PullRequest';

export async function getNextVersion(octokit: Octokit, pullRequest: PullRequest) {
    let isMinor = false;
    let isPatch = false;
    const isMajor = pullRequest.labels.some(_ => _.name === 'major');
    if (!isMajor) {
        isMinor = pullRequest.labels.some(_ => _.name === 'minor');
        if (!isMinor) {
            isPatch = pullRequest.labels.some(_ => _.name === 'patch');
        }
    }

    if (!isMajor && !isMinor && !isPatch) {
        logger.info('No release related labels associated with the PR.');
        if (pullRequest.labels.length > 0) {
            logger.info('Labels associated with PR:');
            pullRequest.labels.forEach(_ => logger.info(`  - ${_.name}`));
        }

        return;
    }

    let latestTag = await getLatestTag(
        octokit,
        context.repo.owner,
        context.repo.repo,
        true,
        'v',
        '',
        true);

    if (latestTag.toLowerCase().startsWith('v')) {
        latestTag = latestTag.substr(1);
    } else {
        latestTag = 'v0.0.0';
        logger.info('No valid version found in tags - setting to v0.0.0');
    }

    logger.info(`Latest tag: ${latestTag}`);

    let version = semver.parse(latestTag);
    if (!version) {
        logger.error(`Version string '${latestTag}' is not in a valid format`);
        return;
    }
    if (isMajor) version = version.inc('major') || version;
    if (isMinor) version = version.inc('minor') || version;
    if (isPatch) version = version.inc('patch') || version;

    logger.info(`New version is '${version.version}''`);

    return version;
}