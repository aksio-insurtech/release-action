import { context } from '@actions/github';
import winston from 'winston';
import { IPullRequests } from './IPullRequests';
import { PullRequest } from './PullRequest';
import { Octokit } from '@octokit/rest';

export class PullRequests implements IPullRequests {
    constructor(readonly _octokit: Octokit, readonly _logger: winston.Logger) {
    }

    async getMergedPullRequest(): Promise<PullRequest | undefined> {
        const owner = context.repo.owner;
        const repo = context.repo.repo;
        const sha = context.sha;

        this._logger.debug(`Getting merged pull request for: '${sha}''`);

        const mergedPullRequest = await this._octokit.paginate(
            this._octokit.pulls.list,
            { owner, repo, state: 'closed', sort: 'updated', direction: 'desc' }
        ).then(data => data.find(pr => pr.merge_commit_sha === sha));

        return mergedPullRequest;
    }
}
