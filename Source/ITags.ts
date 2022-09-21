import { Octokit } from '@octokit/rest';

export interface ITags {
    getLatestTag(owner: string, repo: string, releasesOnly: boolean, prefix: string, regex: string, sortTags: boolean): Promise<string>;
}
