const admin = require('firebase-admin');

// ID 토큰 검증은 공개키만 필요하므로 projectId 만 있으면 된다.
function getAuth() {
  if (!admin.apps.length) {
    if (!process.env.FIREBASE_PROJECT_ID) {
      throw new Error('FIREBASE_PROJECT_ID is not set');
    }
    admin.initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID });
  }
  return admin.auth();
}

module.exports = { getAuth };
