FROM node:10-alpine AS builder

ARG NODE_MEMORY_LIMIT=128
ENV NODE_MEMORY_LIMIT=${NODE_MEMORY_LIMIT}

WORKDIR /home/node
COPY . .

COPY ./app/database/db.sample.json ./app/database/db.json

RUN npm install --only=production && \
    npm cache clean --force

EXPOSE 21987

ENTRYPOINT ["/home/node/entrypoint.sh"]
CMD ["./app/server.js"]