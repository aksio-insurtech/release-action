import { context } from '@actions/github';
import { Octokit } from '@octokit/rest';

import { logger } from './logging';

import inputs from './inputs';
import outputs from './outputs';
import { getNextVersion } from './version';
import { getMergedPullRequest } from './PullRequest';

const octokit = new Octokit({ auth: inputs.gitHubToken });

async function run(): Promise<void> {
    try {
        const pullRequest = await getMergedPullRequest(context.repo.owner, context.repo.repo, context.sha);
        if (!pullRequest) {
            logger.error('No merged PR found.');
            return;
        }
        if (!pullRequest.labels || pullRequest.labels.length === 0) {
            logger.info('No release labels found.');
            if (pullRequest.labels.length > 0) {
                logger.info('Labels associated with PR:');
                pullRequest.labels.forEach(_ => logger.info(`  - ${_}`));
            }
            outputs.setShouldPublish(false);
            return;
        }

        const version = await getNextVersion(octokit, pullRequest);
        if (!version) return;

        outputs.setVersion(version.version);
        outputs.setShouldPublish(true);
    } catch (ex) {
        logger.error("Something went wrong");
        logger.error(ex);

        outputs.setShouldPublish(false);
    }
}

run();
export default run;