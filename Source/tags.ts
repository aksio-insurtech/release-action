import { Octokit } from '@octokit/rest';
import { cmpTags } from 'tag-cmp';

// Based on : https://github.com/oprypin/find-latest-tag

export async function getLatestTag(octokit: Octokit, owner: string, repo: string, releasesOnly: boolean, prefix: string, regex: string, sortTags: boolean) {
    const endpoint = (releasesOnly ? octokit.repos.listReleases : octokit.repos.listTags);
    const pages = endpoint.endpoint.merge({ "owner": owner, "repo": repo, "per_page": 100 });

    const tags: string[] = [];
    for await (const item of getItemsFromPages(octokit, pages)) {
        const tag: string = (releasesOnly ? item["tag_name"] : item["name"]);
        if (!tag.startsWith(prefix)) {
            continue;
        }
        if (regex && !new RegExp(regex).test(tag)) {
            continue;
        }
        if (!sortTags) {
            // Assume that the API returns the most recent tag(s) first.
            return tag;
        }
        tags.push(tag);
    }
    if (tags.length === 0) {
        let error = `The repository "${owner}/${repo}" has no `;
        error += releasesOnly ? "releases" : "tags";
        if (prefix) {
            error += ` matching "${prefix}*"`;
        }
        throw error;
    }
    tags.sort(cmpTags);
    const [latestTag] = tags.slice(-1);
    return latestTag;
}

async function* getItemsFromPages(octokit: Octokit, pages) {
    for await (const page of octokit.paginate.iterator(pages)) {
        for (const item of page.data) {
            yield item;
        }
    }
}
