# To run the application

## Server: 
- Change the data-source.ts file to include your mysql password and username
- create a connection in sql workbench and run this command, replacing the username and password fields 
`ALTER USER 'username'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';`
- next run this command
`flush privileges;`
- You can also create user using this command and grant it access to the database, using the username and password you added to the data-source.ts if its not root. `CREATE USER 'username'@'host' IDENTIFIED BY 'password'` then run this command to grant it access to the db `GRANT ALL ON database-name.* TO 'username'@'host'` also flush priviledges
- next cd into the server directory and run `npm install && npm start`
- if you get a database sleep not found error. Open SQL workbench, open the connection to the sleep database you made and run the this command `CREATE database sleep`. Then rerun `npm start`

## Client
- cd into the react-client directory and run `npm install && npm start`


# Changes i would make:
- Add CSP
- Add jest unit tests for apis, mocking api calls
- Allow authentication, store token securely (as a secure cookie)
- Thorough validation of form data (no future sleep dates)
- Allow editing of a record
- Audit logging of successfull and failed post, put and delete requests
- Fixing UI as it could do with alot of improvement
- Including extra fields such as Age
- Using a sleep start and end time and infering the duration from that, this would also allow for better validation of overlapping sleeptimes
- Maybe allow for exporting of data as a csx, xlsx
- Converting gender to an entity so that an 'Admin' user can maintain that as opposed to having a static options list in the client 
- Avoid duplication of data in the SleepCharts table by only using the SleepSchedule data and getting the list of data needed for the SleepSchedule list page by querying the SleepSchedule table, accumulating the results and calculating the count before returning it.
