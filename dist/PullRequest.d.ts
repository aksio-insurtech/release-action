import { Label } from './Label';
export declare type PullRequest = {
    labels: Label[];
    body: string | null;
    url: string;
    html_url: string;
    number: number;
};
