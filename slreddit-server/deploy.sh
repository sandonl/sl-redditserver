#!/bin/bash

echo What should the version be?
read VERSION 
echo $VERSION

docker buildx build --platform linux/amd64,linux/arm64 --push -t snadolai/slreddit:$VERSION .
ssh root@157.245.203.117 "docker pull snadolai/slreddit:$VERSION && docker tag snadolai/slreddit:$VERSION dokku/api:$VERSION && dokku deploy api $VERSION"