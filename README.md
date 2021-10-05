# Patients

### Installation
- git clone https://github.com/maabreve/Patients.git
- cd Patients && npm install (yarn)

### Prerequisites
- MongoDB running locally at 127.0.0.1:27017

### Running the server in dev mode
- npm run dev (the Patients and Emails collections will be created in the Patients database when the server is started.)

### Running the unit tests
- npm run test


### Files

- db.js - mongodb connection instance
- server.js - start the server and generate the Patients and Emails collections for
- scripts/unit-tests/server.test.js - unit test
- assets/patients.csv - patients csv file