#!/bin/bash
pnpm run build
docker stop mantra
docker rm mantra
docker image rm pldcanfly/mantra
docker build -t pldcanfly/mantra .
