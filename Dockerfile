# Etapa de build
FROM node:20.15.0 AS base

WORKDIR /app

COPY package.json /app/

RUN npm install -f

COPY . /app/

ARG PROFILE
RUN echo "Configuration Profile: ${PROFILE}"
RUN ls -la /app
RUN npm run build -- --output-path=./dist/out --configuration ${PROFILE}

# Etapa de produção
FROM nginx:1.17.1-alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=base /app/dist/out/ /usr/share/nginx/html

CMD ["/bin/sh", "-c", "nginx -g 'daemon off;'"]
