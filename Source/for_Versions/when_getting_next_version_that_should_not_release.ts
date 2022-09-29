import { Versions } from '../Versions';
import sinon from 'sinon';
import { PullRequest } from '../PullRequest';
import fakeLogger from '../fakeLogger';
import { ITags } from '../ITags';
import { a_closed_event } from './given/a_closed_event';

describe("when getting next version that should not release", async () => {
    const fakeTags: ITags = {
        getLatestTag: sinon.stub().returns('v1.0.0')
    };

    const context = new a_closed_event();
    const versions = new Versions(sinon.stub() as any, context.context, fakeTags, fakeLogger);
    const pullRequest: PullRequest = {
        labels: [],
        body: '',
        url: '',
        html_url: '',
        number: 42,
        base: { ref: '' },
        head: { ref: '' }
    };

    const version = await versions.getNextVersionFor(pullRequest);

    it('should set is release to false', () => version.isRelease.should.be.false);
    it('should not be a prerelease', () => version.isPreRelease.should.be.false);
});
