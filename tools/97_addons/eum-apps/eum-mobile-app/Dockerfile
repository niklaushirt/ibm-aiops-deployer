FROM node:21
WORKDIR /opt/mobile-app-monitoring-simulator
COPY package.json yarn.lock src ./
RUN yarn install --production
CMD [ "yarn", "start" ]

