const {MongoClient} = require('mongodb');
const fs = require('fs');
const assert = require('assert');
const path = require('path');
const csv = require('fast-csv');

describe('Patients unit test', () => {
  let connection;
  let db;
  let file;

  before(async () => {
  connection = await MongoClient.connect('mongodb://127.0.0.1:27017', {
    useNewUrlParser: true,
  });
  db = connection.db('Patients');
  fileCSV = fs.createReadStream(path.resolve('./', 'assets', 'patients.csv'));
  });

  after(async () => {
    await connection.close();
  });

  it('check consistencies', async() => {
    const patientsCollection = await db.collection('Patients');
    const emailsCollection = await db.collection('Emails');
    const patients = await patientsCollection.find({},{projection:{ _id: 0 }}).toArray();
    const emails =  await emailsCollection.find({},{projection:{ _id: 0, email: 1 }}).toArray();
    const patientsArray = [];
    const emailsArray = [];
    const consentEmails = [];
    const emptyEmails = [];
    const emptyFirstName = [];
    fileCSV.pipe(csv.parse({ headers: true, delimiter: '|' }))
      .on('data', row => {
        patientsArray.push(row);

        if (row['CONSENT'].toUpperCase() === 'Y' && row['Email Address'].trim()) {
          consentEmails.push({email: row['Email Address']})
        }

        if (row['CONSENT'].toUpperCase() === 'Y' && !row['Email Address'].trim()) {
          emptyEmails.push(row['Member ID'])
        }

        if (row['First Name'].trim() === '') {
          emptyFirstName.push(row['Member ID'])
        }
      })
      .on('error', error => console.error(error))
      .on('end', rowCount => {
        // Verify the data in flat file matches the data in Patients collection
          describe('Flat file matches data collection', () => {
            it('Patients', ()=> {
              assert(JSON.stringify(patients) === JSON.stringify(patientsArray));
            })
          })

          describe('File consistencies', () => {
            it('Consented with empty emails', ()=> {
              if (emptyEmails) {
                assert.fail(`${emptyEmails.length>1 ? 'Patients' : 'Patient'} ${emptyEmails} - empty email`)
              };
            });

            it('Empty first name', ()=> {
              if (emptyFirstName) {
                assert.fail(`${emptyFirstName.length>1 ? 'Patients' : 'Patient'} ${emptyFirstName} - empty first name`)
              }
            });
          })

          describe('Emails collection check', () => {
            it('Emails collection matches consented emails from file csv', ()=> {
              assert(JSON.stringify(consentEmails) !== JSON.stringify(emails), 'Consent Emails collection not match with file')
            })
          })

      });
  }

)});