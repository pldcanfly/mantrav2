#!/bin/bash
#!/bin/bash

if [[ $# -ne 2 ]] ; then
    echo 'Usage: /build.sh <tag> <repo>'
    exit 0
fi


docker stop $1
docker rm $1
docker login
docker pull $2/$1
