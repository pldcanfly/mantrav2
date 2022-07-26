#!/bin/bash

if [[ $# -ne 2 ]] ; then
    echo 'Usage: /build.sh <tag> <repo>'
    exit 0
fi
pnpm run build
docker stop $1
docker rm $1
docker image rm $2/$1
docker build -t $2/$1 .
