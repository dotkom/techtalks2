# Build the react frontend 
FROM node:12 as builder

WORKDIR /tmp/frontend

COPY frontend/package.json .
COPY frontend/package-lock.json .

RUN npm install

ADD frontend .

RUN npm run build

######################################
FROM node:12

WORKDIR /srv/app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY --from=builder /tmp/frontend/build public/

COPY . .

EXPOSE 8080

CMD npm start