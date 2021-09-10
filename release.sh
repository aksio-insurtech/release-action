#!/bin/bash
yarn build
git add .
git commit -m %1
git push
git tag -d v1
git tag v1
git push --tags -f