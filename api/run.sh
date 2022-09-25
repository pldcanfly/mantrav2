#!/bin/bash

if [[ $# -ne 2 ]] ; then
    echo 'Usage: /build.sh <tag> <repo>'
    exit 0
fi


docker stop $1
docker rm $1
docker run -itd -p 4000:4000 --name $1 $2/$1
docker start $1
docker ps
