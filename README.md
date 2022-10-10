# Backend Server - Northcoders News API

## Introduction

This is a backend server for a news api


## How to set up dev & test environments

1. Create two files in the root directory of this project: ".env.development" & ".env.test"

2. Inside ".env.development" add the line `PGDATABASE=nc_news`, inside ".env.test" add `PGDATABASE=nc_news_test`

3. Double check that these .env files are .gitignored

4. (Optional) In some cases you may need be required to add a password to the .env files depending on what operating system you are using. To do this, in each of the .env files, add `PGPASSWORD=<your_psql_password>` before `PGDATABASE`