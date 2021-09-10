# Release Action

This is a [composite action](https://docs.github.com/en/actions/creating-actions/creating-a-composite-action) to encapsulate
a standard way to do release, tailored for the needs we have at Aksio.

## What does it do

The action is based around the concept of releasing pull requests that are merged down to the main branch that has
one of the following labels adhering to [semantic versioning version 2](https://semver.org) :

| Name | Description |
| ---- | ----------- |
| Major | Breaking changes has been implemented in public APIs and/or behavior |
| Minor | New capabilities has been added |
| Patch | Bug fixes |

It runs the following steps:

| Name | Description |
| Context | Establishes the context by looking at the GitHub context in which the action is running in. Decides if this is a publishable build. |
| Increment Version | Increments the version by looking at the latest version tag of the repository and increases according to what the context decided the build type was. |
| Changelog | Prepends to the CHANGELOG.md file in the repository with the content of the description. |
| GitHub release | Releases a snapshot of the source code to GitHub releases with the calculated version number. |

## Usage

## Inputs

| Property | Description | Default value |
| -------- | ----------- | ------------- |
| prerelease-branches | A comma separated list of prerelease identifier suffixes to branch names that when merged a PR to will trigger a prerelease. | '' |

## Outputs

| Property | Description |
| -------- | ----------- |
| should-publish | Whether or not a publish should be done |
| version | Version number to publish with |
