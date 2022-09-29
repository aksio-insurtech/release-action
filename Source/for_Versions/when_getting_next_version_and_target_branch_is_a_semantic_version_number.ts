import { Versions } from '../Versions';
import sinon from 'sinon';
import { PullRequest } from '../PullRequest';
import fakeLogger from '../fakeLogger';
import fakeContext from '../fakeContext';
import { ITags } from '../ITags';

describe("when getting next version and target branch is a semantic version number", async () => {
    const fakeTags: ITags = {
        getLatestTag: sinon.stub().returns('1.2.3')
    };

    const versions = new Versions(sinon.stub() as any, fakeContext(), fakeTags, fakeLogger);

    const pullRequest: PullRequest = {
        labels: [],
        body: '',
        url: '',
        html_url: '',
        number: 42,
        base: { ref: '6.4.7' },
        head: { ref: '' }
    };

    const version = await versions.getNextVersionFor(pullRequest);

    it('should set release to true', () => version.isRelease.should.be.true);
    it('should be a prerelease', () => version.isPrerelease.should.be.true);
    it('should create correct version', () => version.version.raw.should.equal('6.4.7-pr42.cf05d51'));
});
