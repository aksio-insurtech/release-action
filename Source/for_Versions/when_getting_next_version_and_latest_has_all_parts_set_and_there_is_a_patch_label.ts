import { Versions } from '../Versions';
import sinon from 'sinon';
import { PullRequest } from '../PullRequest';
import fakeLogger from '../fakeLogger';
import fakeContext from '../fakeContext';
import { ITags } from '../ITags';

describe("when getting next version and latest tag has all parts set and there is patch label", async () => {
    const fakeTags: ITags = {
        getLatestTag(releaseOnly: boolean, prefix: string, regex: string, sortTags): Promise<string> {
            return new Promise((resolve) => resolve("v1.2.3"));
        }
    };

    const versions = new Versions(sinon.stub() as any, fakeContext, fakeTags, fakeLogger);
    const pullRequest: PullRequest = {
        labels: [{ name: 'patch' }],
        body: '',
        url: '',
        html_url: '',
        number: 42,
        baseRefName: '',
        headRefName: ''
    };

    const version = await versions.getNextVersionFor(pullRequest);

    it('should set is release to false', () => version.isRelease.should.be.true);
    it('should create a version with bumped patch', () => version.isPatch.should.be.true);
    it('should create a version with setting is major to false', () => version.isMajor.should.be.false);
    it('should create a version with setting is minor to false', () => version.isMinor.should.be.false);
    it('should create a clean major version', () => version.version.version.should.equal('1.2.4'));
});