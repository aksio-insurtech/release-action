import { Octokit } from '@octokit/rest';
import { Label } from './Label';
import { logger } from './logging';

import inputs from './inputs';

const octokit = new Octokit({ auth: inputs.gitHubToken });

export type PullRequest = {
    labels: Label[];
    body: string | null;
    url: string;
    html_url: string;
    number: number;
};


export async function getMergedPullRequest(owner: string, repo: string, sha: string): Promise<PullRequest | undefined> {
    logger.debug(`Getting merged pull request for: '${sha}''`);

    const mergedPullRequest = await octokit.paginate(
        octokit.pulls.list,
        { owner, repo, state: 'closed', sort: 'updated', direction: 'desc' }
    ).then(data => data.find(pr => pr.merge_commit_sha === sha));

    return mergedPullRequest;
}
