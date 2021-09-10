import { getInput } from '@actions/core';

const path: string = getInput('path') || 'CHANGELOG.md';
const userName: string = getInput('user-name', { required: true }) || '';
const userEmail: string = getInput('user-email', { required: true }) || '';
const gitHubToken: string | null = getInput('GITHUB_TOKEN') || null;

export default {
    path,
    userName,
    userEmail,
    gitHubToken
};
