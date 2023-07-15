const admin = require('firebase-admin');
const serviceAccount = require('../service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const userId = process.argv[2];

console.log(`Selected user: ${userId}`);

(async function() {
  await admin.auth().setCustomUserClaims(userId, { role: 'admin ' });
  console.log(`User "${userId}" set as admin`);
})()
