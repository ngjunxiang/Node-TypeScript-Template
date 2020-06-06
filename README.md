# Node-TypeScript-Template

Steps to run this project:

1. Run `npm i` command to install dependencies
2. Setup database settings inside `ormconfig.json` file
3. Run `npm start` command
4. Run `npm run migration:run` command to create users
    * Install PostgreSQL by `brew install postgresql`
    * Setup user and database
        * `psql -U postgres`
        * `CREATE ROLE admin LOGIN password 'password';`
        * `CREATE DATABASE app_db ENCODING 'UTF8' OWNER admin;`
    


To create migrations for other entities, run `typeorm migration:create -n CreateAdminUser`