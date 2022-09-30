import { Versions } from '../Versions';
import sinon from 'sinon';
import { PullRequest } from '../PullRequest';
import fakeLogger from '../fakeLogger';
import { ITags } from '../ITags';
import fakeContext from '../fakeContext';

describe("when getting next version and latest tag has all parts set and there is major label", async () => {
    const fakeTags: ITags = {
        getLatestTag: sinon.stub().returns('v1.2.3')
    };

    const versions = new Versions(sinon.stub() as any, fakeContext(), fakeTags, fakeLogger);
    const pullRequest: PullRequest = {
        labels: [{ name: 'major' }],
        body: '',
        url: '',
        html_url: '',
        number: 42,
        base: { ref: '' },
        head: { ref: '' },
        state: 'closed'
    };

    const version = await versions.getNextVersionFor(pullRequest);

    it('should set is release to true', () => version.isRelease.should.be.true);
    it('should create a version with bumped major', () => version.isMajor.should.be.true);
    it('should create a version with setting is minor to false', () => version.isMinor.should.be.false);
    it('should create a version with setting is patch to false', () => version.isPatch.should.be.false);
    it('should create a clean major version', () => version.version.version.should.equal('2.0.0'));
    it('should not be a prerelease', () => version.isPrerelease.should.be.false);
});


