import { PullRequest } from './PullRequest';


export interface IPullRequests {
    getMergedPullRequest(): Promise<PullRequest | undefined>;
}
