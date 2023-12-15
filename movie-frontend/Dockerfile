FROM node:18-alpine as source
ENV VITE_SITE_NAME=${MOVIE_SITE_NAME}
ENV VITE_MOVIE_SYSTEM_BASE_URL=${MOVIE_SYSTEM_BASE_URL}
ENV VITE_TMDB_IMAGE_URL=${TMDB_IMAGE_URL}
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build

FROM nginx:1.17-alpine
COPY --from=source /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
