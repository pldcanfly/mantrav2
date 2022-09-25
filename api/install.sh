#!/bin/bash
#!/bin/bash


docker stop mantra
docker rm mantra
docker login
docker pull pldcanfly/mantra
