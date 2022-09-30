import { Versions } from '../Versions';
import sinon from 'sinon';
import { PullRequest } from '../PullRequest';
import fakeLogger from '../fakeLogger';
import fakeContext from '../fakeContext';
import { ITags } from '../ITags';

describe("when getting next version and latest tag is a valid semver and there are no labels and pull request was not closed", async () => {
    const fakeTags: ITags = {
        getLatestTag: sinon.stub().returns('6.4.0')
    };

    const versions = new Versions(sinon.stub() as any, fakeContext(), fakeTags, fakeLogger);
    const pullRequest: PullRequest = {
        labels: [],
        body: '',
        url: '',
        html_url: '',
        number: 42,
        base: { ref: '' },
        head: { ref: '' },
        state: 'open'
    };

    const version = await versions.getNextVersionFor(pullRequest);

    it('should set is release to true', () => version.isRelease.should.be.true);
    it('should set is is valid to true', () => version.isValid.should.be.true);
    it('should be a prerelease', () => version.isPrerelease.should.be.true);
    it('should have expected version number', () => version.version.raw.should.equal('6.4.0-pr42.cf05d51'));
});