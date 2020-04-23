FROM node:10-slim
ENV PORT 4000
EXPOSE 4000
#RUN groupadd -r nodejs && useradd -m -r -g -s /bin/bash nodejs nodejs
#USER nodejs
#WORKDIR /home/nodejs/app
WORKDIR /usr/src/app
ENV  NODE_ENV production
COPY package-lock.json package.json ./
RUN npm install --production
COPY dist/ .
CMD ["node", "server.js"]