#  Init Environment
FROM node:18

#Build APP
 COPY build/ .
 COPY package.json .
 COPY ecosystem.config.cjs .

ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install pm2 -g
RUN npm install


EXPOSE 4000

CMD [ "pm2-runtime", "start", "ecosystem.config.cjs" ]


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