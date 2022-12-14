## Before starting the server
- this app can be run without docker, however, it is used for the backend server to ease the process of local set up
- install docker desktop, docker and `docker-compose`
- open docker desktop

## To start the API server
- run the command `docker-compose -f docker-compose.yml up --build -d`
- the command above will build a docker image and run it as a container
- check if the container is running on docker desktop
- click into the running container, you may see a log which looks similar to this `Uvicorn running on http://0.0.0.0:80 (Press CTRL+C to quit)`
- the server is up, follow the link to access the server

## Notes
- if `http://0.0.0.0:80` is not working on your side, you may try `http://localhost:80` or `http://localhost`
- to access the interactive API documentation (Swagger UI), you may go to `http://0.0.0.0/docs` or `http://localhost/docs`