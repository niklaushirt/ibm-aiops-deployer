FROM node:14

EXPOSE 8000
WORKDIR /opt/eum-sim

COPY package.json /opt/eum-sim/
RUN npm install

COPY . /opt/eum-sim/

ENV PORT=8000 \
    CONFIG=config-shop

CMD ["/opt/eum-sim/bin/www"]

