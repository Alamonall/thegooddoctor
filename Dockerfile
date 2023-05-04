FROM node:16 as builder
ARG NPM_TOKEN
WORKDIR /builder
COPY . .
RUN npm install && \
    npm run build && \
    npm install --omit=dev --prefix dist/

FROM node:16-slim
WORKDIR /app
COPY --from=builder --chown=node:node /builder/dist .
RUN chown node:node /app
USER node
CMD ["node", "src/index.js"]
