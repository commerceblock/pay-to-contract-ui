#!/bin/sh

npm run build
aws s3 sync --acl public-read --delete ./dist/ s3://trade.commerceblock.com
