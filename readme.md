# Spotlight Dashboard
**Frontend app for the Spotlight dashboard**

[![Build Status](https://travis-ci.org/pivotal-sg/spotlight-dashboard.svg?branch=develop)](https://travis-ci.org/pivotal-sg/spotlight-dashboard)

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

## Contributors

- [Divya Bhargov](https://github.com/divyabhargov)
- Erika Buenaventura
- [Gabe Hollombe](https://github.com/gabehollombe)
- [Michael Cheng](https://github.com/miccheng)
- [Rahul Rajeev](https://github.com/rhlrjv)

## License

**The MIT License (MIT)**
Copyright (c) 2016 Pivotal Labs Singapore

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
