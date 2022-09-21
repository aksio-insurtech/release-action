import { Versions } from '../Versions';
import sinon from 'sinon';
import { PullRequest } from '../PullRequest';
import fakeLogger from '../fakeLogger';
import fakeContext from '../fakeContext';


describe("when getting next version that should not release", async () => {

    const versions = new Versions(sinon.stub() as any, fakeContext, sinon.stub() as any, fakeLogger);
    const pullRequest: PullRequest = {
        labels: [],
        body: '',
        url: '',
        html_url: '',
        number: 42
    };

    const version = await versions.getNextVersion(pullRequest);

    it('should set is release to false', () => version.isRelease.should.be.false);
});