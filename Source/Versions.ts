import { Context } from '@actions/github/lib/context';
import { Octokit } from '@octokit/rest';
import semver, { SemVer } from 'semver';
import winston from 'winston';

import { PullRequest } from './PullRequest';
import { IVersions } from './IVersions';
import { VersionInfo } from './VersionInfo';
import { ITags } from './ITags';

export class Versions implements IVersions {
    constructor(readonly _octokit: Octokit, readonly _context: Context, readonly _tags: ITags, readonly _logger: winston.Logger) {
    }

    async getNextVersionFor(pullRequest: PullRequest): Promise<VersionInfo> {
        // If the pull request points to a headRefName that is semantic version number
        //    set base version to be the headRefName version number
        // If the pull request is targeting a baseRefName that is a semantic version number
        //    set base version to be the baseRefName version number
        // If the pull request is not in a branch or targeting a branch with a semantic version number
        //    set base version to the latest tag and rely on labels (major, minor, patch) to dictate target version number
        // If the pull request has not been merged
        //    generate version number: <major>.<minor>.<patch>-PR<number>.<incremental number>

        const preRelease = `pr${pullRequest.number}.${this._context.sha.substring(0, 7)}`;
        let isMajor = false;
        let isMinor = false;
        let isPatch = false;

        let version = semver.parse(pullRequest.head.ref);
        if (version) {
            version = new SemVer(`${version.major}.${version.minor}.${version.patch}-${preRelease}`);
        } else {
            version = semver.parse(pullRequest.base.ref);
            if (version) {
                version = new SemVer(`${version.major}.${version.minor}.${version.patch}-${preRelease}`);
            }
        }

        if (!version) {
            let latestTag = await this._tags.getLatestTag(
                true,
                'v',
                '',
                true);

            if (latestTag.toLowerCase().startsWith('v')) {
                latestTag = latestTag.substring(1);
            }
            this._logger.info(`Latest tag: ${latestTag}`);

            version = semver.parse(latestTag);
        }

        if (!version) {
            this._logger.error(`Version string '${version}' is not in a valid format`);
            return VersionInfo.invalid;
        }

        if (this._context.eventName == 'closed') {
            isMajor = pullRequest.labels.some(_ => _.name === 'major');
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
        }

        this._logger.info(`New version is '${version.version}''`);

        return new VersionInfo(version, isMajor, isMinor, isPatch, true, version.prerelease.length > 0, true);
    }
}