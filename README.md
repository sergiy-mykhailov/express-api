# Express REST API

## Installation:
* Install PostgreSQL
* Install dependencies: `npm install`
* Create database specified by configuration: `sequelize db:create`
* Run migrations

## Run the project (development):
* Rename `.env.exaple` to `.env`
* Set the correct environments to `.env`
* Run `npm start`
* Open project docs: [http://localhost:8080/api/docs](http://localhost:8080/api/docs/)

## Run tests:
* Create database: `NODE_ENV=test sequelize db:create`
* Run tests: `npm test`


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
 