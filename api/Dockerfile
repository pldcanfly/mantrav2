#  Init Environment
FROM keymetrics/pm2:16-alpine

#Build APP
 COPY build/ .
 COPY package.json .
 COPY ecosystem.config.cjs .

ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --production

EXPOSE 4000

CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]


#  # Init Environment
#  FROM node:18

#  RUN ["npm", "install", "pm2", "--global"]

# # Build APP
#  WORKDIR /app
#  COPY build/ .
#  COPY package.json .
#  COPY ecosystem.config.cjs .
#  RUN ["npm", "install"]

#  EXPOSE 4000