#!/bin/bash -e -x

grunt --force
git checkout gh-pages

mv dist/* .
git add .
git commit -am "update pages"
git push
git checkout master