import { Label } from './Label';


export type PullRequest = {
    labels: Label[];
    body: string | null;
    url: string;
    html_url: string;
    number: number;
};
