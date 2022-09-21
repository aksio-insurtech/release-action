import { context } from '@actions/github';
import { Octokit } from '@octokit/rest';

import { logger } from './logging';
import inputs from './inputs';
import outputs from './outputs';
import { prependToChangeLog } from './changeLog';
import { getNextVersion } from './version';
import { IPullRequests } from './IPullRequests';
import { PullRequests } from './PullRequests';

const octokit = new Octokit({ auth: inputs.gitHubToken });

export class HandleRelease {

    constructor(readonly _pullRequests: IPullRequests) {
    }

    async run(): Promise<void> {
        const pullRequest = await this._pullRequests.getMergedPullRequest();
        if (!pullRequest) return;

        const version = await getNextVersion(octokit, pullRequest);
        if (!version) return;

        logger.info(`Create release for version '${version.version}'`);

        // GitHub Create Release documentation: https://developer.github.com/v3/repos/releases/#create-a-release
        // GitHub Octokit Create Release documentation: https://octokit.github.io/rest.js/v18#repos-create-release

        const release = {
            owner: context.repo.owner,
            repo: context.repo.repo,
            tag_name: `v${version.version}`,
            name: `Release v${version.version}`,
            body: pullRequest.body || '',
            prerelease: false,
            target_commitish: context.sha
        };

        logger.info('Release object:');
        logger.info(release);

        await octokit.repos.createRelease(release);

        logger.info('GitHub release created');

        await prependToChangeLog(pullRequest.body || '', `v${version.version}`, pullRequest.number, pullRequest.html_url);

        logger.info('Prepended to changelog');

        outputs.setVersion(version.version);
        outputs.setShouldPublish(true);
    }
}

new HandleRelease(new PullRequests(logger, octokit)).run();
