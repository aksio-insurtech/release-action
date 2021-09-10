import { context } from '@actions/github';
import { Octokit } from '@octokit/rest';
import { getLatestTag } from './tags';
import Outputs from './outputs';
import Inputs from './inputs';
import { logger } from './logging';

const octokit = new Octokit({ auth: Inputs.GitHubToken });

run();
async function run() {

    const mergedPr = await getMergedPr(context.repo.owner, context.repo.repo, context.sha);
    if( !mergedPr) {
        logger.error('No merged PR found');
        return;
    }
    if (mergedPr?.labels.length === 0) {
        logger.info('No release labels found');
        Outputs.setShouldPublish(false);
        return;
    }

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

async function getMergedPr(owner: string, repo: string, sha: string) {
    logger.debug(`Trying to get merged PR with merge_commit_sha: ${sha}`);

    const mergedPr = await octokit.paginate(
        octokit.pulls.list,
        { owner, repo, state: 'closed', sort: 'updated', direction: 'desc' }
    ).then(data => data.find(pr => pr.merge_commit_sha === sha));
    return mergedPr;
}