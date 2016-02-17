# Spotlight Dashboard
**Frontend app for the Spotlight dashboard**

## Setup instruction

 - Make sure you are using Node v5.4.0
 ```
nvm install v5.4.0
nvm use v5.4.0
 ```

 - Install all the requirements
 ```
npm install
 ```

 - Run the server
 ```
API_HOST=http://localhost:3000 npm start
 ```

 - View the latest version of the application at `http://localhost:8080/`

## Compiling Static Assets

- `NODE_ENV=production API_HOST=http://spotlight.herokuapp.com webpack -p`

## Building Docker Image

- `docker build -t spotlight-frontend .`