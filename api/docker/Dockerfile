 # Init Environment
 FROM node:18

 RUN ["npm", "install", "pm2", "--global"]

# Build APP
 WORKDIR /app
 COPY ../build/ .
 COPY ../package.json .
 COPY ../ecosystem.config.cjs .
 RUN ["npm", "install"]

 EXPOSE 4000
