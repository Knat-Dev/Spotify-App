FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# where available (npm@5+)
COPY package.json ./
COPY yarn.lock ./

RUN yarn

# Bundle app source
COPY . .
COPY .env.production .env

RUN yarn build:once
# If you are building your code for production
# RUN npm ci --only=production



ENV NODE_ENV production

EXPOSE 8080
CMD [ "node", "build/index.js" ]
USER node