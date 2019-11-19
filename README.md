# DASHBOARD

 

 ## Summary

 

- [Installation](#installation)
- [Install using Node](#if-you-choose-node-follow-the-next-steps)
- [Running](#running)
- [Browser](#browser)
- [Services](#services)
- [How does it work ?](#how-does-it-work-)
- [Made with](#made-with)
- [Authors](#authors) 

 

## /!\Warning/!\

***Depending on the installation check the app.js file at the root of the project and mainly the part :***

`connect to mongoDB` --> Ligne 61

 

## Installation

 

### If you choose Docker 

 

- `//connect to mongoDB
mongoose.connect('mongodb://mongo:27017', () => {
console.log('connected');
});`

 

### If you choose Node

 

- `//connect to mongoDB
mongoose.connect('mongodb://localhost/tuto', {
console.log('connected');
});`

 

## If you choose Node follow the next steps

 

Create folders with a terminal :
` ~  ➜  mkdir -p /data/db`

 

Start mongoDB in a terminal :
`mongod --dbpath=/home/username/data/db`

 

Change    **home** and   **username** with your setting.

 

#### NPM 
```bash
npm install
```

 

#### Docker 
```bash
docker-compose build
```

 

## Running
#### Docker 
```bash
docker-compose up
```
#### NPM 
```bash
node app.js
```

 

## Browser 
    
Then open [localhost:8080](http://localhost:8080) with your favorite browser.

 

## Services

<img align="left" width="20px" height="20px" src="https://img.icons8.com/color/48/000000/microsoft-yammer-2019.png">

### Yammer
 
<img align="left" width="20px" height="20px" src="https://img.icons8.com/officel/16/000000/facebook.png">

### Facebook


<img align="left" width="20px" height="20px" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/1200px-Octicons-mark-github.svg.png">
 

### Github

 

<img align="left" width="20px" height="20px" src="https://image.flaticon.com/icons/svg/145/145804.svg">

 

### Google

 

<img align="left" width="30px" height="30px" src="https://www.logolynx.com/images/logolynx/64/648e9febc758919d51d8cd0b520af022.jpeg"> 

 

### Office 365

 

<img align="left" width="20px" height="20px" src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Oauth_logo.svg/598px-Oauth_logo.svg.png">

 

OAuth2.0

 

## Widgets

 

<img align="left" width="30px" height="30px" src="https://www.logolynx.com/images/logolynx/64/648e9febc758919d51d8cd0b520af022.jpeg">

 

### Office 365

 

* Outlook mail : show   **X** number of mail
* Outlook calendar : show   **X** number of events
* Outlook contact : show   **X** number of contact

 

<img align="left" width="30px" height="30px" src="https://image.flaticon.com/icons/svg/831/831268.svg">

 

### Weather

 

* Map : Show the map

 

* Current : show the current temperature of a city

 

<img align="left" width="30px" height="30px" src="https://image.flaticon.com/icons/svg/124/124033.svg">

 

### RSS

 

* RSS : show   **X** number of article of a defined Blog URL

 

<img align="left" width="60px" height="30px" src="http://www.citizencapital.fr/wp-content/uploads/2018/10/logo-lemonde-1.png">

 

### Le monde

 

#### Widget

 

* Article : show   **X** article of   **Y** country

 

_(X or Y = a number you choose when you add the widget)_

 

## How does it work?

 

<img width="800px" height="400px" src="https://i.ibb.co/mGBJw7g/uml.jpg">

 

## Made with

 

<img width="900px" height="600px" src="https://i.ibb.co/BNmKqDR/uml2.png">

 

* [node.js](https://nodejs.org)
* [EJS](http://ejs.co)
* [MongoDb](http://mongodb.com)

 

## Authors

* **Romain NILLY** romain.nilly@epitech.eu
* **Thibaut CHEN** thibaut.chen@epitech.eu
