# Backend Server - NC News API

Find hosted version here: https://tims-nc-news-39.herokuapp.com/api

## Introduction

This is a backend server api built as part of my time on the Northcoders bootcamp. This project is to showcase what I have learnt about backend development, from using express.js to setup the project with postgresql as my database to testing my project with Jest and hosting it all with Heroku

### Technologies used to develop this project:
 [![Javascript]][Javascript-url]
<br> [![Node.js]][Node.js-url]
<br> [![Express.js]][Express.js-url]
<br> [![Postgresql]][Postgresql-url]
<br> [![Heroku]][Heroku-url]
<br> [![Jest]][Jest-url]
<br> [![VSCode]][VSCode-url]
## How to setup project

1. Clone the repo
   ```sh
   git clone https://github.com/TKCSeow/backend-server-nc-news.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Setup the dev & test environments 
   > 1. Create two files in the root directory of this project: ".env.development" & ".env.test"
   > 2. Inside ".env.development" add the line `PGDATABASE=nc_news`, inside ".env.test" add `PGDATABASE=nc_news_test`
   > 3. Double check that these .env files are .gitignored
   > 4. (Optional) In some cases you may need be required to add a password to the .env files depending on what operating system you are using. To do this, in each of the .env files, add `PGPASSWORD=<your_psql_password>` before `PGDATABASE`

4. Initialise databases
    ```sh
    npm run setup-dbs
    ```

## How to run tests
To ensure everything setup and working correctly, it is recommend to run the tests with:
```sh
npm test
```

## How to run dev environment
1. Seed the database
```sh
npm run seed
```

2. Start the server
```sh
npm start
```

3. Using an API client for your choice (e.g. Insomnia), access the server with:
```
localhost:9090/api
```

## Minimum Requirements

<p>Node.js version 18 or higher</p>
<p>Postgres version 12 or higher</p>

[Node.js-url]: https://nodejs.org/
[Node.js]: https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white
[Javascript-url]: https://www.javascript.com/
[Javascript]: https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black
[Express.js-url]: https://expressjs.com/
[Express.js]: https://img.shields.io/badge/Express.js-404D59?style=for-the-badge
[Postgresql-url]: https://www.postgresql.org/
[Postgresql]: https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white
[Heroku-url]: https://www.heroku.com/home
[Heroku]: https://img.shields.io/badge/Heroku-430098?style=for-the-badge&logo=heroku&logoColor=white
[Jest-url]: https://jestjs.io/
[Jest]: https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white
[VSCode-url]: https://code.visualstudio.com/
[VSCode]: 	https://img.shields.io/badge/Visual_Studio_Code-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white
