#!/usr/bin/env sh

# abort on errors
#set -e

# build
npm run build

# navigate into the build output directory
cd dist

# if you are deploying to a custom domain
echo 'pixels.bluebells.tk' > CNAME

git init
git add -A && git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git remote add origin git@github.com:GeekSnail/pixels.git
git checkout -b gh-pages
git push -u origin gh-pages -f