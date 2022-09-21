import { Label } from './Label';

// https://docs.github.com/en/graphql/reference/objects#pullrequest

export type PullRequest = {
    labels: Label[];
    body: string | null;
    url: string;
    html_url: string;
    number: number;
    baseRefName: string;
    headRefName: string;
};
