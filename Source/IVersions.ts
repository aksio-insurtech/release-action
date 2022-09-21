import { PullRequest } from './PullRequest';
import { VersionInfo } from "./VersionInfo";


export interface IVersions {
    getNextVersion(pullRequest: PullRequest): Promise<VersionInfo>;
}
