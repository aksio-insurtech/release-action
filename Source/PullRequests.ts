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

        this._logger.info(`Getting merged pull request for: '${sha}''`);

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
        const commit_sha = this._context.sha;

        this._logger.info(`Getting open pull request for: '${commit_sha}' - ${this._context.ref}`);
        

        const pullRequests = await this._octokit.rest.repos.listPullRequestsAssociatedWithCommit({
            owner,
            repo,
            commit_sha
        });

        this._logger.info(`# of pull requests associated with sha: ${pullRequests.data.length}`);

        const filtered = pullRequests.data
            .filter(({state}) => state === 'open')
            .filter(({head}) => head.sha.startsWith(commit_sha));

        if( filtered.length === 0) return undefined;

        return filtered[0];
    }
}
