FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /static

COPY nginx.conf /etc/nginx/nginx.conf.template
COPY entry.sh .

ENV BACKEND_URL http://192.168.1.115:8080

EXPOSE 80

CMD ["/bin/sh", "/entry.sh"]
