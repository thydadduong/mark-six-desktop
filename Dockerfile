FROM node:lts AS builder
RUN mkdir -p workspace
WORKDIR /workspace

COPY ./package.json ./
COPY ./yarn.lock ./
RUN yarn install

COPY . .

RUN yarn build

FROM node:lts-alpine AS workspace

COPY --from=builder /workspace ./workspace

WORKDIR /workspace

RUN chmod +x ./docker-entrypoint.sh

ENV SHELL /bin/sh