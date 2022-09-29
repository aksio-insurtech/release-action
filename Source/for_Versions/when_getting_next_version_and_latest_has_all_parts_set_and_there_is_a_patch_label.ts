import { Versions } from '../Versions';
import sinon from 'sinon';
import { PullRequest } from '../PullRequest';
import fakeLogger from '../fakeLogger';
import { ITags } from '../ITags';
import { a_closed_event } from './given/a_closed_event';

describe("when getting next version and latest tag has all parts set and there is patch label", async () => {
    const fakeTags: ITags = {
        getLatestTag: sinon.stub().returns('v1.2.3')
    };

    const context = new a_closed_event();
    const versions = new Versions(sinon.stub() as any, context.context, fakeTags, fakeLogger);
    const pullRequest: PullRequest = {
        labels: [{ name: 'patch' }],
        body: '',
        url: '',
        html_url: '',
        number: 42,
        base: { ref: '' },
        head: { ref: '' }
    };

    const version = await versions.getNextVersionFor(pullRequest);

    it('should set is release to true', () => version.isRelease.should.be.true);
    it('should create a version with bumped patch', () => version.isPatch.should.be.true);
    it('should create a version with setting is major to false', () => version.isMajor.should.be.false);
    it('should create a version with setting is minor to false', () => version.isMinor.should.be.false);
    it('should create a clean major version', () => version.version.version.should.equal('1.2.4'));
    it('should not be a prerelease', () => version.isPrerelease.should.be.false);
});
