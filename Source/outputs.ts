import { setOutput } from '@actions/core';

export default {
    setVersion(value: string) {
        setOutput('version', value);
    },

    setShouldPublish(value: boolean) {
        setOutput('should-publish', value);
    },

    setPrerelease(value: boolean) {
        setOutput('prerelease', value);
    }
};
