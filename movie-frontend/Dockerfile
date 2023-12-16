# Build react app
FROM node:18-alpine as source

ARG MOVIE_SITE_NAME=Movies
ARG MOVIE_SYSTEM_BASE_URL=http://localhost:5000
ARG TMDB_IMAGE_URL=https://image.tmdb.org/t/p

ENV VITE_SITE_NAME=$MOVIE_SITE_NAME
ENV VITE_MOVIE_SYSTEM_BASE_URL=$MOVIE_SYSTEM_BASE_URL
ENV VITE_TMDB_IMAGE_URL=$TMDB_IMAGE_URL

WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build

# Build production image
FROM node:18-alpine
WORKDIR /app
COPY --from=source /app/dist ./dist
COPY --from=source /app/server.js ./
RUN yarn add express
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["node", "server.js"]
