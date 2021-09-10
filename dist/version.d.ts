import semver from 'semver';
import { Octokit } from '@octokit/rest';
import { PullRequest } from './PullRequest';
export declare function getNextVersion(octokit: Octokit, pullRequest: PullRequest): Promise<semver.SemVer | undefined>;
