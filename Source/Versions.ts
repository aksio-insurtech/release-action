import { Context } from '@actions/github/lib/context';
import { Octokit } from '@octokit/rest';
import semver from 'semver';
import winston from 'winston';

import { PullRequest } from './PullRequest';
import { IVersions } from './IVersions';
import { VersionInfo } from './VersionInfo';
import { ITags } from './ITags';
import { Console } from 'console';

export class Versions implements IVersions {
    constructor(readonly _octokit: Octokit, readonly _context: Context, readonly _tags: ITags, readonly _logger: winston.Logger) {
    }

    async getNextVersionFor(pullRequest: PullRequest): Promise<VersionInfo> {
        // If the pull request points to a headRefName that is semantic version number
        //    set base version to be the headRefName version number
        // If the pull request is targeting a baseRefName that is a semantic version number
        //    set base version to be the baseRefName version number
        // If the pull request has not been merged
        //    generate version number: <major>.<minor>.<patch>-PR<number>.<incremental number>

        let latestTag = await this._tags.getLatestTag(
            true,
            'v',
            '',
            true);

        if (latestTag.toLowerCase().startsWith('v')) {
            latestTag = latestTag.substring(1);
        }
        this._logger.info(`Latest tag: ${latestTag}`);

        let version = semver.parse(latestTag);
        if (!version) {
            this._logger.error(`Version string '${latestTag}' is not in a valid format`);
            return VersionInfo.invalid;
        }

        let isMinor = false;
        let isPatch = false;
        const isMajor = pullRequest.labels.some(_ => _.name === 'major');
        if (!isMajor) {
            isMinor = pullRequest.labels.some(_ => _.name === 'minor');
            if (!isMinor) {
                isPatch = pullRequest.labels.some(_ => _.name === 'patch');
            }
        }

        if (!isMajor && !isMinor && !isPatch) {
            this._logger.info('No release related labels associated with the PR.');
            if (pullRequest.labels.length > 0) {
                this._logger.info('Labels associated with PR:');
                pullRequest.labels.forEach(_ => this._logger.info(`  - ${_.name}`));
            }

            return VersionInfo.noRelease;
        }

        if (isMajor) version = version.inc('major') || version;
        if (isMinor) version = version.inc('minor') || version;
        if (isPatch) version = version.inc('patch') || version;

        this._logger.info(`New version is '${version.version}''`);

        console.log(version.version);

        return new VersionInfo(version, isMajor, isMinor, isPatch, true, true);
    }
}