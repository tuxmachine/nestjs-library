FROM node:18

RUN npm install --global pnpm

WORKDIR /app
COPY package.json .
COPY pnpm-lock.yaml .

RUN pnpm install

# This is just a dev image, an image for production should be optimized
# for size and hardenend for security
CMD pnpm run start:dev
