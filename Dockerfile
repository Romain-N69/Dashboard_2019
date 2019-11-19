FROM node:8.12-stretch

RUN apt-get update && apt-get -y upgrade

#RUN sudo apt-get install nodejs

RUN mkdir -p /app

WORKDIR /app

RUN mkdir -p app/src/

COPY package.json /app/package.json

ADD package-lock.json /app/package-lock.json

COPY app.js /app/app.js

COPY models/ /app/models/

COPY views/ /app/views/

COPY designCss/ /app/designCss/

COPY backbone/ /app/backbone/

COPY assets/ /app/assets/

COPY routes/ /app/routes/

COPY wait-for.sh/ /app/wait-for.sh

EXPOSE 8080

RUN npm install --silent

CMD [ "node", "app.js" ]