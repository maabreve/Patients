const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const db = require( './db' );

db.connect(() => {
  const patientsDb = db.get();
  const patientsCollection = patientsDb.collection('Patients');
  const emailsCollection = patientsDb.collection('Emails');
  const patientsArray = [];
  const emailsArray = [];

  console.log('Database connected!')

  let contEmails = 1;

  // Read and create Patients and Emails documents
  fs.createReadStream(path.resolve(__dirname, 'assets', 'patients.csv'))
    .pipe(csv.parse({ headers: true, delimiter: '|' }))
    .on('data', row => {
      patientsArray.push(row);

      if (row['CONSENT'].toUpperCase() === 'Y' && row['Email Address'].trim()) {
        const today = new Date();
        emailsArray.push({
          email: row['Email Address'],
          name: `Day ${contEmails}`,
          scheduled_date: new Date(today.setDate(today.getDate() + contEmails)).toISOString()
        });

        contEmails++;
      }
    })
    .on('error', error => console.error(error))
    .on('end', rowCount => {
      patientsCollection.insertMany(patientsArray, (err, result) => {
        if (err) console.log(err);
        if(result){
          console.log('Patients imported into database successfully.');
        }
      });

      emailsCollection.insertMany(emailsArray, (err, result) => {
        if (err) console.log(err);
        if(result){
          console.log('Emails imported database successfully.');
        }
      });
    });
  }
);
