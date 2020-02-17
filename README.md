# Express REST API

## Installation:
* Install PostgreSQL
* Install dependencies: `npm install`
* Create database specified by configuration: `sequelize db:create`
* Run migrations `npm run migrate`

## Run the project (development):
* Rename `.env.exaple` to `.env`
* Set the correct environments to `.env`
* Run `npm start`
* Open project docs: [http://localhost:8080/api/docs](http://localhost:8080/api/docs/)

## Run tests:
* Create database: `NODE_ENV=test sequelize db:create`
* Run tests: `npm test`


## Run the project in docker (dev)
* Run with composer: `docker-compose up dev`
* Connect to container: `docker exec -it container_name bash`
* Create db: `node_modules/.bin/sequelize db:create --url 'postgres://postgres:postgres@database:5432/docker-express-api'`


## Other docker commands
* Build container `docker build -t express-api .`
* Run container `docker run -it express-api`
* Create volume `docker volume create --name=express-api-data`


## Working with migrations

###### Generate new migration
```bash
sequelize migration:generate --name create-product
```
###### Run pending migrations
```bash
sequelize db:migrate
```
###### Revert a migration by name
```bash
sequelize db:migrate:undo --name 20191104111235-create-product.js
```
 