import { getInput } from '@actions/core';

const path: string = getInput('path') || 'CHANGELOG.md';
const userName: string = getInput('user-name', { required: true }) || '';
const userEmail: string = getInput('user-email', { required: true }) || '';
const gitHubToken: string | null = getInput('github-token') || null;
const version: string | null = getInput('version') || null;
const releaseNotes: string | null = getInput('release-notes') || null;

export default {
    path,
    userName,
    userEmail,
    gitHubToken,
    version,
    releaseNotes
};
