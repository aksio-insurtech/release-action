import { Octokit } from '@octokit/rest';

// Based on : https://github.com/oprypin/find-latest-tag

export interface ITags {
    getLatestTag(octokit: Octokit, owner: string, repo: string, releasesOnly: boolean, prefix: string, regex: string, sortTags: boolean): Promise<string>;
}
