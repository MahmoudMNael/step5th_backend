import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

const serviceAccount = require('../firebase.json') as ServiceAccount;

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

export { admin as firebaseAdmin };
