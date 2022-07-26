#!/bin/bash

docker stop mantra
docker rm mantra
docker build -t api:3.0.0 .
docker run -itd --name mantra api:3.0.0