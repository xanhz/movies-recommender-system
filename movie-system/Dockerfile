FROM node:18-alpine AS source
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn prisma generate
RUN yarn build

FROM node:18-alpine
WORKDIR /app
COPY --from=source /app/dist ./dist
COPY --from=source /app/node_modules/.prisma/client ./node_modules/.prisma/client
COPY ["package.json", "yarn.lock", "./"]
RUN yarn install --prod=true
ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000
CMD ["node", "dist/main.js"]
