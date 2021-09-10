import { Octokit } from '@octokit/rest';
export declare function getLatestTag(octokit: Octokit, owner: string, repo: string, releasesOnly: boolean, prefix: string, regex: string, sortTags: boolean): Promise<string>;
