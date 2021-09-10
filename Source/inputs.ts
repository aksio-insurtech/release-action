import { getInput } from '@actions/core';

const GitHubToken: string | null = getInput('GITHUB_TOKEN') || null;

export default {
    GitHubToken
};
