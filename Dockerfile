FROM node:18 AS build

WORKDIR /usr/src/app

COPY package*.json tsconfig.json ./

RUN npm install

COPY ./src ./src
COPY ./data ./data

RUN npx tsc

RUN cp src/swagger.yaml dist/swagger.yaml

FROM node:18

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY package*.json ./

RUN npm install --only=production

COPY entrypoint.sh /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh

EXPOSE 5000

CMD [ "node", "dist/index.js" ]
