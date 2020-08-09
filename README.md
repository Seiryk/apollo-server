## Description
HirePro is the project to make people and companies succeed.

## Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop)
- [MongoDB Compass](https://www.mongodb.com/products/compass) MongoDB NoSql GUI client

## Local Dev Environment

Just run `docker-compose up -d --build` in order to have reqired services up and running with up to date built service.
`docker-compose down` will stop all the services and remove related containers. Also to prune all mounted resources and start from scratch please use `docker system prune --volumes`

To make data persistant please use `named volumes` see bottom line in `docker-compose.yml` as an example. This last line will create volume by default in `var/lib/docker/volumes/fac362...80535/_your_path` here is how it could be customized
```
volumes:
  mongo-data:
    driver: local
    driver_opts:
      type: 'none'
      o: 'bind'
      device: '/your/local/path'
```
Each time you've changed _mongo users_ in the backend part of the code please run **prune volume** see command above. In case you've changed anything in _docker-compose.yaml_ see commands list below (**for those who isn't big expert in docker just for help**)
```
docker-compose down
docker system prune --volumes !!! if needed clean data base
docker-compose up -d --build
```

## Node Service

Once service is up it's going to listen on `http://localhost:4444`. This request will result in following response 'Hello World' meaning it's alive. Another endpoint is available `http://localhost:4444/graphql` which is going to govern all domain requests.