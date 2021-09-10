import { context } from '@actions/github';
import { Octokit } from '@octokit/rest';
import semver from 'semver';
import { logger } from './logging';
import { getLatestTag } from './tags';
import { prependToChangeLog } from './changeLog';
import inputs from './inputs';
import outputs from './outputs';

const octokit = new Octokit({ auth: inputs.gitHubToken });

run();
async function run() {
    try {

        const mergedPr = await getMergedPr(context.repo.owner, context.repo.repo, context.sha);
        if (!mergedPr) {
            logger.error('No merged PR found.');
            return;
        }
        if (mergedPr.labels.length === 0) {
            logger.info('No release labels found.');
            outputs.setShouldPublish(false);
            return;
        }

        let isMinor = false;
        let isPatch = false;
        const isMajor = mergedPr.labels.find(_ => _.name === 'major');
        if (!isMajor) {
            isMinor = mergedPr.labels.some(_ => _.name === 'minor');
            if (!isMinor) {
                isPatch = mergedPr.labels.some(_ => _.name === 'patch');
            }
        }

        if (!isMinor && !isMinor && !isPatch) {
            logger.info('No release related labels associated with the PR.');
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

        await octokit.repos.createRelease({
            owner: context.repo.owner,
            repo: context.repo.repo,
            tag_name: `v${version.version}`,
            name: mergedPr.title,
            body: mergedPr.body || '',
            prerelease: false,
            target_commitish: context.sha
        });

        logger.info('GitHub release created');

        await prependToChangeLog(mergedPr.body || '', `v${version.version}`, mergedPr.url);

        logger.info('Prepended to changelog');

        outputs.setVersion(version.version);
        outputs.setShouldPublish(true);
    } catch (ex ) {
        logger.error("Something went wrong", ex);
    }
}


async function getMergedPr(owner: string, repo: string, sha: string) {
    logger.debug(`Getting merged pull request for: '${sha}''`);

    const mergedPr = await octokit.paginate(
        octokit.pulls.list,
        { owner, repo, state: 'closed', sort: 'updated', direction: 'desc' }
    ).then(data => data.find(pr => pr.merge_commit_sha === sha));
    return mergedPr;
}