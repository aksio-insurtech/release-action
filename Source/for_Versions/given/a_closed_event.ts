import { Context } from '@actions/github/lib/context';
import fakeContext from '../../fakeContext';

export class a_closed_event {
    readonly context: Context;

    constructor() {
        this.context = fakeContext();
        Object.defineProperty(this.context, "eventName", {
            get: () => {
                return 'closed';
            }
        });
    }
}