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

## Rebuilding the Docker container

1. Rebuild the local Docker image

  ```
docker build -t spotlight-dashboard .
```

2. Check for the image ID

  ```
➜  spotlight git:(docker) ✗ docker images
REPOSITORY                       TAG                 IMAGE ID            CREATED             VIRTUAL SIZE
spotlight-dashboard              latest              ba3dcc9b42b1        16 seconds ago      954.3 MB
```

3. Login to your Docker account (one time exercise) with `docker login`:

  ```
➜  spotlight git:(docker) ✗ docker login
Username (miccheng):
WARNING: login credentials saved in /Users/miccheng/.docker/config.json
Login Succeeded
```

4. Tag the image

  ```
docker tag ba3dcc9b42b1 neosgspotlight/spotlight-dashboard:latest
```

5. Push to Docker Hub

  ```
docker push neosgspotlight/spotlight-dashboard
```
