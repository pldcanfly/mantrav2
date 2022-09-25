#!/bin/bash


docker stop mantra
docker rm mantra
docker run -itd -p 4000:4000 --name mantra pldcanfly/mantra
docker start -ai mantra
docker ps
