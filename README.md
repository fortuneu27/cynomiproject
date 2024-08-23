# To run the application

## Server: 
- Change the data-source.ts file to include your mysql password and username
- create a connection in sql workbench and run this command, replacing the username and password fields 
`ALTER USER 'username'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';`
- next run this command
`flush privileges;`
- next cd into the server directory and run `npm install && npm start`
- if you get a database sleep not found error. Open SQL workbench, open the connection to the sleep database you made and run the this command `CREATE database sleep`. Then rerun `npm start`

## Client
- cd into the reac-client directory and run `npm install && npm start`


# Changes i would make:
Add CSP
Add ject unit tests for apis
Allow authentication
Thorough validation of form data (no future sleep dates)
Allow editing of a record
Audit logging of successfull and failed post, put and delete requests