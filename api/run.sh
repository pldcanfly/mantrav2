#!/bin/bash
docker stop mantra
docker rm mantra
docker run -itd -p 4000:4000 --name mantra api:3.0.0
docker start mantra
docker exec -it mantra bash -c 'pm2 start ecosystem.config.cjs && pm2 save'
docker ps
