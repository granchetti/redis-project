FROM node:23-slim AS build

WORKDIR /usr/src/app

COPY package*.json tsconfig.json ./
RUN npm install

COPY ./src ./src
COPY ./data ./data
RUN npx tsc

RUN cp src/swagger.yaml dist/swagger.yaml

FROM node:23-slim

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/data ./data
RUN npm install --only=production

EXPOSE 5000

CMD [ "node", "dist/server.js" ]
