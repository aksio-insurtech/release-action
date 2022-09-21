import { Context } from '@actions/github/lib/context';

const fakeContext = new Context();

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