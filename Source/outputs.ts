import { setOutput } from '@actions/core';

export default {
    setShouldPublish(value: boolean) {
        setOutput('should-publish', value);
    }
};
