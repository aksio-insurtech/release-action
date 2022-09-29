import { Context } from '@actions/github/lib/context';

const fakeContext = new Context();

Object.defineProperty(fakeContext, "sha", {
    get: () => {
        return 'cf05d51ebb7a068849e3a03ceaf969cc22dfeff7';
    }
});

Object.defineProperty(fakeContext, "issue", {
    get: () => {
        return {
            owner: '',
            repo: '',
            number: 42
        };
    }
});

Object.defineProperty(fakeContext, "repo", {
    get: () => {
        return {
            owner: '',
            repo: ''
        };
    }
});

export default fakeContext;