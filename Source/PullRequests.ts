import { Context } from '@actions/github/lib/context';
import { Octokit } from '@octokit/rest';
import winston from 'winston';
import { IPullRequests } from './IPullRequests';
import { PullRequest } from './PullRequest';

export class PullRequests implements IPullRequests {
    constructor(readonly _octokit: Octokit, readonly _context: Context, readonly _logger: winston.Logger) {
    }

    async getMergedPullRequest(): Promise<PullRequest | undefined> {
        const owner = this._context.repo.owner;
        const repo = this._context.repo.repo;
        const sha = this._context.sha;

        this._logger.debug(`Getting merged pull request for: '${sha}''`);

        const mergedPullRequest = await this._octokit.paginate(
            this._octokit.pulls.list,
            {
                owner,
                repo,
                state: 'closed',
                sort: 'updated',
                direction: 'desc'
            }
        ).then(data => data.find(pr => pr.merge_commit_sha === sha));

        return mergedPullRequest;
    }

    async getPullRequestForCurrentSha(): Promise<PullRequest | undefined> {
        const owner = this._context.repo.owner;
        const repo = this._context.repo.repo;
        const sha = this._context.sha;

        this._logger.debug(`Getting open pull request for: '${sha}''`);

        const openPullRequest = await this._octokit.paginate(
            this._octokit.pulls.list,
            {
                owner,
                repo,
                state: 'open',
                sort: 'updated',
                direction: 'desc'
            }
        ).then(data => data.find(pr => pr.head.sha === sha));

        return openPullRequest;
    }
}
