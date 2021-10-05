# Patients
## Parallelstaff test

### Instalation
- git clone https://github.com/maabreve/Patients.git
- cd Patients && npm install (yarn)

### Prerequisites
- MongoDB running locally at 127.0.0.1:27017

### Run server
- node server.js - By running this command, the collections Patients and Emails will be created at the Patients database

### Run unit tests
- mocha  scripts/unit-tests/server.test.js