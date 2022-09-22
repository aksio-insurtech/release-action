import { Versions } from '../Versions';
import sinon from 'sinon';
import { PullRequest } from '../PullRequest';
import fakeLogger from '../fakeLogger';
import fakeContext from '../fakeContext';
import { ITags } from '../ITags';
import semver from 'semver';

describe("when getting next version and latest tag is not a valid semver", async () => {
    const fakeTags: ITags = {
        getLatestTag(releaseOnly: boolean, prefix: string, regex: string, sortTags): Promise<string> {
            return new Promise((resolve) => resolve("gibberish"));
        }
    };

    const versions = new Versions(sinon.stub() as any, fakeContext, fakeTags, fakeLogger);
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

    it('should set is release to false', () => version.isRelease.should.be.false);
    it('should set is is valid to false', () => version.isValid.should.be.false);
});