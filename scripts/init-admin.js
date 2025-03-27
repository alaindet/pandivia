const admin = require("firebase-admin");
const serviceAccount = require("../service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const userId = process.argv[2];
const displayName = process.argv[3];

console.log(`Selected user: ${userId}`);

(async function () {
  await admin.auth().setCustomUserClaims(userId, { role: "admin" });
  await admin.auth().updateUser(userId, { displayName });
  console.log(`User "${userId}" set as admin`);
})();
